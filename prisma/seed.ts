import bcrypt from "bcryptjs";
import {
  PrismaClient,
  PaymentMethod,
  TransactionStatus,
} from "../generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data
  await prisma.transactionItem.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // --- Categories ---
  const espresso = await prisma.category.create({ data: { name: "Espresso" } });
  const nonCaffeine = await prisma.category.create({
    data: { name: "Non-Caffeine" },
  });
  const pastry = await prisma.category.create({ data: { name: "Pastry" } });
  const specials = await prisma.category.create({ data: { name: "Specials" } });

  console.log("✅ Categories created");

  // --- Products ---
  const products = [
    // Espresso
    {
      name: "Espresso",
      price: 90,
      categoryId: espresso.id,
      imageUrl:
        "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400",
    },
    {
      name: "Americano",
      price: 110,
      categoryId: espresso.id,
      imageUrl:
        "https://images.unsplash.com/photo-1534778101976-62847782c213?w=400",
    },
    {
      name: "Cappuccino",
      price: 130,
      categoryId: espresso.id,
      imageUrl:
        "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400",
    },
    {
      name: "Latte",
      price: 140,
      categoryId: espresso.id,
      imageUrl:
        "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=400",
    },

    {
      name: "Flat White",
      price: 150,
      categoryId: espresso.id,
      imageUrl:
        "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=400",
    },

    // Non-Caffeine
    {
      name: "Matcha Latte",
      price: 150,
      categoryId: nonCaffeine.id,
      imageUrl:
        "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400",
    },
    {
      name: "Chocolate",
      price: 130,
      categoryId: nonCaffeine.id,
      imageUrl:
        "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400",
    },
    {
      name: "Strawberry Milk",
      price: 120,
      categoryId: nonCaffeine.id,
      imageUrl:
        "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400",
    },

    // Pastry
    {
      name: "Croissant",
      price: 85,
      categoryId: pastry.id,
      imageUrl:
        "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400",
    },
    {
      name: "Blueberry Muffin",
      price: 95,
      categoryId: pastry.id,
      imageUrl:
        "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400",
    },
    {
      name: "Cinnamon Roll",
      price: 110,
      categoryId: pastry.id,
      imageUrl:
        "https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=400",
    },

    // Specials
    {
      name: "Cold Brew Float",
      price: 175,
      categoryId: specials.id,
      imageUrl:
        "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400",
    },
    {
      name: "Caramel Macchiato",
      price: 165,
      categoryId: specials.id,
      imageUrl:
        "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400",
    },
  ];

  for (const product of products) {
    const created = await prisma.product.create({
      data: {
        name: product.name,
        price: product.price,
        categoryId: product.categoryId,
        imageUrl: product.imageUrl,
        isActive: true,
      },
    });

    // Create inventory for each product
    await prisma.inventory.create({
      data: {
        productId: created.id,
        stock: 50,
      },
    });
  }

  console.log("🌱 Seeding supplies...");

  // Create supplies
  const beans = await prisma.supply.upsert({
    where: { name: "Coffee Beans" },
    update: {},
    create: {
      name: "Coffee Beans",
      unit: "GRAMS",
      stock: 5000,
      minStock: 500,
    },
  });

  const milk = await prisma.supply.upsert({
    where: { name: "Milk" },
    update: {},
    create: {
      name: "Milk",
      unit: "ML",
      stock: 10000,
      minStock: 1000,
    },
  });

  const syrup = await prisma.supply.upsert({
    where: { name: "Syrup" },
    update: {},
    create: {
      name: "Syrup",
      unit: "ML",
      stock: 3000,
      minStock: 300,
    },
  });

  const cups = await prisma.supply.upsert({
    where: { name: "Cups" },
    update: {},
    create: {
      name: "Cups",
      unit: "UNITS",
      stock: 500,
      minStock: 50,
    },
  });

  const sugar = await prisma.supply.upsert({
    where: { name: "Sugar" },
    update: {},
    create: {
      name: "Sugar",
      unit: "GRAMS",
      stock: 5000,
      minStock: 500,
    },
  });

  const cream = await prisma.supply.upsert({
    where: { name: "Cream" },
    update: {},
    create: {
      name: "Cream",
      unit: "ML",
      stock: 3000,
      minStock: 300,
    },
  });

  console.log("✅ Supplies created");

  // Fetch all products to set up recipes
  const allProducts = await prisma.product.findMany({
    include: { category: true },
  });

  // Helper to find product by name
  const findProduct = (name: string) =>
    allProducts.find((p) => p.name === name);

  // Define recipes per product
  const recipes: Array<{
    productName: string;
    ingredients: Array<{ supplyId: string; amount: number }>;
  }> = [
    {
      productName: "Espresso",
      ingredients: [
        { supplyId: beans.id, amount: 18 },
        { supplyId: cups.id, amount: 1 },
      ],
    },
    {
      productName: "Americano",
      ingredients: [
        { supplyId: beans.id, amount: 18 },
        { supplyId: cups.id, amount: 1 },
      ],
    },
    {
      productName: "Cappuccino",
      ingredients: [
        { supplyId: beans.id, amount: 18 },
        { supplyId: milk.id, amount: 120 },
        { supplyId: cups.id, amount: 1 },
      ],
    },
    {
      productName: "Latte",
      ingredients: [
        { supplyId: beans.id, amount: 18 },
        { supplyId: milk.id, amount: 180 },
        { supplyId: cups.id, amount: 1 },
      ],
    },
    {
      productName: "Flat White",
      ingredients: [
        { supplyId: beans.id, amount: 18 },
        { supplyId: milk.id, amount: 130 },
        { supplyId: cups.id, amount: 1 },
      ],
    },
    {
      productName: "Matcha Latte",
      ingredients: [
        { supplyId: milk.id, amount: 180 },
        { supplyId: cups.id, amount: 1 },
      ],
    },
    {
      productName: "Chocolate",
      ingredients: [
        { supplyId: milk.id, amount: 150 },
        { supplyId: cups.id, amount: 1 },
      ],
    },
    {
      productName: "Strawberry Milk",
      ingredients: [
        { supplyId: milk.id, amount: 150 },
        { supplyId: syrup.id, amount: 20 },
        { supplyId: cups.id, amount: 1 },
      ],
    },
    {
      productName: "Croissant",
      ingredients: [],
    },
    {
      productName: "Blueberry Muffin",
      ingredients: [],
    },
    {
      productName: "Cinnamon Roll",
      ingredients: [],
    },
    {
      productName: "Cold Brew Float",
      ingredients: [
        { supplyId: beans.id, amount: 25 },
        { supplyId: cream.id, amount: 60 },
        { supplyId: cups.id, amount: 1 },
      ],
    },
    {
      productName: "Caramel Macchiato",
      ingredients: [
        { supplyId: beans.id, amount: 18 },
        { supplyId: milk.id, amount: 150 },
        { supplyId: syrup.id, amount: 15 },
        { supplyId: cups.id, amount: 1 },
      ],
    },
  ];

  // Create recipes
  for (const recipe of recipes) {
    const product = findProduct(recipe.productName);
    if (!product) continue;

    for (const ingredient of recipe.ingredients) {
      await prisma.recipe.upsert({
        where: {
          productId_supplyId: {
            productId: product.id,
            supplyId: ingredient.supplyId,
          },
        },
        update: { amount: ingredient.amount },
        create: {
          productId: product.id,
          supplyId: ingredient.supplyId,
          amount: ingredient.amount,
        },
      });
    }
  }

  console.log("✅ Recipes created");

  const hashedPassword = await bcrypt.hash("admin123", 12);

  await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      email: "admin@beancode.com",
      name: "Admin User",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { username: "cashier1" },
    update: {},
    create: {
      username: "cashier1",
      email: "cashier1@beancode.com",
      name: "Cashier One",
      password: await bcrypt.hash("cashier123", 12),
      role: "CASHIER",
    },
  });

  await prisma.user.upsert({
    where: { username: "barista1" },
    update: {},
    create: {
      username: "barista1",
      email: "barista1@beancode.com",
      name: "Barista One",
      password: await bcrypt.hash("barista123", 12),
      role: "BARISTA",
    },
  });

  console.log("✅ Users seeded");

  console.log("✅ Products + Inventory created");

  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
