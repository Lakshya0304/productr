import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const username = user.name || "User";

  const getTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Home";
      case "/products":
        return "Products";
      default:
        return "";
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "";
    const names = name.split(" ");
    const initials =
      names.length === 1
        ? names[0][0]
        : names[0][0] + names[names.length - 1][0];
    return initials.toUpperCase();
  };


  return (
    <div className="w-full h-16 bg-white shadow-sm flex justify-between items-center px-6">
      <h1 className="text-lg font-bold text-gray-900">{getTitle()}</h1>

      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 cursor-pointer hover:opacity-80 transition">
          <AvatarImage src="/avatar.png" alt="User Avatar" />
          <AvatarFallback className="rounded-full bg-gray-200 text-gray-700">
            {getInitials(username)}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}

