import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const reportRouter = createTRPCRouter({
  dailySales: publicProcedure
    .input(
      z.object({
        from: z.date().optional(),
        to: z.date().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const transactions = await ctx.db.transaction.findMany({
        where: {
          status: "PAID",
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
            include: {
              product: {
                include: { category: true },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      // Aggregate by product
      const productMap = new Map<
        string,
        {
          productId: string;
          name: string;
          category: string;
          quantity: number;
          price: number;
          salesTotal: number;
        }
      >();

      for (const transaction of transactions) {
        for (const item of transaction.items) {
          const existing = productMap.get(item.productId);
          const price = Number(item.price);
          const quantity = item.quantity;

          if (existing) {
            existing.quantity += quantity;
            existing.salesTotal += price * quantity;
          } else {
            productMap.set(item.productId, {
              productId: item.productId,
              name: item.product.name,
              category: item.product.category.name,
              quantity,
              price,
              salesTotal: price * quantity,
            });
          }
        }
      }

      const breakdown = Array.from(productMap.values());
      const totalQuantity = breakdown.reduce((s, p) => s + p.quantity, 0);
      const totalSales = breakdown.reduce((s, p) => s + p.salesTotal, 0);
      const totalOrders = transactions.length;

      return {
        breakdown,
        totalQuantity,
        totalSales,
        totalOrders,
      };
    }),
});
