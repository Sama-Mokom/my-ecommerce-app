import { Client } from "pg";
import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { debug } from "console";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { createClient } from '@supabase/supabase-js';

// JWT utilities and middleware imports
import { generateTokens, verifyRefreshToken } from "./utils/jwt.js";
import { authenticateToken } from "./middleware/auth.js";

// load enviroment variables
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "https://x-clusive.onrender.com",
      "https://x-clussive-shop.onrender.com",
    ],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use(cookieParser()); 
app.use(express.json());

//  Create a directory called uploads in the public folder
const appRoot = path.join(__dirname, "..");

//serves the static files, in this case images
// app.use("/uploads", express.static(path.join(appRoot, "public/uploads")));

// const uploadsDir = path.join(appRoot, "public/uploads/products");
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir, { recursive: true });
// }

//File filter which allows only image files to be uploaded
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
//   limits: {
//     fileSize: 10 * 1024 * 1024, // 10MB limit to the files which can be uploaded
//   },
// });

const server_connect = new Client({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "postgres",
  port: process.env.DB_PORT || 5432,
  password: process.env.DB_PASSWORD || "Kaparaz",
  database: process.env.DB_NAME || "e-commerce",
  ssl: process.env.DB_SSL_MODE == 'require' ? {rejectUnauthorized: false} : false
});

server_connect
  .connect()
  .then(() => console.log("Server connection established"));




//USER ENDPOINTS

//Endpoint to add a user to the database
app.post("/postUser", async (req, res) => {
  try {
    console.log("=== POST /postUser Debug Info ===");
    console.log("Request body: ", req.body);

    // Check if req.body exists at all
    if (!req.body) {
      console.log("ERROR: req.body is null or undefined");
      return res.status(400).json({
        error: "Request body is missing",
        debug: {
          body: req.body,
          contentType: req.headers["content-type"],
        },
      });
    }

    // Check if req.body is an empty object
    if (typeof req.body === "object" && Object.keys(req.body).length === 0) {
      console.log("ERROR: req.body is an empty object");
      return res.status(400).json({
        error: "Request body is empty",
        debug: {
          body: req.body,
          keys: Object.keys(req.body),
          contentType: req.headers["content-type"],
        },
      });
    }

    const name = req.body.name || null;
    const email = req.body.email || null;
    const password = req.body.password || null;

    console.log("Values extracted from body: ", {
      name,
      email,
      password: password ? "***hidden***" : null,
    });

    if (!name || !email || !password) {
      return res.status(400).json(
        {
          error: "Missing required fields",
          required: ["name", "email", "password"],
          recieved: { name: !!name, email: !!email, password: !!password },
        },
        debug,
        {
          bodyKeys: Object.keys(req.body),
          actualValues: {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password ? "***provided***" : "missing",
          },
        }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Invalid email format",
      });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({
        error: "Password must be at least 8 characters long",
      });
    }

    // Check if user already exists
    const checkUserQuery = "SELECT id FROM users WHERE email = $1";
    const existingUser = await server_connect.query(checkUserQuery, [email]);

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        error: "User with this email already exists",
      });
    }

    //Hash Passwords before saving in database
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const userId = uuidv4();

    const insert_query =
      "INSERT INTO users (id,name,email, password) VALUES ($1,$2,$3,$4)";

    const result = await server_connect.query(
      insert_query,
      [userId, name, email, hashedPassword]
    );
    console.log("User created successfully: ", result);

    // Generate JWT Tokens
    const tokenPayload = { userId, email, name };
    const { accessToken, refreshToken } = generateTokens(tokenPayload);

    // Refresh tokens are set as HTTP-only cookies for better security
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    console.log("User created and authenticated successfully");

    res.status(201).json({
      success: true,
      message: "User created successfully",
      accessToken: accessToken,
      user: {
        id: userId,
        name: name,
        email: email,
      },
    });
  } catch (error) {
    console.error("User registration error:", error);
    if (error.code === "23505"){
      return res.status(409).json({error: "User with this email already exists"});
    }
    return res.status(500).json({
      error: "Server error",
      details: error.message
    })
  }
});



