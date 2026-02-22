import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import bcrypt from "bcryptjs";

export const userRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.user.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        username: z.string().min(3),
        email: z.string().email().optional(),
        password: z.string().min(6),
        role: z.enum(["CASHIER", "BARISTA", "ADMIN"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.user.findFirst({
        where: {
          OR: [
            { username: input.username },
            ...(input.email ? [{ email: input.email }] : []),
          ],
        },
      });

      if (existing) {
        throw new Error("Username or email already exists.");
      }

      const hashedPassword = await bcrypt.hash(input.password, 12);

      return ctx.db.user.create({
        data: {
          name: input.name,
          username: input.username,
          email: input.email ?? null,
          password: hashedPassword,
          role: input.role,
        },
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        username: z.string().min(3).optional(),
        email: z.string().email().optional(),
        password: z.string().min(6).optional(),
        role: z.enum(["CASHIER", "BARISTA", "ADMIN"]).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, password, ...data } = input;

      const updateData: Record<string, unknown> = { ...data };

      if (password) {
        updateData.password = await bcrypt.hash(password, 12);
      }

      return ctx.db.user.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: { id: input.id },
        data: { isActive: false, deletedAt: new Date() },
      });
    }),
});
