"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Link from "next/link";

type Listing = {
  id: string;
  farmerId: string;
  farmerName: string;
  cropName: string;
  cropCategory: string;
  availableQuantity: number;
  minPrice: number;
  description: string;
  location: string;
  harvestDate: string;
  createdAt: string;
};

// Sample listings for demonstration
const sampleListings: Omit<Listing, "id">[] = [
  {
    farmerId: "sample1",
    farmerName: "Rajesh Kumar",
    cropName: "Organic Tomatoes",
    cropCategory: "Vegetables",
    availableQuantity: 500,
    minPrice: 25,
    description: "Fresh organic tomatoes grown without pesticides. Ideal for restaurants and food processors looking for quality produce.",
    location: "Nashik, Maharashtra",
    harvestDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    farmerId: "sample2",
    farmerName: "Anita Patel",
    cropName: "Basmati Rice",
    cropCategory: "Grains",
    availableQuantity: 1000,
    minPrice: 60,
    description: "Premium quality basmati rice with exceptional aroma. Long grain variety suitable for export and premium restaurants.",
    location: "Karnal, Haryana",
    harvestDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    farmerId: "sample3",
    farmerName: "Mohammed Khan",
    cropName: "Alphonso Mangoes",
    cropCategory: "Fruits",
    availableQuantity: 300,
    minPrice: 200,
    description: "The king of mangoes! Premium Alphonso mangoes known for their sweet taste and aromatic flavor. Perfect for direct consumption and pulp production.",
    location: "Ratnagiri, Maharashtra",
    harvestDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
  },
];

