import { Client } from "pg";
import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import cors from "cors";
import { v4 as uuidv4 } from 'uuid';

const id = uuidv4();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:5173'], 
  credentials: true
}));

app.use(express.json());

//  Create a directory called uploads in the public folder
const appRoot = path.join(__dirname, "..")

//serves the static files, in this case images
app.use("/uploads", express.static(path.join(appRoot, "public/uploads")));

const uploadsDir = path.join(appRoot, "public/uploads/products");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(appRoot, "public/uploads/products/") );
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
app.post("/postProduct", upload.single('image'), (req, res) => {
  let numericPrice = req.body.originalPrice;
  if (numericPrice === ''|| numericPrice === undefined || numericPrice === null){
    numericPrice = null;
  }else {
    numericPrice = Number(req.body.originalPrice);
    if(isNaN(numericPrice)){
      return res.status(400).json({error: "originalPrice must be a valid number"})
    }
  }
  // let color = req.body.colors;
  // if (color === ''){
  //   color = null;
  // }
  try{
 const id = uuidv4();
 const {
    name,
    discount,
    price,
    rating,
    ratingCount,
    category,
    isNew,
    colors
  } = req.body;

  //Check if an image was provided when uploading a new product
  if (!req.file){
     return res.status(400).json({ error: "Image file is required to upload a product" });
  }

  // Create the image URL that will be stored in database
    const imageUrl = `/uploads/products/${req.file.filename}`;

    const insert_query =
    'INSERT INTO products (id,name,image,discount,price,"originalPrice",rating,"ratingCount",category,"isNew",colors) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)';

     server_connect.query(
    insert_query,
    [id, name, imageUrl, discount, price, numericPrice, rating, ratingCount,category,isNew,[colors]],
    (err, result) => {
      if (err) {
        console.log("Database error:", err);
        //If the insert into the Database fails, delete uploaded file from products directory
        fs.unlinkSync(req.file.path);
        res.status(500).json({error: "Database error", details: err.message});
        res.send(err);
      } else {
        console.log("Product inserted successfully:", result);
          res.status(201).json({ 
            message: "Product added successfully", 
            productName: name,
            imageUrl: imageUrl,
            productId: id 
          });
      }
    }
  );
  }catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

app.get("/getProducts", (req, res) => {
  const select_all_query = "SELECT * FROM products ORDER BY id";
  server_connect.query(select_all_query, [], (err, result) => {
    if (err) {
      console.error("Error retrieving products", err);
      res
        .status(500)
        .send({ message: "Failed to retrieve products", error: err.message });
    } else {
      const productsWithFullUrls = result.rows.map(products =>({
        ...products,
        image: `http://localhost:8080${products.image}` //full product url for rendering in the frontend
      }));
      console.log("Products retrieved successfully:", productsWithFullUrls.length);
      res.status(200).json(productsWithFullUrls);
    }
  });
});

// Endpoint to get products by category will have to add a category field to products table and to products e.g FlashSales, BestSelling, ExploreProducts...
app.get("/getProducts/:category", (req, res) => {
  const category = req.params.category;
  let query;
  let params = [];

  switch(category) {
    case 'flash-sales':
      // Assuming you add a category column or use discount to identify flash sales
      query = 'SELECT * FROM products WHERE category = flash-sales ORDER BY id';
      break;
    case 'best-selling':
      // You might want to add a 'category' or 'is_best_selling' column
      // For now, let's use rating as criteria
      query = 'SELECT * FROM products WHERE rating >= 4 ORDER BY rating DESC, "ratingCount" DESC LIMIT 4';
      break;
    case 'explore':
      query = 'SELECT * FROM products ORDER BY id';
      break;
    default:
      return res.status(400).json({ error: "Invalid category" });
  }

  server_connect.query(query, params, (err, result) => {
    if (err) {
      console.error(`Error retrieving ${category} products`, err);
      res.status(500).json({ 
        message: `Failed to retrieve ${category} products`, 
        error: err.message 
      });
    } else {
      const productsWithFullUrls = result.rows.map(product => ({
        ...product,
        image: `http://localhost:8080${product.image}`
      }));
      
      res.status(200).json(productsWithFullUrls);
    }
  });
});

//Error handling Middleware
app.use((err, req, res, next)=>{
  if(err instanceof multer.MulterError){
    if (err.code == 'LIMIT_FILE_SIZE'){
      return res.status(400).json({error: 'File is too large, Max file size is 5MB. '})
    }
  }
  res.status(500).json({error: err.message })
})
const port = 8080
app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
