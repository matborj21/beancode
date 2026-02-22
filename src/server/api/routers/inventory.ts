import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const inventoryRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.inventory.findMany({
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        product: {
          name: "asc",
        },
      },
    });
  }),

  updateStock: publicProcedure
    .input(
      z.object({
        productId: z.string(),
        stock: z.number().int().nonnegative(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.inventory.update({
        where: {
          productId: input.productId,
        },
        data: {
          stock: input.stock,
        },
      });
    }),

  restockAll: publicProcedure
    .input(z.object({ stock: z.number().int().min(0) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.inventory.updateMany({
        data: {
          stock: input.stock,
        },
      });
    }),
});