// Login endpoint
app.post("/loginUser", async (req, res) => {
  try {
    console.log("=== POST /loginUser ===");
    console.log("Login request body:", req.body);

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        error: "Request body is empty or invalid",
      });
    }

    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["email", "password"],
      });
    }

    // Find user by email
    const findUserQuery = "SELECT * FROM users WHERE email = $1";
    const userResult = await server_connect.query(findUserQuery, [email]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const user = userResult.rows[0];

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    // Generating JWT tokens
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      name: user.name,
    };
    const { accessToken, refreshToken } = generateTokens(tokenPayload);

    // Set the refresh token to be HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // token is set to expire in 7 days
    });
    console.log("User login successful");

    res.status(200).json({
      message: "Login successful",
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: "Server error",
      details: error.message,
    });
  }
});

// Endpoint to refresh token
app.post("/refresh-token", async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(401).json({
        error: "Refresh token not provided",
      });
    }
    const decoded = verifyRefreshToken(refreshToken);

    const findUserQuery = "SELECT * FROM users WHERE ID = $1";
    const userResult = await server_connect.query(findUserQuery, [
      decoded.userId,
    ]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        error: "User not found",
      });
    }
    const user = userResult.rows[0];

    // New tokens are generated uppon refresh
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      name: user.name,
    };

    const { accessToken, refreshToken: newRefreshToken } =
      generateTokens(tokenPayload);

    // new refresh tokens are saved to cookies
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Token refreshed successfully",
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Token refresh error: ", error);
    res.status(401).json({
      error: "Invalid refresh token",
      details: error.message,
    });
  }
});

//Endpoint to Logout user
app.post("/logout", authenticateToken, (req, res) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    console.log("Logout error: ", error);
    res.status(500).json({
      error: "Server error during logout",
    });
  }
});

// Get current user (protected route).Will use this when implementing user profile
app.get("/me", authenticateToken, async (req, res) => {
  try {
    const findUserQuery = 'SELECT id, name, email, created_at FROM users WHERE id = $1';
    const userResult = await server_connect.query(findUserQuery, [req.user.userId]);
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ 
        error: "User not found" 
      });
    }

    res.status(200).json({ 
      user: userResult.rows[0] 
    });

  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ 
      error: "Server error", 
      details: error.message 
    });
  }
});


//PRODUCT ENDPOINTS

