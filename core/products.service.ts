import { prisma } from "@/prisma/client";

//get all products
const getProducts = () => {
  const products = prisma.product.findMany({
    include: {category: true}
  });

  return products;
}

const createProduct = (data: {name:string, description?:string, price:number, categoryId:number}) => {
  return prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      categoryId: data.categoryId
    }
  });
}

export {getProducts, createProduct};