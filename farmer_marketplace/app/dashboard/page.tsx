"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { FarmerDashboard } from "@/components/dashboard/FarmerDashboard";
import { BuyerDashboard } from "@/components/dashboard/BuyerDashboard";

export default function DashboardPage() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if we've confirmed the user isn't authenticated
    if (!loading && !user) {
      router.push("/sign-in");
    }
  }, [user, loading, router]);

  // Show loading state while authentication is being checked
  if (loading) {
    return (
      <div className="container py-10">
        <div className="text-center">Loading dashboard...</div>
      </div>
    );
  }

  // Don't render anything if user is not authenticated
  if (!user || !userData) {
    return (
      <div className="container py-10">
        <div className="text-center">
          Please wait while we load your dashboard...
        </div>
      </div>
    );
  }

  // Now we have confirmed user data, render the appropriate dashboard
  return (
    <div className="container py-10">
      {userData.userType === "farmer" ? (
        <FarmerDashboard />
      ) : (
        <BuyerDashboard />
      )}
    </div>
  );
} 