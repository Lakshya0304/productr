"use client";

import Navbar from "@/components/Navbar";
import AddProductModal from "@/components/AddProductModal";
import ProductCard from "@/components/ProductCard";
import { Card, CardContent } from "@/components/ui/card";
import { useProducts } from "@/hooks/useProducts";
import { useState } from "react";

interface EditingProduct {
  _id: string;
  name: string;
  type: string;
  stock: number;
  mrp: number;
  price: number;
  brand: string;
  exchange: string;
}

export default function ProductsPage() {
  const { products, deleteProduct, togglePublish, fetchProducts } = useProducts();
  const [editingProduct, setEditingProduct] = useState<EditingProduct | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleEdit = (productId: string) => {
    const product = products.find(p => p._id === productId);
    if (product) {
      setEditingProduct(product);
      setShowEditModal(true);
    }
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    setEditingProduct(null);
    fetchProducts();
  };

  const handleCreateSuccess = () => {
    fetchProducts();
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F7FA]">
      <Navbar/>
        
      {products.length > 0 && (
        <div className="flex justify-end px-10 mt-6">
          <AddProductModal onSuccess={handleCreateSuccess} />
        </div>
      )}

      {editingProduct && (
        <AddProductModal
          productId={editingProduct._id}
          product={editingProduct}
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingProduct(null);
          }}
          onSuccess={handleEditSuccess}
        />
      )}

      {products.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-10">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onDelete={deleteProduct}
              onPublish={togglePublish}
              onEdit={handleEdit}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <Card className="max-w-xl bg-transparent border-none text-center">
            <CardContent className="space-y-4">
              <h2 className="text-xl font-semibold">Feels a little empty...</h2>
              <p className="text-gray-500 text-sm">
                Create products now and connect your store later.
              </p>
              <AddProductModal onSuccess={handleCreateSuccess} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}


