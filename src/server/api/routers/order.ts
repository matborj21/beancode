import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { VAT_RATE } from "@/lib/constants";

function generateOrderNumber(): string {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `ORD-${timestamp}-${random}`;
}

export const orderRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        items: z.array(
          z.object({
            productId: z.string(),
            quantity: z.number().int().positive(),
            price: z.number().positive(),
          }),
        ),
        paymentMethod: z.enum(["CASH", "GCASH", "CARD"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // 1. Validate stock for all items
      for (const item of input.items) {
        const inventory = await ctx.db.inventory.findUnique({
          where: { productId: item.productId },
        });

        if (!inventory) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Inventory not found for product ${item.productId}`,
          });
        }

        if (inventory.stock < item.quantity) {
          const product = await ctx.db.product.findUnique({
            where: { id: item.productId },
          });
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Insufficient stock for ${product?.name ?? item.productId}. Available: ${inventory.stock}`,
          });
        }
      }

      // 2. Calculate totals
      const subtotal = input.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
      const vat = subtotal * VAT_RATE;
      const total = subtotal + vat;

      // 3. Create transaction + items + deduct inventory atomically
      const transaction = await ctx.db.$transaction(async (tx) => {
        const created = await tx.transaction.create({
          data: {
            orderNumber: generateOrderNumber(),
            subtotal,
            vat,
            total,
            paymentMethod: input.paymentMethod,
            status: "PAID",
            items: {
              create: input.items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
              })),
            },
          },
          include: { items: true },
        });

        // Deduct inventory for each item
        for (const item of input.items) {
          await tx.inventory.update({
            where: { productId: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
        }

        // Deduct supplies based on recipes
        for (const item of input.items) {
          const recipes = await tx.recipe.findMany({
            where: { productId: item.productId },
          });

          for (const recipe of recipes) {
            await tx.supply.update({
              where: { id: recipe.supplyId },
              data: {
                stock: {
                  decrement: recipe.amount * item.quantity,
                },
              },
            });
          }
        }

        return created;
      });

      return transaction;
    }),

  list: publicProcedure
    .input(
      z.object({
        from: z.date().optional(),
        to: z.date().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.transaction.findMany({
        where: {
          ...((input.from ?? input.to)
            ? {
                createdAt: {
                  ...(input.from ? { gte: input.from } : {}),
                  ...(input.to ? { lte: input.to } : {}),
                },
              }
            : {}),
        },
        include: {
          items: {
            include: { product: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    }),
});
