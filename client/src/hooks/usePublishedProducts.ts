import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { Product } from "@/types/product";

export function usePublishedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllProducts = async () => {
    try {
      const data = await apiFetch("/product/all");
      setProducts(data.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const togglePublish = async (id: string) => {
    try {
      const data = await apiFetch(`/product/${id}/publish`, {
        method: "PATCH",
      });
      // Update product in list
      setProducts((prev) => prev.map((p) => (p._id === id ? { ...p, published: data.product.published } : p)));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  return {
    products,
    loading,
    fetchAllProducts,
    togglePublish,
  };
}
