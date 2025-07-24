"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Navbar() {
  const { user, userData, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  
  const isActive = (path: string) => {
    return pathname === path;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleSignOut = async () => {
    try {
      await logout();
      router.push("/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const navigateTo = (path: string) => {
    if (path === "/dashboard" && !userData) {
      // If userData isn't loaded yet, wait before navigating
      console.log("Waiting for user data to load before navigating to dashboard");
      return;
    }
    
    router.push(path);
  };

  return (
    <header className="border-b">
      <div className="container flex items-center justify-between h-16 mx-auto">
        <Link href="/" className="text-xl font-bold">
          FarmConnect
        </Link>
        
        <nav className="hidden space-x-6 md:flex">
          <Link
            href="/"
            className={`text-sm ${isActive("/") ? "font-medium" : "text-muted-foreground"}`}
          >
            Home
          </Link>
          <Link
            href="/marketplace"
            className={`text-sm ${isActive("/marketplace") ? "font-medium" : "text-muted-foreground"}`}
          >
            Marketplace
          </Link>
          <Link
            href="/about"
            className={`text-sm ${isActive("/about") ? "font-medium" : "text-muted-foreground"}`}
          >
            About
          </Link>
        </nav>
        
        <div>
          {user ? (
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigateTo("/dashboard")}
                className={isActive("/dashboard") ? "font-medium" : ""}
              >
                Dashboard
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigateTo("/profile")}
                className={isActive("/profile") ? "font-medium" : ""}
              >
                Profile
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                Sign Out
              </Button>
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {userData?.fullName ? getInitials(userData.fullName) : "U"}
                </AvatarFallback>
              </Avatar>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/sign-in" passHref>
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/sign-up" passHref>
                <Button>Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 