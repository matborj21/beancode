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
