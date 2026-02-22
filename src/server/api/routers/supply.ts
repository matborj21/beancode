import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const supplyRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.supply.findMany({
      include: { recipes: true },
      orderBy: { name: "asc" },
    });
  }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        stock: z.number().min(0).optional(),
        minStock: z.number().min(0).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.supply.update({
        where: { id },
        data,
      });
    }),

  restock: publicProcedure
    .input(
      z.object({
        id: z.string(),
        amount: z.number().positive(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.supply.update({
        where: { id: input.id },
        data: { stock: { increment: input.amount } },
      });
    }),
});
