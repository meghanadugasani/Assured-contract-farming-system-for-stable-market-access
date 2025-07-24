"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ProfilePage() {
  const { user, userData, loading, logout, refreshUserData } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [userType, setUserType] = useState<"farmer" | "buyer">("buyer");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    // Redirect if user is not authenticated
    if (!loading && !user) {
      router.push("/sign-in");
    }
  }, [loading, user, router]);

  // Update form state when userData changes
  useEffect(() => {
    if (userData) {
      setFullName(userData.fullName || "");
      setLocation(userData.location || "");
      setPhone(userData.phone || "");
      setUserType(userData.userType);
    }
  }, [userData]);

  const handleSaveProfile = async () => {
    if (!user || !userData) return;
    
    setIsSaving(true);
    
    try {
      await updateDoc(doc(db, "users", user.uid), {
        fullName,
        location,
        phone,
        userType,
        updatedAt: new Date().toISOString(),
      });
      
      // Refresh user data to update UI
      await refreshUserData();
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      // Use replace to avoid back navigation issues
      router.replace("/sign-in");
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Show loading state while authentication is being checked
  if (loading) {
    return (
      <div className="container py-10">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  // Don't render anything if user is not authenticated
  if (!user || !userData) {
    return (
      <div className="container py-10">
        <div className="text-center">Please sign in to view your profile</div>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-10">
      <h1 className="mb-6 text-3xl font-bold">Profile</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Manage your account details and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Email (Cannot be changed)</div>
            <div className="p-2 border rounded-md bg-muted/50">{userData.email}</div>
          </div>
          
          {isEditing ? (
            <div className="space-y-2">
              <Label htmlFor="userType">Account Type</Label>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={userType === "farmer" ? "default" : "outline"}
                  onClick={() => setUserType("farmer")}
                >
                  Farmer
                </Button>
                <Button
                  type="button"
                  variant={userType === "buyer" ? "default" : "outline"}
                  onClick={() => setUserType("buyer")}
                >
                  Buyer
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Account Type</div>
              <div className="p-2 border rounded-md bg-muted/50 capitalize">{userData.userType}</div>
            </div>
          )}
          
          {isEditing ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, State"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Your contact number"
                />
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Full Name</div>
                <div className="p-2 border rounded-md">{userData.fullName || "Not provided"}</div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Location</div>
                <div className="p-2 border rounded-md">{userData.location || "Not provided"}</div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Phone Number</div>
                <div className="p-2 border rounded-md">{userData.phone || "Not provided"}</div>
              </div>
            </>
          )}
          
          <div className="pt-4">
            <div className="text-sm text-muted-foreground">Member Since</div>
            <div className="pt-1">
              {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString(undefined, { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              }) : "Unknown"}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveProfile} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handleLogout} disabled={isLoggingOut}>
                {isLoggingOut ? "Signing Out..." : "Sign Out"}
              </Button>
              <Button onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
} 