import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { Product } from "@/types/product";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const data = await apiFetch("/product");
      setProducts(data.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    await apiFetch(`/product/${id}`, { method: "DELETE" });
    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  const togglePublish = async (id: string) => {
    console.log("Toggling publish for product ID:", id);
    const data = await apiFetch(`/product/${id}/publish`, {
      method: "PATCH",
    });

    setProducts((prev) => prev.map((p) => (p._id === id ? data.product : p)));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    fetchProducts,
    deleteProduct,
    togglePublish,
  };
}
