import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const productRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        category: z.string().optional(),
        search: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.product.findMany({
        where: {
          isActive: true,
          ...(input.category && input.category !== "All"
            ? { category: { name: input.category } }
            : {}),
          ...(input.search
            ? { name: { contains: input.search, mode: "insensitive" } }
            : {}),
        },
        include: {
          category: true,
          inventory: true,
          recipes: true,
        },
        orderBy: { createdAt: "asc" },
      });
    }),

  getCategories: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.category.findMany({
      orderBy: { name: "asc" },
    });
  }),

  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        price: z.number().positive(),
        categoryId: z.string().optional(),
        imageUrl: z.string().url().optional(),
        stock: z.number().int().nonnegative(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const product = await ctx.db.product.create({
        data: {
          name: input.name,
          price: input.price,
          category: {
            connect: { id: input.categoryId },
          },
          imageUrl: input.imageUrl ?? null,
          isActive: true,
        },
      });

      await ctx.db.inventory.create({
        data: {
          productId: product.id,
          stock: input.stock,
        },
      });

      return product;
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1),
        price: z.number().positive(),
        categoryId: z.string().optional(),
        imageUrl: z.string().url().optional(),
        stock: z.number().int().nonnegative(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, stock, ...data } = input;
      const product = await ctx.db.product.update({
        where: { id },
        data,
      });

      if (stock !== undefined) {
        await ctx.db.inventory.update({
          where: { productId: id },
          data: { stock },
        });
      }

      return product;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.product.update({
        where: { id: input.id },
        data: { isActive: false },
      });
    }),
});
