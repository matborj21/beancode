import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { productRouter } from "@/server/api/routers/product";
import { orderRouter } from "@/server/api/routers/order";
import { reportRouter } from "./routers/report";
import { inventoryRouter } from "./routers/inventory";
import { supplyRouter } from "./routers/supply";
import { recipeRouter } from "./routers/recipe";

export const appRouter = createTRPCRouter({
  product: productRouter,
  order: orderRouter,
  report: reportRouter,
  inventory: inventoryRouter,
  supply: supplyRouter,
  recipe: recipeRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
