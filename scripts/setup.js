import { migrateImages } from './migrateImages.js';
import { Client } from "pg";

const setupProject = async () => {
  console.log('🚀 Starting project setup...\n');

  // Step 1: Migrate Images
  // console.log('📁 Step 1: Migrating images...');
  // try {
  //   migrateImages();
  //   console.log('✅ Image migration completed\n');
  // } catch (error) {
  //   console.error('❌ Image migration failed:', error);
  //   return;
  // }

  // Step 2: Update Database
  console.log('🗄️  Step 1: Updating database...');
  
  const client = new Client({
    host: "localhost",
    user: "postgres", 
    port: 5432,
    password: "Kaparaz", 
    database: "e-commerce",
  });

  try {
    await client.connect();
    console.log("✓ Connected to database");

    // Check if products table exists and create if not
    const tableExistsQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'products'
      );
    `;
    
    const tableExists = await client.query(tableExistsQuery);
    
    if (!tableExists.rows[0].exists) {
      console.log("Creating products table...");
      const createTableQuery = `
        CREATE TABLE products (
          id TEXT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          image VARCHAR(500) NOT NULL,
          discount VARCHAR(50),
          price DECIMAL(10,2),
          "originalPrice" DECIMAL(10,2) DEFAULT NULL,
          rating DECIMAL(3,1),
          "ratingCount" INTEGER,
          category VARCHAR(255),
          "isNew" BOOLEAN,
          colors TEXT[]
        );
      `;
      await client.query(createTableQuery);
      console.log("✓ Products table created");
    }

    // Clear existing data if requested
    const shouldClearData = process.argv.includes('--clear');
    if (shouldClearData) {
      await client.query('DELETE FROM products');
      console.log("✓ Cleared existing products");
    }

    // Insert sample data (same as updateDatabase.js)
    const products = [
      // Add all other products here...
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

    for (const product of products) {
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
    }

    console.log(`✅ Database updated with ${products.length} products\n`);

  } catch (error) {
    console.error("❌ Database setup failed:", error);
  } finally {
    await client.end();
  }

  console.log('🎉 Project setup completed successfully!');
  console.log('\nNext steps:');
  console.log('1. Start your server: node server.js');
  console.log('2. Start your Vue development server');
  console.log('3. Test the API endpoints');
};

// Run setup
setupProject();