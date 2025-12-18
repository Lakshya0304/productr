import { Request, Response } from "express";
import { Product } from "../modals/productModal";
import multer from "multer";
import path from "path";
import id from "zod/v4/locales/id.js";

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

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({
      userId: req.user!.id,
    });

    res.json({
      count: products.length,
      products,
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
    const { name, type, stock, mrp, price, brand, exchange } = req.body;

    const updateData: any = {};

    if (name) updateData.name = name;
    if (type) updateData.type = type;
    if (stock) updateData.stock = parseInt(stock);
    if (mrp) updateData.mrp = parseFloat(mrp);
    if (price) updateData.price = parseFloat(price);
    if (brand) updateData.brand = brand;
    if (exchange) updateData.exchange = exchange;

    if (req.file) {
      updateData.image = req.file.filename;
    }

    const product = await Product.findOneAndUpdate(
      { _id: id, userId: req.user!.id },
      { $set: updateData },
      { new: true } 
    );

    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product updated successfully", product });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const publishProduct = async (req: Request, res: Response) => {
  try {
    console.log("Toggling publish for product ID:", req.params.id);
    const product = await Product.findById(req.params.id);
    // if (!product) {
    //   return res.status(404).json({ message: "Product not found" });
    // }
    // product.isPublished = !product.isPublished;
    // await product.save();
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { isPublished: !product?.isPublished },
      { new: true } // return updated document
    );
    await updatedProduct?.save();

    res.status(200).json({
      message: product?.isPublished
        ? "Product published"
        : "Product unpublished",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getPublishedProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({
        userId: req.user!.id,
        isPublished: true});

    res.json({ products });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  } 
};