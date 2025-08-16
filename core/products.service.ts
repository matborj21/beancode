import { prisma } from "@/prisma/client";

//get all products
const getProducts = () => {
  return prisma.product.findMany({include: {category: true}});
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