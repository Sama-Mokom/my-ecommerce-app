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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://127.0.0.1:5173",
    ],
    credentials: true,
  })
);

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
    fileSize: 5 * 1024 * 1024, // 5MB limit to the files which can be uploaded
  },
});

const server_connect = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "Kaparaz",
  database: "e-commerce",
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

//Endpoint to add a user to the database
app.post("/postUser", async (req, res) => {
  try {
    console.log("=== POST /postUser Debug Info ===");
    console.log("Request method:", req.method);
    console.log("Content-Type:", req.headers["content-type"]);
    console.log("Request body: ", req.body);
    console.log("Request body type:", typeof req.body);
    console.log(
      "Request body keys:",
      req.body ? Object.keys(req.body) : "No keys"
    );
    console.log("Raw request body:", JSON.stringify(req.body));
    console.log("=====================================");

 // Check if req.body exists at all
    if (!req.body) {
      console.log("ERROR: req.body is null or undefined");
      return res.status(400).json({ 
        error: "Request body is missing",
        debug: {
          body: req.body,
          contentType: req.headers['content-type']
        }
      });
    }


// Check if req.body is an empty object
    if (typeof req.body === 'object' && Object.keys(req.body).length === 0) {
      console.log("ERROR: req.body is an empty object");
      return res.status(400).json({ 
        error: "Request body is empty",
        debug: {
          body: req.body,
          keys: Object.keys(req.body),
          contentType: req.headers['content-type']
        }
      });
    }


    // if (!req.body || Object.keys(req.body).length === 0) {
    //   return res.status(400).json({
    //     error: "Requset body is empty or invalid",
    //   });
    // }
    // const { name, email, password } = req.body;
    const name = req.body.name || null;
    const email = req.body.email|| null;
    const password = req.body.password || null;

    console.log("Values extracted from body: ", {name, email, password: password ? "***hidden***" : null});


    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Missing fields",
        required: ["name", "email", "password"],
        recieved: { name: !!name, email: !!email, password: !!password },
      },
    debug, {
        bodyKeys: Object.keys(req.body),
        actualValues: {
          name: req.body.name,
          email: req.body.email,
          password: req.body.password ? "***provided***": "missing"
        }
    });
    }
     //validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Invalid email format",
      });
    }
     //Validate password length
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
    const id = uuidv4();

    const insert_query =
      "INSERT INTO users (id,name,email, password) VALUES ($1,$2,$3,$4)";

    server_connect.query(
      insert_query,
      [id, name, email, hashedPassword],
      (err, result) => {
        if (err) {
          console.log("Database error:", err);
          if (err.code === "23505") {
            return res.status(409).json({
              error: "User with this email already exists",
            });
          }
          return res.status(500).json({
            error: "Database error",
            details: err.message,
          });
        } else {
          console.log("User created successfully:", result);
          res.status(201).json({
            message: "User created successfully",
            UserName: name,
            userID: id,
          });
        }
      }
    );
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// Add a simple test endpoint
app.post("/test", (req, res) => {
  console.log("Test endpoint hit");
  console.log("Body:", req.body);
  res.json({ 
    message: "Test successful", 
    body: req.body,
    contentType: req.headers['content-type']
  });
});


//Login endpoint
// app.post("/loginUser", async (req, res) => {
//   try {
//     console.log("Login request body:", req.body);
    
//     if (!req.body || Object.keys(req.body).length === 0) {
//       return res.status(400).json({ 
//         error: "Request body is empty or invalid" 
//       });
//     }

//     const { email, password } = req.body;

//     // Validate required fields
//     if (!email || !password) {
//       return res.status(400).json({ 
//         error: "Missing required fields", 
//         required: ["email", "password"]
//       });
//     }

//     // Find user by email
//     const findUserQuery = 'SELECT * FROM users WHERE email = $1';
//     const userResult = await server_connect.query(findUserQuery, [email]);
    
//     if (userResult.rows.length === 0) {
//       return res.status(401).json({ 
//         error: "Invalid email or password" 
//       });
//     }

//     const user = userResult.rows[0];

//     // Compare passwords
//     const isPasswordValid = await bcrypt.compare(password, user.password);
    
//     if (!isPasswordValid) {
//       return res.status(401).json({ 
//         error: "Invalid email or password" 
//       });
//     }

//     // Don't send password back to client
//     const { password: _, ...userWithoutPassword } = user;

//     res.status(200).json({ 
//       message: "Login successful", 
//       user: userWithoutPassword
//     });

//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ 
//       error: "Server error", 
//       details: error.message 
//     });
//   }
// });



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
      // Assuming you add a category column or use discount to identify flash sales
      query = "SELECT * FROM products WHERE section = $1 ORDER BY id";
      break;
    case "best-selling":
      // You might want to add a 'category' or 'is_best_selling' column
      // For now, let's use rating as criteria
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
const port = 8080;
app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
