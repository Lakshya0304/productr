import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Navbar() {
  return (
    <div className="w-full h-16 bg-white shadow-sm flex justify-end items-center px-6">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 cursor-pointer hover:opacity-80 transition">
          <AvatarImage src="/avatar.png" alt="User Avatar" />
          <AvatarFallback className="rounded-full bg-gray-200 text-gray-700">
            P
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
