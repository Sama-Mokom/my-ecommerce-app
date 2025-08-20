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

// JWT utilities and middleware imports
import { generateTokens, verifyRefreshToken } from "./utils/jwt.js";
import { authenticateToken } from "./middleware/auth.js";

// load enviroment variables
dotenv.config();

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
app.use("/uploads", express.static(path.join(appRoot, "public/uploads")));

const uploadsDir = path.join(appRoot, "public/uploads/products");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(appRoot, "public/uploads/products/"));
  },
  filename: (req, file, cb) => {
    //Generates a unique file name to be stored in the uploads folder by joining the original file extension with a random int and the timestamp of when the image was uploaded
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    cb(null, "product-" + uniqueSuffix + fileExtension);
  },
});

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

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit to the files which can be uploaded
  },
});

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

//Endpoint to add a product to the database
app.post("/postProduct", upload.single("image"), (req, res) => {
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

    // Create the image URL that will be stored in database
    const imageUrl = `/uploads/products/${req.file.filename}`;

    const insert_query =
      'INSERT INTO products (id,name,image,discount,price,"originalPrice",rating,"ratingCount",category,section,"isNew",colors) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)';

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
          console.log("Database error:", err);
          //If the insert into the Database fails, delete uploaded file from products directory
          fs.unlinkSync(req.file.path);
          res
            .status(500)
            .json({ error: "Database error", details: err.message });
          res.send(err);
        } else {
          console.log("Product inserted successfully:", result);
          res.status(201).json({
            message: "Product added successfully",
            productName: name,
            imageUrl: imageUrl,
            productId: id,
          });
        }
      }
    );
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});


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

//Endpoint to fetch all products
app.get("/getProducts", (req, res) => {
  const select_all_query = "SELECT * FROM products ORDER BY id";
  server_connect.query(select_all_query, [], (err, result) => {
    if (err) {
      console.error("Error retrieving products", err);
      res
        .status(500)
        .send({ message: "Failed to retrieve products", error: err.message });
    } else {
      const productsWithFullUrls = result.rows.map((products) => ({
        ...products,
        image: `http://localhost:8080${products.image}`, //full product url for rendering in the frontend
      }));
      console.log(
        "Products retrieved successfully:",
        productsWithFullUrls.length
      );
      res.status(200).json(productsWithFullUrls);
    }
  });
});

// Endpoint to get products by section e.g FlashSales, BestSelling, ExploreProducts...
app.get("/getProducts/:section", (req, res) => {
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

  server_connect.query(query, params, (err, result) => {
    if (err) {
      console.error(`Error retrieving ${section} products`, err);
      res.status(500).json({
        message: `Failed to retrieve ${section} products`,
        error: err.message,
      });
    } else {
      const productsWithFullUrls = result.rows.map((product) => ({
        ...product,
        image: `http://localhost:8080${product.image}`,
      }));

      console.log(
        `Successfully retrieved ${productsWithFullUrls.length} ${section} products. `
      );
      res.status(200).json(productsWithFullUrls);
    }
  });
});

// Get single product by ID
// app.get("/product/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const query = "SELECT * FROM products WHERE id = $1";
//     const result = await server_connect.query(query, [id]);
    
//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: "Product not found" });
//     }
    
//     const product = {
//       ...result.rows[0],
//       image: `http://localhost:8080${result.rows[0].image}`
//     };
    
//     res.status(200).json(product);
//   } catch (error) {
//     console.error("Get product error:", error);
//     res.status(500).json({ error: "Server error", details: error.message });
//   }
// });


// Wishlist endpoints
app.post("/wishlist/toggle", authenticateToken, async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.userId;

    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    // Check if product exists
    const productCheckQuery = "SELECT id FROM products WHERE id = $1";
    const productResult = await server_connect.query(productCheckQuery, [productId]);
    
    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Check if item already exists in wishlist
    const checkWishlistQuery = "SELECT id FROM wishlist WHERE \"userId\" = $1 AND \"productId\" = $2";
    const wishlistResult = await server_connect.query(checkWishlistQuery, [userId, productId]);

    if (wishlistResult.rows.length > 0) {
      // Item exists, remove it
      const deleteQuery = "DELETE FROM wishlist WHERE \"userId\" = $1 AND \"productId\" = $2";
      await server_connect.query(deleteQuery, [userId, productId]);
      
      res.status(200).json({ 
        message: "Item removed from wishlist",
        action: "removed"
      });
    } else {
      // Item doesn't exist, add it
      const insertQuery = "INSERT INTO wishlist (\"userId\", \"productId\") VALUES ($1, $2)";
      await server_connect.query(insertQuery, [userId, productId]);
      
      res.status(201).json({ 
        message: "Item added to wishlist",
        action: "added"
      });
    }
  } catch (error) {
    console.error("Wishlist toggle error:", error);
    res.status(500).json({ 
      error: "Server error", 
      details: error.message 
    });
  }
});

