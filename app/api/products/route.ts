import { createProduct, getProducts } from "@/core/products.service";
import { NextResponse } from "next/server";

export const GET = async () => {
  const products = await getProducts();
  return NextResponse.json(products);
}

export const POST = async (req: Request) => {
  const body = await req.json();
  const product = await createProduct(body);
  return NextResponse.json(product, { status: 201 });
}