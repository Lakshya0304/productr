
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

function GridLoader() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <Skeleton className="w-16 h-16 rounded-lg" />
      <Skeleton className="w-48 h-4" />
      <Skeleton className="w-64 h-3" />
    </div>
  );
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"published" | "unpublished">("published");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const res = await fetch("http://localhost:3000/product", {
          headers: { Authorization: `Bearer ${token}` },
        });
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

  const filteredProducts = products.filter((p) =>
    tab === "published" ? p.published : !p.published
  );

  return (
    <div className="flex flex-col w-full h-full bg-[#F5F7FA]">
      <Navbar />

      <div className="p-10 w-full h-full flex flex-col items-center">
        <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
          <TabsList>
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="unpublished">Unpublished</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="mt-10 w-full flex justify-center">
          {loading ? (
            <GridLoader />
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-6xl">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <Card className="w-full max-w-xl shadow-none border-none bg-transparent text-center">
              <CardContent>
                <GridLoader />
                <h2 className="text-xl font-semibold">
                  No {tab === "published" ? "Published" : "Unpublished"}{" "}
                  Products
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Your {tab} products will appear here
                  <br />
                  Create your first product to publish
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
