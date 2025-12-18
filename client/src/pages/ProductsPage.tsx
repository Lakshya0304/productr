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

// "use client";

// import Navbar from "@/components/Navbar";
// import { Card, CardContent } from "@/components/ui/card";
// import AddProductModal from "@/components/AddProductModal";
// import ProductCard from "@/components/ProductCard";
// import { useEffect, useState } from "react";
// import { BACKEND_URL } from "@/config";

// interface Product {
//   _id: string;
//   name: string;
//   type: string;
//   stock: number;
//   mrp: number;
//   price: number;
//   brand: string;
//   exchange: "yes" | "no";
//   images?: string[];
//   published: boolean;
// }

// export default function ProductsPage() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) return;

//         const res = await fetch(`${BACKEND_URL}/product`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (!res.ok) throw new Error("Failed to fetch products");

//         const data = await res.json();
//         setProducts(data.products || []);
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   const handleDelete = async (id: string) => {
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this product?"
//     );
//     if (!confirmDelete) return;

//     try {
//       const token = localStorage.getItem("token");
//       if (!token) return;

//       const res = await fetch(
//         `${BACKEND_URL}/product/${id}`,
//         {
//           method: "DELETE",
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       if (!res.ok) throw new Error("Failed to delete product");

//       setProducts((prev) => prev.filter((product) => product._id !== id));
//       alert("Product deleted successfully!");
//     } catch (error) {
//       console.error(error);
//       alert("Error deleting product");
//     }
//   };

//   const handlePublishToggle = async (id: string) => {
//     try {
//       const res = await fetch(
//         `${BACKEND_URL}/product/${id}/publish`,
//         {
//           method: "PATCH",
//         }
//       );

//       const data = await res.json();
//       setProducts((prev) => prev.map((p) => (p._id === id ? data.product : p)));
//     } catch (error) {
//       console.error("Publish toggle failed", error);
//     }
//   };

//   return (
//     <div className="flex flex-col w-full h-full bg-[#F5F7FA]">
//       <Navbar />

//       {products.length > 0 ? (
//         <div className="flex justify-end px-10 mt-6">
//           <AddProductModal />
//         </div>
//       ) : null}

//       {loading ? (
//         <div className="mt-10 w-full min-h-[80vh] flex items-center justify-center">
//           <p>Loading products...</p>
//         </div>
//       ) : products.length > 0 ? (
//         <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full px-10">
//           {products.map((product) => (
//             <ProductCard
//               key={product._id}
//               product={product}
//               onPublish={handlePublishToggle}
//               onDelete={handleDelete}
//             />
//           ))}
//         </div>
//       ) : (
//         <div className="mt-10 w-full min-h-[80vh] flex items-center justify-center">
//           <Card className="w-full max-w-xl shadow-none border-none bg-transparent text-center">
//             <CardContent className="flex flex-col items-center gap-4">
//               <h2 className="text-xl font-semibold">
//                 Feels a little empty over here...
//               </h2>
//               <p className="text-gray-500 text-sm mt-1">
//                 You can create products without connecting a store.
//                 <br />
//                 You can add products to your store anytime.
//               </p>
//               <div className="mt-6">
//                 <AddProductModal />
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       )}
//     </div>
//   );
// }
