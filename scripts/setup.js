// import { migrateImages } from './migrateImages.js';
import { Client } from "pg";

const setupProject = async () => {
  console.log('🚀 Starting project setup...\n');

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
    const productsTableExistsQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'products'
      );
    `;
    
    const productsTableExists = await client.query(productsTableExistsQuery);
    
    if (!productsTableExists.rows[0].exists) {
      console.log("Creating products table...");
      const createProductsTableQuery = `
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
          section VARCHAR(255),
          "isNew" BOOLEAN,
          colors TEXT[]
        );
      `;
      await client.query(createProductsTableQuery);
      console.log("✓ Products table created");
    }


    // Check if users table exists and create if not
    const usersTableExistsQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `;
    
    const usersTableExists = await client.query(usersTableExistsQuery);
    
    if (!usersTableExists.rows[0].exists) {
      console.log("Creating users table...");
      const createUsersTableQuery = `
        CREATE TABLE users (
          id TEXT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          phone VARCHAR(255),
          password TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
      `;
      await client.query(createUsersTableQuery);
      console.log("✓ Users table created");
    }

    // Check if wishlist table exists and create if not
    const wishlistTableExistsQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'wishlist'
      );
    `;
    
    const wishlistTableExists = await client.query(wishlistTableExistsQuery);
    
    if (!wishlistTableExists.rows[0].exists) {
      console.log("Creating wishlist table...");
      const createWishlistTableQuery = `
        CREATE TABLE wishlist (
          id SERIAL PRIMARY KEY,
          "userId" TEXT NOT NULL,
          "productId" TEXT NOT NULL,
          "dateAdded" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE("userId", "productId"),
          FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY ("productId") REFERENCES products(id) ON DELETE CASCADE
        );
      `;
      await client.query(createWishlistTableQuery);
      console.log("✓ Wishlist table created");
    }

    // Clear existing data if requested
    const shouldClearData = process.argv.includes('--clear');
    if (shouldClearData) {
      await client.query('DELETE FROM products');
      console.log("✓ Cleared existing products");
      await client.query('DELETE FROM users');
      console.log("✓ Cleared existing users");
    }

  } catch (error) {
    console.error("❌ Database setup failed:", error);
    return;
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