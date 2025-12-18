import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { Product } from "@/types/product";

export function usePublishedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPublishedAndUnpublished = async () => {
    try {
      setLoading(true);
      const publishedData = await apiFetch("/product/published");
      
      const allData = await apiFetch("/product/all");
      
      const unpublishedProducts = allData.products.filter((p: Product) => !p.published);
      
      const combinedProducts = [...publishedData.products, ...unpublishedProducts];
      
      setProducts(combinedProducts);
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
      setProducts((prev) => prev.map((p) => (p._id === id ? { ...p, published: data.product.published } : p)));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPublishedAndUnpublished();
  }, []);

  return {
    products,
    loading,
    fetchPublishedAndUnpublished,
    togglePublish,
  };
}
