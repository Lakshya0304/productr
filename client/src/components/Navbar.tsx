import { Skeleton } from "./ui/skeleton";


export default function Navbar() {
  return (
    <div className="w-full h-16 bg-white shadow-sm flex justify-end items-center px-6">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
      </div>
    </div>
  );
}