export default function MarketplacePage() {
  const { user, userData } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = ["Vegetables", "Fruits", "Grains", "Dairy", "Poultry"];

  useEffect(() => {
    const fetchListings = async () => {
      try {
        // First attempt to get data from Firestore
        const querySnapshot = await getDocs(collection(db, "listings"));
        const listingsData: Listing[] = [];
        
        querySnapshot.forEach((doc) => {
          listingsData.push({ id: doc.id, ...doc.data() } as Listing);
        });
        
        // If no listings found in Firestore
        if (listingsData.length === 0) {
          try {
            // Attempt to add sample listings to Firestore if we're in development mode
            if (process.env.NODE_ENV === "development") {
              const addedListings: Listing[] = [];
              
              for (const sampleListing of sampleListings) {
                try {
                  const docRef = await addDoc(collection(db, "listings"), sampleListing);
                  addedListings.push({ id: docRef.id, ...sampleListing });
                } catch (addError) {
                  console.error("Error adding sample listing:", addError);
                }
              }
              
              // If we successfully added some listings
              if (addedListings.length > 0) {
                setListings(addedListings);
                setFilteredListings(addedListings);
                setLoading(false);
                return;
              }
            }
            
            // If we couldn't add sample listings to Firestore or not in development,
            // just use the sample data directly without storing in Firebase
            const mockListings = sampleListings.map((listing, index) => ({
              ...listing,
              id: `sample-${index}`,
            }));
            
            setListings(mockListings);
            setFilteredListings(mockListings);
          } catch (mockError) {
            console.error("Error setting up mock listings:", mockError);
            setError("Unable to load listings. Please try again later.");
          }
        } else {
          // We got actual listings from Firestore
          setListings(listingsData);
          setFilteredListings(listingsData);
        }
      } catch (error) {
        console.error("Error fetching listings:", error);
        
        // Fallback to sample data if Firebase query fails
        const mockListings = sampleListings.map((listing, index) => ({
          ...listing,
          id: `sample-${index}`,
        }));
        
        setListings(mockListings);
        setFilteredListings(mockListings);
        setError("Unable to connect to database. Showing sample data instead.");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  useEffect(() => {
    let result = listings;

    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        (listing) =>
          listing.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          listing.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          listing.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter(
        (listing) => listing.cropCategory === selectedCategory
      );
    }

    setFilteredListings(result);
  }, [searchTerm, selectedCategory, listings]);

  const handleProposeContract = (listing: Listing) => {
    setSelectedListing(listing);
    setPrice(listing.minPrice);
    setQuantity(Math.min(10, listing.availableQuantity));
    setOpenDialog(true);
  };

  const handleSubmitProposal = async () => {
    if (!user || !userData || !selectedListing) return;
    
    try {
      // Create the contract in Firestore
      const contractData = {
        listingId: selectedListing.id,
        farmerId: selectedListing.farmerId,
        farmerName: selectedListing.farmerName,
        buyerId: user.uid,
        buyerName: userData.fullName,
        cropName: selectedListing.cropName,
        quantity,
        price,
        status: "pending",
        createdAt: new Date().toISOString(),
        deliveryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      };
      
      await addDoc(collection(db, "contracts"), contractData);
      
      setOpenDialog(false);
      alert("Contract proposal submitted successfully!");
    } catch (error) {
      console.error("Error creating contract:", error);
      alert("Failed to submit proposal. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center">Loading marketplace...</div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Error notification */}
      {error && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800">
          <p>{error}</p>
        </div>
      )}
      
      {/* Marketplace Header */}
      <div className="max-w-3xl mx-auto mb-10 text-center">
        <h1 className="mb-4 text-3xl font-bold">Marketplace</h1>
        <p className="mb-6 text-lg text-gray-600">
          Connect directly with farmers and secure contracts for high-quality agricultural produce.
          Browse available listings or use filters to find specific crops.
        </p>
        
        {userData?.userType === "farmer" ? (
          <Link href="/create-listing">
            <Button size="lg" className="mx-auto">Create New Listing</Button>
          </Link>
        ) : !user ? (
          <div className="space-y-3">
            <p className="font-medium text-gray-700">Sign in to propose contracts with farmers</p>
            <div className="flex justify-center gap-4">
              <Link href="/sign-in">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button>Sign Up</Button>
              </Link>
            </div>
          </div>
        ) : null}
      </div>
      
      {/* Search and Filter */}
      <div className="max-w-5xl mx-auto flex flex-col gap-4 mb-8 md:flex-row">
        <div className="flex-1">
          <Input
            placeholder="Search crops, farmers, or descriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="md:w-60">
          <select
            className="w-full p-2 border rounded-md"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Marketplace Instructions */}
      {filteredListings.length === 0 ? (
        <div className="max-w-5xl mx-auto p-10 text-center">
          <h3 className="mb-4 text-xl font-medium">No listings found</h3>
          <p className="mb-6 text-muted-foreground">
            Try adjusting your search or filters, or check back later for new listings.
          </p>
          
          {userData?.userType === "farmer" && (
            <Link href="/create-listing">
              <Button>Create Your First Listing</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h2 className="mb-2 text-xl font-medium">Available Listings</h2>
            <p className="text-muted-foreground">
              Browse these listings and propose contracts directly with farmers.
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredListings.map((listing) => (
              <Card key={listing.id} className="overflow-hidden border-t-4" style={{borderTopColor: getCategoryColor(listing.cropCategory)}}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{listing.cropName}</CardTitle>
                      <CardDescription>
                        by {listing.farmerName} • {listing.location}
                      </CardDescription>
                    </div>
                    <div className="px-2 py-1 text-xs font-medium text-white rounded-full" style={{backgroundColor: getCategoryColor(listing.cropCategory)}}>
                      {listing.cropCategory}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm">{listing.description}</p>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Available</p>
                        <p className="font-medium">{listing.availableQuantity} kg</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Min. Price</p>
                        <p className="font-medium">₹{listing.minPrice} per kg</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Total Value</p>
                        <p className="font-medium">₹{listing.availableQuantity * listing.minPrice}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Harvest Date</p>
                        <p className="font-medium">{new Date(listing.harvestDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  {userData?.userType === "buyer" ? (
                    <Button
                      className="w-full"
                      onClick={() => handleProposeContract(listing)}
                    >
                      Propose Contract
                    </Button>
                  ) : userData?.userType === "farmer" ? (
                    <Button className="w-full" variant="outline" disabled>
                      You are a Farmer
                    </Button>
                  ) : (
                    <Link href="/sign-in" className="w-full">
                      <Button className="w-full" variant="outline">
                        Sign in to Propose
                      </Button>
                    </Link>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {/* Contract Proposal Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Propose Contract</DialogTitle>
            <DialogDescription>
              Create a contract proposal for {selectedListing?.cropName} from {selectedListing?.farmerName}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid items-center grid-cols-4 gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantity (kg)
              </Label>
              <Input
                id="quantity"
                type="number"
                className="col-span-3"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                max={selectedListing?.availableQuantity}
                min={1}
              />
            </div>
            <div className="grid items-center grid-cols-4 gap-4">
              <Label htmlFor="price" className="text-right">
                Price per kg (₹)
              </Label>
              <Input
                id="price"
                type="number"
                className="col-span-3"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                min={selectedListing?.minPrice}
              />
            </div>
            <div className="grid items-center grid-cols-4 gap-4">
              <Label className="text-right">Total Value</Label>
              <div className="col-span-3">₹{(price * quantity).toFixed(2)}</div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSubmitProposal}>Submit Proposal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Helper function to get color for category
function getCategoryColor(category: string): string {
  switch (category) {
    case "Vegetables":
      return "#22c55e"; // green-500
    case "Fruits":
      return "#f97316"; // orange-500
    case "Grains":
      return "#eab308"; // yellow-500
    case "Dairy":
      return "#06b6d4"; // cyan-500
    case "Poultry":
      return "#ec4899"; // pink-500
    default:
      return "#6366f1"; // indigo-500
  }
} 