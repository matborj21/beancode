import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { productRouter } from "@/server/api/routers/product";
import { orderRouter } from "@/server/api/routers/order";
import { reportRouter } from "./routers/report";

export const appRouter = createTRPCRouter({
  product: productRouter,
  order: orderRouter,
  report: reportRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