app.get("/wishlist", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get wishlist items with product details
    const wishlistQuery = `
      SELECT w.id, w."dateAdded", p.*
      FROM wishlist w
      JOIN products p ON w."productId" = p.id
      WHERE w."userId" = $1
      ORDER BY w."dateAdded" DESC
    `;
    
    const wishlistResult = await server_connect.query(wishlistQuery, [userId]);
    
    // Format the response to include full image URLs
    const wishlistItems = wishlistResult.rows.map(item => ({
      ...item,
      image: `http://localhost:8080${item.image}`
    }));

    res.status(200).json({ 
      wishlist: wishlistItems,
      count: wishlistItems.length
    });
  } catch (error) {
    console.error("Get wishlist error:", error);
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

    const deleteQuery = "DELETE FROM wishlist WHERE \"userId\" = $1 AND \"productId\" = $2";
    const result = await server_connect.query(deleteQuery, [userId, productId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Wishlist item not found" });
    }

    res.status(200).json({ message: "Item removed from wishlist" });
  } catch (error) {
    console.error("Remove wishlist item error:", error);
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
      return res.status(400).json({ error: "Product ID is required" });
    }

    // Check if product exists and get its price
    const productCheckQuery = "SELECT id, price FROM products WHERE id = $1";
    const productResult = await server_connect.query(productCheckQuery, [productId]);
    
    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const product = productResult.rows[0];
    const subTotal = product.price * quantity;

    // Check if item already exists in cart
    const checkCartQuery = "SELECT id FROM cart WHERE \"userId\" = $1 AND \"productId\" = $2";
    const cartResult = await server_connect.query(checkCartQuery, [userId, productId]);

    if (cartResult.rows.length > 0) {
      return res.status(409).json({ 
        error: "Product is already in your cart",
        message: "This product is already in your cart"
      });
    }

    // Add item to cart
    const insertQuery = `
      INSERT INTO cart ("userId", "productId", quantity, price, "subTotal") 
      VALUES ($1, $2, $3, $4, $5)
    `;
    await server_connect.query(insertQuery, [userId, productId, quantity, product.price, subTotal]);
    
    res.status(201).json({ 
      message: "Item added to cart successfully",
      cartItem: {
        productId,
        quantity,
        price: product.price,
        subTotal
      }
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ 
      error: "Server error", 
      details: error.message 
    });
  }
});

app.get("/cart", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get cart items with product details
    const cartQuery = `
      SELECT c.id, c."productId", c.quantity, c.price, c."subTotal", c."dateAdded", p.*
      FROM cart c
      JOIN products p ON c."productId" = p.id
      WHERE c."userId" = $1
      ORDER BY c."dateAdded" DESC
    `;
    
    const cartResult = await server_connect.query(cartQuery, [userId]);
    
    // Format the response to include full image URLs
    const cartItems = cartResult.rows.map(item => ({
      ...item,
      image: `http://localhost:8080${item.image}`
    }));

    // Calculate totals
    const subTotal = cartItems.reduce((sum, item) => sum + parseFloat(item.subTotal), 0);
    const shipping = 0; // Free shipping
    const total = subTotal + shipping;

    res.status(200).json({ 
      cart: cartItems,
      summary: {
        subTotal: subTotal.toFixed(2),
        shipping: "Free",
        total: total.toFixed(2)
      },
      count: cartItems.length
    });
  } catch (error) {
    console.error("Get cart error:", error);
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
      return res.status(400).json({ error: "Product ID and quantity are required" });
    }

    if (quantity <= 0) {
      return res.status(400).json({ error: "Quantity must be greater than 0" });
    }

    // Get product price to recalculate subtotal
    const productQuery = "SELECT price FROM products WHERE id = $1";
    const productResult = await server_connect.query(productQuery, [productId]);
    
    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const product = productResult.rows[0];
    const subTotal = product.price * quantity;

    // Update cart item
    const updateQuery = `
      UPDATE cart 
      SET quantity = $1, "subTotal" = $2 
      WHERE "userId" = $3 AND "productId" = $4
    `;
    const result = await server_connect.query(updateQuery, [quantity, subTotal, userId, productId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    res.status(200).json({ 
      message: "Cart updated successfully",
      updatedItem: {
        productId,
        quantity,
        subTotal
      }
    });
  } catch (error) {
    console.error("Update cart error:", error);
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

    const deleteQuery = "DELETE FROM cart WHERE \"userId\" = $1 AND \"productId\" = $2";
    const result = await server_connect.query(deleteQuery, [userId, productId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Remove cart item error:", error);
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
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code == "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ error: "File is too large, Max file size is 5MB. " });
    }
  }
  res.status(500).json({ error: err.message });
});
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
