import { Request, Response } from "express";
import { Product } from "../modals/productModal";
import multer from "multer";
import path from "path";



declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
      };
    }
  }
}


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/Images"); 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

export const upload = multer({ storage : storage});


export const createProduct = async (req: Request, res: Response) => {
  try {
    console.log("req.file:", req.file);
    console.log("req.body:", req.body);

    console.log("Inside createProduct");
    const { name, type, stock, mrp, price, brand, exchange } = req.body;

    const image = req.file?.filename || "";
    
    const product = await Product.create({
      userId: req.user!.id,
      name,
      type,
      stock,
      mrp,
      price,
      brand,
      exchange,
      image,
    });
    console.log("CREATED PRODUCT:", product);

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({
      userId: req.user!.id,
    });

    // Map products to include 'published' field for frontend compatibility
    const productsWithPublished = products.map(product => {
      const productObj = product.toObject();
      productObj.published = product.isPublished;
      return productObj;
    });

    res.json({
      count: productsWithPublished.length,
      products: productsWithPublished,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getPublishedProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({
      isPublished: true,
    });

    // Map products to include 'published' field for frontend compatibility
    const productsWithPublished = products.map(product => {
      const productObj = product.toObject();
      productObj.published = product.isPublished;
      return productObj;
    });

    res.json({
      count: productsWithPublished.length,
      products: productsWithPublished,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({});

    // Map products to include 'published' field for frontend compatibility
    const productsWithPublished = products.map(product => {
      const productObj = product.toObject();
      productObj.published = product.isPublished;
      return productObj;
    });

    res.json({
      count: productsWithPublished.length,
      products: productsWithPublished,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      userId: req.user!.id,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    console.log("Full req.body:", JSON.stringify(req.body));
    console.log("req.file:", req.file);

    // Create update object from req.body
    const updateObj: any = {};

    // Copy all fields from req.body
    if (req.body.name) updateObj.name = req.body.name;
    if (req.body.type) updateObj.type = req.body.type;
    if (req.body.stock !== undefined && req.body.stock !== null && req.body.stock !== '') {
      updateObj.stock = parseInt(req.body.stock);
    }
    if (req.body.mrp !== undefined && req.body.mrp !== null && req.body.mrp !== '') {
      updateObj.mrp = parseFloat(req.body.mrp);
    }
    if (req.body.price !== undefined && req.body.price !== null && req.body.price !== '') {
      updateObj.price = parseFloat(req.body.price);
    }
    if (req.body.brand) updateObj.brand = req.body.brand;
    if (req.body.exchange) updateObj.exchange = req.body.exchange;

    // Handle file upload
    if (req.file?.filename) {
      updateObj.image = req.file.filename;
    }

    console.log("Final update object:", updateObj);

    if (Object.keys(updateObj).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      updateObj,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Verify user owns the product
    if (product.userId.toString() !== req.user!.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.json({ message: "Product updated successfully", product });
  } catch (error: any) {
    console.error("Update error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const publishProduct = async (req: Request, res: Response) => {
  try {
    console.log("Publishing product ID:", req.params.id);
    console.log("User ID:", req.user!.id);

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Verify user owns the product
    if (product.userId.toString() !== req.user!.id) {
      return res.status(403).json({ message: "Unauthorized: You don't own this product" });
    }

    product.isPublished = !product.isPublished;
    await product.save();

    console.log("Product published state:", product.isPublished);

    // Send response with published field for frontend compatibility
    const productObj = product.toObject();
    productObj.published = product.isPublished;

    res.status(200).json({
      message: product.isPublished
        ? "Product published"
        : "Product unpublished",
      product: productObj,
    });
  } catch (error: any) {
    console.error("Publish error:", error);
    res.status(500).json({ message: error.message });
  }
};