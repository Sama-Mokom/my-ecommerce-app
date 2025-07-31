import { Client } from "pg";

// Database update script to populate with existing product data
const updateDatabase = async () => {
  const client = new Client({
    host: "localhost",
    user: "postgres", 
    port: 5432,
    password: "Kaparaz", // Replace with your actual password
    database: "e-commerce",
  });

  try {
    console.log("Connecting to database...");
    await client.connect();
    console.log("✓ Connected to database");

    // Optional: Clear existing data
    const shouldClearData = process.argv.includes('--clear');
    if (shouldClearData) {
      await client.query('DELETE FROM products');
      console.log("✓ Cleared existing products");
    }

    // Insert products with new image paths
    const products = [
      {
        id: 1,
        name: "HAVIT HV-G92 Gamepad",
        image: "/uploads/products/gamepad.png",
        discount: "-40%",
        price: 120,
        originalPrice: 160,
        rating: 5,
        ratingCount: 88,
      },
      {
        id: 2,
        name: "AK-900 Wired Keyboard",
        image: "/uploads/products/keyboard.png",
        discount: "-35%",
        price: 960,
        originalPrice: 1160,
        rating: 4,
        ratingCount: 75,
      },
      {
        id: 3,
        name: "IPS LCD Gaming Monitor",
        image: "/uploads/products/monitor.png",
        discount: "-30%",
        price: 370,
        originalPrice: 400,
        rating: 5,
        ratingCount: 99,
      },
      {
        id: 4,
        name: "S-Series Comfort Chair",
        image: "/uploads/products/comfort-chair.png",
        discount: "-25%",
        price: 375,
        originalPrice: 400,
        rating: 4,
        ratingCount: 99,
      },
      {
        id: 9,
        name: "The north coat",
        image: "/uploads/products/north-coat.png",
        discount: "",
        price: 260,
        originalPrice: 360,
        rating: 5,
        ratingCount: 65,
      },
      {
        id: 10,
        name: "Gucci duffle bag",
        image: "/uploads/products/gucci-bag.png",
        discount: "",
        price: 960,
        originalPrice: 1160,
        rating: 4.5,
        ratingCount: 65,
      },
      {
        id: 11,
        name: "RGB liquid CPU Cooler",
        image: "/uploads/products/liquid-cooling.png",
        discount: "",
        price: 370,
        originalPrice: 400,
        rating: 5,
        ratingCount: 99,
      },
      {
        id: 12,
        name: "Small BookShelf",
        image: "/uploads/products/bookshelf.png",
        discount: "",
        price: 375,
        originalPrice: 400,
        rating: 4,
        ratingCount: 99,
      },
      {
        id: 13,
        name: "Breed Dry Dog Food",
        image: "/uploads/products/dog-food.png",
        discount: "",
        price: 100,
        originalPrice: null,
        rating: 3,
        ratingCount: 35,
      },
      {
        id: 14,
        name: "CANON EOS DSLR Camera",
        image: "/uploads/products/canon-camera.png",
        discount: "",
        price: 360,
        originalPrice: null,
        rating: 4,
        ratingCount: 95,
      },
      {
        id: 15,
        name: "ASUS FHD Gaming Laptop",
        image: "/uploads/products/gaming-laptop.png",
        discount: "",
        price: 700,
        originalPrice: null,
        rating: 5,
        ratingCount: 325,
      },
      {
        id: 16,
        name: "Curology Product Set",
        image: "/uploads/products/curology.png",
        discount: "",
        price: 500,
        originalPrice: null,
        rating: 4,
        ratingCount: 145,
      },
      {
        id: 17,
        name: "Kids Electric Car",
        image: "/uploads/products/kids-car.png",
        discount: "",
        price: 960,
        originalPrice: null,
        rating: 5,
        ratingCount: 65,
      },
      {
        id: 18,
        name: "Jr. Zoom Soccer Cleats",
        image: "/uploads/products/soccer-cleats.png",
        discount: "",
        price: 1160,
        originalPrice: null,
        rating: 5,
        ratingCount: 35,
      },
      {
        id: 19,
        name: "GP11 Shooter USB Gamepad",
        image: "/uploads/products/usb-gamepad.png",
        discount: "",
        price: 660,
        originalPrice: null,
        rating: 5,
        ratingCount: 55,
      },
      {
        id: 20,
        name: "Quilted Satin Jacket",
        image: "/uploads/products/satin-jacket.png",
        discount: "",
        price: 660,
        originalPrice: null,
        rating: 5,
        ratingCount: 55,
      },
    ];

    const insertQuery = `
      INSERT INTO products (id, name, image, discount, price, "originalPrice", rating, "ratingCount") 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        image = EXCLUDED.image,
        discount = EXCLUDED.discount,
        price = EXCLUDED.price,
        "originalPrice" = EXCLUDED."originalPrice",
        rating = EXCLUDED.rating,
        "ratingCount" = EXCLUDED."ratingCount"
    `;

    let insertedCount = 0;
    let errorCount = 0;

    for (const product of products) {
      try {
        await client.query(insertQuery, [
          product.id,
          product.name,
          product.image,
          product.discount,
          product.price,
          product.originalPrice,
          product.rating,
          product.ratingCount,
        ]);
        console.log(`✓ Inserted/Updated product: ${product.name}`);
        insertedCount++;
      } catch (error) {
        console.error(`✗ Error with product ${product.name}:`, error.message);
        errorCount++;
      }
    }

    console.log('\n=== Database Update Summary ===');
    console.log(`Successfully processed: ${insertedCount} products`);
    console.log(`Errors: ${errorCount} products`);
    console.log("Database update completed successfully!");

  } catch (error) {
    console.error("Database update error:", error);
    process.exit(1);
  } finally {
    await client.end();
    console.log("Database connection closed.");
  }
};

// Only run if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  updateDatabase();
}