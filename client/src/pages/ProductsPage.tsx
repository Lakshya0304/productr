"use client";

import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import AddProductModal from "@/components/AddProductModal";
import ProductCard from "@/components/ProductCard";
import { useEffect, useState } from "react";

interface Product {
  _id: string;
  name: string;
  type: string;
  stock: number;
  mrp: number;
  price: number;
  brand: string;
  exchange: "yes" | "no";
  images?: string[];
  published: boolean;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch("http://localhost:3000/product", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch products");

        const data = await res.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`http://localhost:3000/product/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete product");

      setProducts((prev) => prev.filter((product) => product._id !== id));
      alert("Product deleted successfully!");
    } catch (error) {
      console.error(error);
      alert("Error deleting product");
    }
  };


  return (
    <div className="flex flex-col w-full h-full bg-[#F5F7FA]">
      <Navbar />

      {products.length > 0 ?
      <div className="flex justify-end px-10 mt-6">
        <AddProductModal />
      </div>: null}

      {loading ? (
        <div className="mt-10 w-full min-h-[80vh] flex items-center justify-center">
          <p>Loading products...</p>
        </div>
      ) : products.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full px-10">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="mt-10 w-full min-h-[80vh] flex items-center justify-center">
          <Card className="w-full max-w-xl shadow-none border-none bg-transparent text-center">
            <CardContent className="flex flex-col items-center gap-4">
              <h2 className="text-xl font-semibold">
                Feels a little empty over here...
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                You can create products without connecting a store.
                <br />
                You can add products to your store anytime.
              </p>
              <div className="mt-6">
                <AddProductModal />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
