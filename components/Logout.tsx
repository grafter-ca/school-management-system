import { useAuth } from "@/context/AuthContext";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const { logout } = useAuth();

  return (
    <Button
      variant="destructive"
      onClick={logout}
      className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
    >
      <LogOut className="w-5 h-5" />
      <span className="hidden sm:inline">Logout</span>{" "}
    </Button>
  );
}
