import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { useState } from "react";

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

interface ProductCardProps {
  product: Product;
  onPublish?: (id: string) => Promise<void> | void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function ProductCard({
  product,
  onPublish,
  onEdit,
  onDelete,
}: ProductCardProps) {
  const [publishing, setPublishing] = useState(false);

  const image =product.images?.[0] || "loading...";

  const handlePublish = async () => {
    if (!onPublish) return;
    try {
      setPublishing(true);
      await onPublish(product._id); // backend call happens in parent
    } finally {
      setPublishing(false);
    }
  };

  return (
    <Card className="w-[360px] rounded-3xl m-2 p-4 shadow-sm border">
      <CardContent className="p-0 flex flex-col items-center">
        {/* Image */}
        <div className="relative w-[260px] h-[220px] overflow-hidden rounded-xl border">
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Name */}
        <h2 className="text-[18px] font-medium mt-6 text-center">
          {product.name}
        </h2>

        {/* Details */}
        <div className="w-full mt-3 space-y-2 text-[14px]">
          <Detail label="Product type" value={product.type} />
          <Detail label="Quantity Stock" value={product.stock.toString()} />
          <Detail label="MRP" value={`₹ ${product.mrp}`} />
          <Detail label="Selling Price" value={`₹ ${product.price}`} />
          <Detail label="Brand Name" value={product.brand} />
          <Detail
            label="Total Images"
            value={product.images?.length.toString() || "0"}
          />
          <Detail
            label="Exchange Eligibility"
            value={product.exchange.toUpperCase()}
          />
        </div>

        {/* Actions */}
        <div className="w-full flex justify-between items-center mt-6">
            <Button
                disabled={publishing}
                onClick={handlePublish}
                className={`w-[140px] h-[45px] rounded-xl text-white transition-colors
                ${product.published? "bg-green-600": "bg-blue-600"}`}
            >
                {product.published ? "Unpublish" : "Publish"}
            </Button>

          <Button
            variant="outline"
            className="w-[110px] h-[45px] rounded-xl"
            onClick={() => onEdit?.(product._id)}
          >
            Edit
          </Button>

          <Button
            variant="ghost"
            className="h-[45px] w-[45px] rounded-xl"
            onClick={() => onDelete?.(product._id)}
          >
            <Trash2 size={22} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-400">{label} -</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Trash2 } from "lucide-react";

// export interface Product {
//   _id: string;
//   name: string;
//   type: string;
//   stock: number;
//   mrp: number;
//   price: number;
//   brand: string;
//   exchange: "yes" | "no";
//   image?: string;
//   published: boolean;
// }

// interface ProductCardProps {
//   product: Product;
//   onPublish?: (id: string) => void;
//   onEdit?: (id: string) => void;
//   onDelete?: (id: string) => void;
// }

// export default function ProductCard({
//   product,
//   onPublish,
//   onEdit,
//   onDelete,
// }: ProductCardProps) {
//   const images = product.image

//   return (
//     <Card className="w-[360px] rounded-3xl m-2 p-4 shadow-sm border">
//       <CardContent className="p-0 flex flex-col items-center">
//         <div className="w-full flex justify-center">
//           <div className="relative w-[260px] h-[220px] overflow-hidden rounded-xl border">
//             <img
//               src={images}
//               alt={product.image}
//               className="w-full h-full object-cover"
//             />
//           </div>
//         </div>

//         <h2 className="text-[18px] font-medium mt-6 text-center">
//           {product.name}
//         </h2>

//         <div className="w-full mt-3 space-y-2 text-[14px]">
//           <Detail label="Product type" value={product.type} />
//           <Detail label="Quantity Stock" value={product.stock.toString()} />
//           <Detail label="MRP" value={`₹ ${product.mrp}`} />
//           <Detail label="Selling Price" value={`₹ ${product.price}`} />
//           <Detail label="Brand Name" value={product.brand} />
//           <Detail
//             label="Total Number of images"
//             value={images?.length.toString() || "0"}
//           />
//           <Detail
//             label="Exchange Eligibility"
//             value={product.exchange.toUpperCase()}
//           />
//         </div>

//         <div className="w-full flex justify-between items-center mt-6">
//           <Button
//             className={`w-[140px] h-[45px] text-white text-[15px] rounded-xl ${
//               product.published
//                 ? "bg-green-600 hover:bg-green-700"
//                 : "bg-[linear-gradient(180deg,#000FB4_13.75%,#4050FF_135%)]"
//             }`}
//             onClick={() => onPublish?.(product._id)}
//           >
//             {product.published ? "Unpublish" : "Publish"}
//           </Button>

//           <Button
//             variant="outline"
//             className="w-[110px] h-[45px] rounded-xl border"
//             onClick={() => onEdit?.(product._id)}
//           >
//             Edit
//           </Button>

//           <Button
//             variant="ghost"
//             className="h-[45px] w-[45px] rounded-xl"
//             onClick={() => onDelete?.(product._id)}
//           >
//             <Trash2 size={22} />
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

// function Detail({ label, value }: { label: string; value: string }) {
//   return (
//     <div className="flex justify-between">
//       <span className="text-gray-400">{label} -</span>
//       <span className="font-medium">{value}</span>
//     </div>
//   );
// }
