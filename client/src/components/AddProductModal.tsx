"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FileUploader from "./Fileuploader";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { BACKEND_URL } from "@/config";
import { useEffect, useState } from "react";


const formSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  type: z.string().min(1, "Please select product type"),
  stock: z.string().min(1, "Enter stock quantity"),
  mrp: z.string().min(1, "Enter MRP"),
  price: z.string().min(1, "Enter selling price"),
  brand: z.string().min(1, "Brand name required"),
  exchange: z.string().min(1, "Select yes or no"),
  image: z.instanceof(File).optional().nullable(),
});
type FormValues = {
  name: string;
  type: string;
  stock: string;
  mrp: string;
  price: string;
  brand: string;
  exchange: string;
  image?: File | null;
};

interface AddProductModalProps {
  productId?: string | null;
  product?: {
    name: string;
    type: string;
    stock: number;
    mrp: number;
    price: number;
    brand: string;
    exchange: string;
  } | null;
  onClose?: () => void;
  onSuccess?: () => void;
  isOpen?: boolean;
}

export default function AddProductModal({ 
  productId = null, 
  product = null,
  onSuccess,
  isOpen = false
}: AddProductModalProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(isOpen);
  const isEditMode = !!productId;

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name || "",
      type: product?.type || "",
      stock: product?.stock?.toString() || "",
      mrp: product?.mrp?.toString() || "",
      price: product?.price?.toString() || "",
      brand: product?.brand || "",
      exchange: product?.exchange || "",
      image: null,
    },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        type: product.type,
        stock: product.stock.toString(),
        mrp: product.mrp.toString(),
        price: product.price.toString(),
        brand: product.brand,
        exchange: product.exchange,
        image: null,
      });
    }
  }, [product, form]);


  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("Form Data Submitted:");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in");
        return;
      }

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("type", data.type);
      formData.append("stock", data.stock);
      formData.append("mrp", data.mrp);
      formData.append("price", data.price);
      formData.append("brand", data.brand);
      formData.append("exchange", data.exchange);

      if (data.image) {
        formData.append("image", data.image);
      }

      const method = isEditMode ? "PUT" : "POST";
      const endpoint = isEditMode 
        ? `${BACKEND_URL}/product/${productId}/edit` 
        : `${BACKEND_URL}/product/create-product`;

      const res = await fetch(endpoint, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Request failed");
      }

      const result = await res.json();
      console.log("Response:", result);

      toast.success(isEditMode ? "Product updated successfully!" : "Product created successfully!");
      form.reset();
      setOpen(false);
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/products");
      }
    } catch (error) {
      console.error(error);
      toast.error(isEditMode ? "Failed to update product" : "Failed to create product");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isEditMode && (
        <DialogTrigger asChild>
          <Button className="w-[315px] h-[40px] rounded-lg bg-[linear-gradient(180deg,#000FB4_13.75%,#4050FF_135%)]">
            Add your Products
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[480px] max-h-[95vh] overflow-y-auto p-8 bg-white rounded-xl shadow-2xl border border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {isEditMode ? "Edit Product" : "Add Product"}
          </DialogTitle>
        </DialogHeader>

        <form
          className="grid gap-4 mt-3"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {/* Product Name */}
          <div className="grid gap-1">
            <Label>Product Name</Label>
            <Input
              {...form.register("name")}
              placeholder="CakeZone Walnut Brownie"
            />
            <p className="text-red-500 text-sm">
              {form.formState.errors.name?.message}
            </p>
          </div>

          {/* Product Type */}
          <div className="grid gap-1">
            <Label>Product Type</Label>
            <Select onValueChange={(val) => form.setValue("type", val)}>
              <SelectTrigger className="w-full ">
                <SelectValue placeholder="Select product type" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="clothing">Clothes</SelectItem>
                <SelectItem value="beauty products">Beauty Products</SelectItem>
                <SelectItem value="others">Others</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-red-500 text-sm">
              {form.formState.errors.type?.message}
            </p>
          </div>

          {/* Stock */}
          <div className="grid gap-1">
            <Label>Quantity Stock</Label>
            <Input {...form.register("stock")} placeholder="Stock available" />
            <p className="text-red-500 text-sm">
              {form.formState.errors.stock?.message}
            </p>
          </div>

          {/* MRP */}
          <div className="grid gap-1">
            <Label>MRP</Label>
            <Input {...form.register("mrp")} placeholder="Enter MRP" />
            <p className="text-red-500 text-sm">
              {form.formState.errors.mrp?.message}
            </p>
          </div>

          {/* Selling Price */}
          <div className="grid gap-1">
            <Label>Selling Price</Label>
            <Input {...form.register("price")} placeholder="Enter price" />
            <p className="text-red-500 text-sm">
              {form.formState.errors.price?.message}
            </p>
          </div>

          {/* Brand */}
          <div className="grid gap-1">
            <Label>Brand Name</Label>
            <Input {...form.register("brand")} placeholder="Brand name" />
            <p className="text-red-500 text-sm">
              {form.formState.errors.brand?.message}
            </p>
          </div>

          {/* File Upload */}
          <div className="grid gap-1">
            <Label>Upload Product image</Label>
            <FileUploader
              onFileSelect={(file) => form.setValue("image", file)}
            />
            <p className="text-red-500 text-sm">
              {form.formState.errors.image?.message}
            </p>
          </div>

          {/* Exchange */}
          <div className="grid gap-1">
            <Label>Exchange Eligibility</Label>
            <Select onValueChange={(val) => form.setValue("exchange", val)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Yes / No" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-red-500 text-sm">
              {form.formState.errors.exchange?.message}
            </p>
          </div>

          <div className="flex justify-end mt-3">
            <Button type="submit" className="bg-blue-600 w-24">
              {isEditMode ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}