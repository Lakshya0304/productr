import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import type { Product } from "@/types/product";
import { Trash2, Check } from "lucide-react";
import { useState } from "react";


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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const image =product.images?.[0] || "loading...";


  
  const handlePublish = async () => {
    if (!onPublish) return;
    try {
        // await fetch(`${BACKEND_URL}/product/${product._id}/publish`, {
        //   method: "PUT",
        //   headers: {
        //     Authorization: `Bearer ${localStorage.getItem("token")}`,
        //   },
        // });
      setPublishing(true);
      await onPublish(product._id);
        setToastMessage(
          `Product is now ${product.isPublished ? "unpublished" : "published"}`
        );
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    } finally {
      setPublishing(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!onDelete) return;
    try {
      setIsDeleting(true);
      await onDelete(product._id);
      setShowDeleteDialog(false);
      setToastMessage(`${product.name} was deleted successfully`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setIsDeleting(false);
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
                ${product.isPublished? "bg-green-600": "bg-blue-600"}`}
            >
                {product.isPublished ? "Unpublish" : "Publish"}
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
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 size={22} />
          </Button>
        </div>
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[400px] bg-white">
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{product.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 pt-4">
            <Button
                variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-500 text-black"
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showToast && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg animate-in fade-in slide-in-from-bottom-4 z-50">
          <Check size={20} />
          <span>{toastMessage}</span>
        </div>
      )}
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