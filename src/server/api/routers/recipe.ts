import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const recipeRouter = createTRPCRouter({
  getByProduct: publicProcedure
    .input(z.object({ productId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.recipe.findMany({
        where: { productId: input.productId },
        include: { supply: true },
      });
    }),

  upsert: publicProcedure
    .input(
      z.object({
        productId: z.string(),
        supplyId: z.string(),
        amount: z.number().positive(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.recipe.upsert({
        where: {
          productId_supplyId: {
            productId: input.productId,
            supplyId: input.supplyId,
          },
        },
        update: { amount: input.amount },
        create: {
          productId: input.productId,
          supplyId: input.supplyId,
          amount: input.amount,
        },
      });
    }),

  delete: publicProcedure
    .input(
      z.object({
        productId: z.string(),
        supplyId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.recipe.delete({
        where: {
          productId_supplyId: {
            productId: input.productId,
            supplyId: input.supplyId,
          },
        },
      });
    }),
});