//Endpoint to add a product to the database
app.post("/postProduct", upload.single("image"), async (req, res) => {
  let numericPrice = req.body.originalPrice;
  if (
    numericPrice === "" ||
    numericPrice === undefined ||
    numericPrice === null
  ) {
    numericPrice = null;
  } else {
    numericPrice = Number(req.body.originalPrice);
    if (isNaN(numericPrice)) {
      return res
        .status(400)
        .json({ error: "originalPrice must be a valid number" });
    }
  }

  try {
    const id = uuidv4();
    const {
      name,
      discount,
      price,
      rating,
      ratingCount,
      category,
      section,
      isNew,
      colors,
    } = req.body;

    //Check if an image was provided when uploading a new product
    if (!req.file) {
      return res
        .status(400)
        .json({ error: "Image file is required to upload a product" });
    }

    // This is to upload the image file to supabase using the supabase client we created above
    const fileBuffer = req.file.buffer;
    const fileName = `product-${uuidv4()}-${Date.now()}${path.extname(req.file.originalname)}`;
    const filePath = `products/${fileName}`; //This is the path to the specific image file inside my supabase storage bucket

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('X-Clussive Product images')//Name of my storage bucket on supabase
      .upload(filePath, fileBuffer, {
        contentType: req.file.mimetype,
        upsert: false
      });

    if (uploadError) {
      console.error("Supabase upload error: ", uploadError);
      return res.status(500).json({
        error: "Failed to upload image to Supabase",
        details: uploadError.message
      });
    }

    const { data: publicUrlData } = supabase.storage
      .from('X-Clussive Product images') 
      .getPublicUrl(filePath);

    // Create the image URL that will be stored in database
    const imageUrl = publicUrlData.publicUrl;

    const insert_query =
      'INSERT INTO products (id,name,image,discount,price,"originalPrice",rating,"ratingCount",category,section,"isNew",colors) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)';

    // Database query now uses promises to ensure consistency
    const result = await new Promise((resolve, reject) => {
      server_connect.query(
        insert_query,
        [
          id,
          name,
          imageUrl,
          discount,
          price,
          numericPrice,
          rating,
          ratingCount,
          category,
          section,
          isNew,
          [colors],
        ],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });

    console.log("Product inserted successfully:", result);
    res.status(201).json({
      message: "Product added successfully",
      productName: name,
      imageUrl: imageUrl,
      productId: id,
    });

  } catch (error) {
    console.error("Server error:", error);
    
    // Handle database-specific errors to help debug incase of errors
    if (error.code) {
      console.log("Database error:", error);
      return res.status(500).json({ 
        error: "Database error", 
        details: error.message 
      });
    }

    // Handle general server-side errors for easier debugging
    res.status(500).json({ 
      error: "Server error", 
      details: error.message 
    });
  }
});

//Endpoint to fetch all products
app.get("/getProducts", async (req, res) => {
  try {
    const select_all_query = "SELECT * FROM products ORDER BY id";
    
    // Convert database query to Promise-based approach (matching POST endpoint)
    const result = await new Promise((resolve, reject) => {
      server_connect.query(select_all_query, [], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    console.log("Products retrieved successfully:", result.rows.length);
    
    res.status(200).json({
      message: "Products retrieved successfully",
      count: result.rows.length,
      products: result.rows
    });

  } catch (error) {
    console.error("Server error:", error);
    
    // Handle database-specific errors (matching POST endpoint error handling)
    if (error.code) {
      console.log("Database error:", error);
      return res.status(500).json({ 
        error: "Database error", 
        details: error.message 
      });
    }

    // Handle general server errors
    res.status(500).json({ 
      error: "Server error", 
      details: error.message 
    });
  }
});

// Endpoint to get products by section e.g FlashSales, BestSelling, ExploreProducts...
app.get("/getProducts/:section", async (req, res) => {
  try {
    const section = req.params.section;
    let query;
    let params = [section];

    switch (section) {
      case "flash-sales":
        // Will add a category column or use discount to identify flash sales will be implemented later on
        query = "SELECT * FROM products WHERE section = $1 ORDER BY id";
        break;
      case "best-selling":
        // Will add a 'category' or 'is_best_selling' column
        // Will use rating as criteria later on 
        query = "SELECT * FROM products WHERE section = $1 ORDER BY id";
        break;
      case "explore":
        query = "SELECT * FROM products WHERE section = $1 ORDER BY id";
        break;
      default:
        return res.status(400).json({ error: "Invalid section specified" });
    }

    // Convert database query to Promise-based approach (matching POST endpoint)
    const result = await new Promise((resolve, reject) => {
      server_connect.query(query, params, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    console.log(`Successfully retrieved ${result.rows.length} ${section} products.`);
    
    res.status(200).json({
      message: `${section} products retrieved successfully`,
      section: section,
      count: result.rows.length,
      products: result.rows
    });

  } catch (error) {
    console.error("Server error:", error);
    
    // Handle database-specific errors (matching POST endpoint error handling)
    if (error.code) {
      console.log("Database error:", error);
      return res.status(500).json({ 
        error: "Database error", 
        details: error.message 
      });
    }

    // Handle general server errors
    res.status(500).json({ 
      error: "Server error", 
      details: error.message 
    });
  }
});

// Get single product by ID
app.get("/product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const query = "SELECT * FROM products WHERE id = $1";
    
    // Convert database query to Promise-based approach 
    const result = await new Promise((resolve, reject) => {
      server_connect.query(query, [id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: "Product not found",
        details: `No product found with ID: ${id}`
      });
    }
    
    const product = result.rows[0];
    
    // Since image URLs are already stored as full Supabase URLs from the POST endpoint,
    // we don't need to modify them - just return the product as is
    console.log(`Product retrieved successfully: ${product.name} (ID: ${id})`);
    
    res.status(200).json({
      message: "Product retrieved successfully",
      productId: id,
      product: product
    });

  } catch (error) {
    console.error("Server error:", error);
    
    // Handle database-specific errors (matching other endpoints error handling)
    if (error.code) {
      console.log("Database error:", error);
      return res.status(500).json({ 
        error: "Database error", 
        details: error.message 
      });
    }

    // Handle general server errors
    res.status(500).json({ 
      error: "Server error", 
      details: error.message 
    });
  }
});

// Wishlist endpoints

app.post("/wishlist/toggle", authenticateToken, async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.userId;

    if (!productId) {
      return res.status(400).json({ 
        error: "Validation error",
        details: "Product ID is required" 
      });
    }

    // Check if product exists - converted to Promise-based approach
    const productCheckQuery = "SELECT id FROM products WHERE id = $1";
    const productResult = await new Promise((resolve, reject) => {
      server_connect.query(productCheckQuery, [productId], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
    
    if (productResult.rows.length === 0) {
      return res.status(404).json({ 
        error: "Product not found",
        details: `No product found with ID: ${productId}`
      });
    }

    // Check if item already exists in wishlist - converted to Promise-based approach
    const checkWishlistQuery = "SELECT id FROM wishlist WHERE \"userId\" = $1 AND \"productId\" = $2";
    const wishlistResult = await new Promise((resolve, reject) => {
      server_connect.query(checkWishlistQuery, [userId, productId], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    if (wishlistResult.rows.length > 0) {
      // Item exists, remove it - converted to Promise-based approach
      const deleteQuery = "DELETE FROM wishlist WHERE \"userId\" = $1 AND \"productId\" = $2";
      await new Promise((resolve, reject) => {
        server_connect.query(deleteQuery, [userId, productId], (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
      
      console.log(`Item removed from wishlist - User: ${userId}, Product: ${productId}`);
      
      res.status(200).json({ 
        message: "Item removed from wishlist",
        action: "removed",
        userId: userId,
        productId: productId
      });
    } else {
      // Item doesn't exist, add it - converted to Promise-based approach
      const insertQuery = "INSERT INTO wishlist (\"userId\", \"productId\") VALUES ($1, $2)";
      await new Promise((resolve, reject) => {
        server_connect.query(insertQuery, [userId, productId], (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
      
      console.log(`Item added to wishlist - User: ${userId}, Product: ${productId}`);
      
      res.status(201).json({ 
        message: "Item added to wishlist",
        action: "added",
        userId: userId,
        productId: productId
      });
    }
  } catch (error) {
    console.error("Server error:", error);
    
    // Handle database-specific errors (matching other endpoints error handling)
    if (error.code) {
      console.log("Database error:", error);
      return res.status(500).json({ 
        error: "Database error", 
        details: error.message 
      });
    }

    // Handle general server errors
    res.status(500).json({ 
      error: "Server error", 
      details: error.message 
    });
  }
});

app.get("/wishlist", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get wishlist items with product details - converted to Promise-based approach
    const wishlistQuery = `
      SELECT w.id, w."dateAdded", p.*
      FROM wishlist w
      JOIN products p ON w."productId" = p.id
      WHERE w."userId" = $1
      ORDER BY w."dateAdded" DESC
    `;
    
    const wishlistResult = await new Promise((resolve, reject) => {
      server_connect.query(wishlistQuery, [userId], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
    
    const wishlistItems = wishlistResult.rows;

    console.log(`Wishlist retrieved successfully for user ${userId}: ${wishlistItems.length} items`);

    res.status(200).json({ 
      message: "Wishlist retrieved successfully",
      userId: userId,
      count: wishlistItems.length,
      wishlist: wishlistItems
    });
  } catch (error) {
    console.error("Server error:", error);
    
    // Handle database-specific errors (matching other endpoints error handling)
    if (error.code) {
      console.log("Database error:", error);
      return res.status(500).json({ 
        error: "Database error", 
        details: error.message 
      });
    }

    // Handle general server errors
    res.status(500).json({ 
      error: "Server error", 
      details: error.message 
    });
  }
});

app.delete("/wishlist/:productId", authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.userId;

    // Delete from wishlist - converted to Promise-based approach
    const deleteQuery = "DELETE FROM wishlist WHERE \"userId\" = $1 AND \"productId\" = $2";
    const result = await new Promise((resolve, reject) => {
      server_connect.query(deleteQuery, [userId, productId], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    if (result.rowCount === 0) {
      return res.status(404).json({ 
        error: "Wishlist item not found",
        details: `No wishlist item found for user ${userId} and product ${productId}`
      });
    }

    console.log(`Wishlist item deleted successfully - User: ${userId}, Product: ${productId}`);

    res.status(200).json({ 
      message: "Item removed from wishlist",
      userId: userId,
      productId: productId,
      deletedCount: result.rowCount
    });
  } catch (error) {
    console.error("Server error:", error);
    
    // Handle database-specific errors (matching other endpoints error handling)
    if (error.code) {
      console.log("Database error:", error);
      return res.status(500).json({ 
        error: "Database error", 
        details: error.message 
      });
    }

    // Handle general server errors
    res.status(500).json({ 
      error: "Server error", 
      details: error.message 
    });
  }
});

// Cart endpoints
app.post("/cart/add", authenticateToken, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user.userId;

    if (!productId) {
      return res.status(400).json({ 
        error: "Validation error",
        details: "Product ID is required" 
      });
    }

    // Check if product exists and get its price - converted to Promise-based approach
    const productCheckQuery = "SELECT id, price FROM products WHERE id = $1";
    const productResult = await new Promise((resolve, reject) => {
      server_connect.query(productCheckQuery, [productId], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
    
    if (productResult.rows.length === 0) {
      return res.status(404).json({ 
        error: "Product not found",
        details: `No product found with ID: ${productId}`
      });
    }

    const product = productResult.rows[0];
    const subTotal = product.price * quantity;

    // Check if item already exists in cart - converted to Promise-based approach
    const checkCartQuery = "SELECT id FROM cart WHERE \"userId\" = $1 AND \"productId\" = $2";
    const cartResult = await new Promise((resolve, reject) => {
      server_connect.query(checkCartQuery, [userId, productId], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    if (cartResult.rows.length > 0) {
      return res.status(409).json({ 
        error: "Product already in cart",
        details: "This product is already in your cart"
      });
    }

    // Add item to cart - converted to Promise-based approach
    const insertQuery = `
      INSERT INTO cart ("userId", "productId", quantity, price, "subTotal") 
      VALUES ($1, $2, $3, $4, $5)
    `;
    await new Promise((resolve, reject) => {
      server_connect.query(insertQuery, [userId, productId, quantity, product.price, subTotal], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
    
    console.log(`Item added to cart successfully - User: ${userId}, Product: ${productId}, Quantity: ${quantity}`);
    
    res.status(201).json({ 
      message: "Item added to cart successfully",
      userId: userId,
      productId: productId,
      cartItem: {
        productId,
        quantity,
        price: product.price,
        subTotal
      }
    });
  } catch (error) {
    console.error("Server error:", error);
    
    // Handle database-specific errors (matching other endpoints error handling)
    if (error.code) {
      console.log("Database error:", error);
      return res.status(500).json({ 
        error: "Database error", 
        details: error.message 
      });
    }

    // Handle general server errors
    res.status(500).json({ 
      error: "Server error", 
      details: error.message 
    });
  }
});


app.get("/cart", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get cart items with product details - converted to Promise-based approach
    const cartQuery = `
      SELECT c.id, c."productId", c.quantity, c.price, c."subTotal", c."dateAdded", p.*
      FROM cart c
      JOIN products p ON c."productId" = p.id
      WHERE c."userId" = $1
      ORDER BY c."dateAdded" DESC
    `;
    
    const cartResult = await new Promise((resolve, reject) => {
      server_connect.query(cartQuery, [userId], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
    
    const cartItems = cartResult.rows;

    // Calculate totals
    const subTotal = cartItems.reduce((sum, item) => sum + parseFloat(item.subTotal), 0);
    const shipping = 0; // Free shipping
    const total = subTotal + shipping;

    console.log(`Cart retrieved successfully for user ${userId}: ${cartItems.length} items, total: $${total.toFixed(2)}`);

    res.status(200).json({ 
      message: "Cart retrieved successfully",
      userId: userId,
      count: cartItems.length,
      cart: cartItems,
      summary: {
        subTotal: subTotal.toFixed(2),
        shipping: "Free",
        total: total.toFixed(2)
      }
    });
  } catch (error) {
    console.error("Server error:", error);
    
    // Handle database-specific errors (matching other endpoints error handling)
    if (error.code) {
      console.log("Database error:", error);
      return res.status(500).json({ 
        error: "Database error", 
        details: error.message 
      });
    }

    // Handle general server errors
    res.status(500).json({ 
      error: "Server error", 
      details: error.message 
    });
  }
});


app.put("/cart/update", authenticateToken, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.userId;

    if (!productId || !quantity) {
      return res.status(400).json({ 
        error: "Validation error",
        details: "Product ID and quantity are required" 
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({ 
        error: "Validation error",
        details: "Quantity must be greater than 0" 
      });
    }

    // Get product price to recalculate subtotal - converted to Promise-based approach
    const productQuery = "SELECT price FROM products WHERE id = $1";
    const productResult = await new Promise((resolve, reject) => {
      server_connect.query(productQuery, [productId], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
    
    if (productResult.rows.length === 0) {
      return res.status(404).json({ 
        error: "Product not found",
        details: `No product found with ID: ${productId}`
      });
    }

    const product = productResult.rows[0];
    const subTotal = product.price * quantity;

    // Update cart item - converted to Promise-based approach
    const updateQuery = `
      UPDATE cart 
      SET quantity = $1, "subTotal" = $2 
      WHERE "userId" = $3 AND "productId" = $4
    `;
    const result = await new Promise((resolve, reject) => {
      server_connect.query(updateQuery, [quantity, subTotal, userId, productId], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    if (result.rowCount === 0) {
      return res.status(404).json({ 
        error: "Cart item not found",
        details: `No cart item found for user ${userId} and product ${productId}`
      });
    }

    console.log(`Cart updated successfully - User: ${userId}, Product: ${productId}, New quantity: ${quantity}`);

    res.status(200).json({ 
      message: "Cart updated successfully",
      userId: userId,
      productId: productId,
      updatedCount: result.rowCount,
      updatedItem: {
        productId,
        quantity,
        subTotal: subTotal.toFixed(2)
      }
    });
  } catch (error) {
    console.error("Server error:", error);
    
    // Handle database-specific errors (matching other endpoints error handling)
    if (error.code) {
      console.log("Database error:", error);
      return res.status(500).json({ 
        error: "Database error", 
        details: error.message 
      });
    }

    // Handle general server errors
    res.status(500).json({ 
      error: "Server error", 
      details: error.message 
    });
  }
});

app.delete("/cart/:productId", authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.userId;

    // Delete from cart - converted to Promise-based approach
    const deleteQuery = "DELETE FROM cart WHERE \"userId\" = $1 AND \"productId\" = $2";
    const result = await new Promise((resolve, reject) => {
      server_connect.query(deleteQuery, [userId, productId], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    if (result.rowCount === 0) {
      return res.status(404).json({ 
        error: "Cart item not found",
        details: `No cart item found for user ${userId} and product ${productId}`
      });
    }

    console.log(`Cart item deleted successfully - User: ${userId}, Product: ${productId}`);

    res.status(200).json({ 
      message: "Item removed from cart",
      userId: userId,
      productId: productId,
      deletedCount: result.rowCount
    });
  } catch (error) {
    console.error("Server error:", error);
    
    // Handle database-specific errors (matching other endpoints error handling)
    if (error.code) {
      console.log("Database error:", error);
      return res.status(500).json({ 
        error: "Database error", 
        details: error.message 
      });
    }

    // Handle general server errors
    res.status(500).json({ 
      error: "Server error", 
      details: error.message 
    });
  }
});

//Test endpoint. Use this for debugging
app.post("/test", (req, res) => {
  console.log("Test endpoint hit");
  console.log("Body:", req.body);
  res.json({ 
    message: "Test successful", 
    body: req.body,
    contentType: req.headers['content-type']
  });
});


//Error handling Middleware
// app.use((err, req, res, next) => {
//   if (err instanceof multer.MulterError) {
//     if (err.code == "LIMIT_FILE_SIZE") {
//       return res
//         .status(400)
//         .json({ error: "File is too large, Max file size is 5MB. " });
//     }
//   }
//   res.status(500).json({ error: err.message });
// });
const port = process.env.PORT ;
app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
