"use client";

import { useState, useEffect } from "react";
import { collection, query, where, getDocs, addDoc, doc, updateDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";

type Contract = {
  id: string;
  cropName: string;
  quantity: number;
  price: number;
  farmerId: string;
  farmerName: string;
  status: "pending" | "active" | "completed" | "cancelled";
  createdAt: string;
  deliveryDate: string;
  buyerId?: string;
  paymentStatus?: "pending" | "completed";
};

// Sample contracts for demonstration
const sampleContracts: Omit<Contract, "id" | "buyerId">[] = [
  {
    cropName: "Premium Potatoes",
    quantity: 150,
    price: 35,
    farmerId: "sample-farmer-1",
    farmerName: "Vikram Singh",
    status: "active",
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    deliveryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    cropName: "Organic Wheat",
    quantity: 800,
    price: 40,
    farmerId: "sample-farmer-2",
    farmerName: "Aman Patel",
    status: "pending",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    deliveryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    cropName: "Fresh Oranges",
    quantity: 250,
    price: 90,
    farmerId: "sample-farmer-3",
    farmerName: "Priya Sharma",
    status: "completed",
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    deliveryDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    cropName: "Banana Bunch",
    quantity: 180,
    price: 55,
    farmerId: "sample-farmer-4",
    farmerName: "Rajesh Kumar",
    status: "cancelled",
    createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    deliveryDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

export function BuyerDashboard() {
  const { user } = useAuth();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingContract, setProcessingContract] = useState<string | null>(null);

  const fetchContracts = async () => {
    if (!user) return;

    try {
      const q = query(
        collection(db, "contracts"),
        where("buyerId", "==", user.uid)
      );
      
      const querySnapshot = await getDocs(q);
      const contractsData: Contract[] = [];
      
      querySnapshot.forEach((doc) => {
        contractsData.push({ id: doc.id, ...doc.data() } as Contract);
      });
      
      // If no contracts found, add sample contracts (only in development)
      if (contractsData.length === 0 && process.env.NODE_ENV === "development") {
        const addedContracts: Contract[] = [];
        
        for (const sampleContract of sampleContracts) {
          try {
            const contractData = {
              ...sampleContract,
              buyerId: user.uid,
              paymentStatus: "pending"
            };
            
            const docRef = await addDoc(collection(db, "contracts"), contractData);
            addedContracts.push({ id: docRef.id, ...contractData });
          } catch (error) {
            console.error("Error adding sample contract:", error);
          }
        }
        
        setContracts(addedContracts);
      } else {
        setContracts(contractsData);
      }
    } catch (error) {
      console.error("Error fetching contracts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, [user]);

  const getContractsByStatus = (status: Contract["status"]) => {
    return contracts.filter((contract) => contract.status === status);
  };

  const handleMakePayment = async (contractId: string) => {
    if (!user) return;
    
    setProcessingContract(contractId);
    try {
      // In a real app, here you would integrate a payment gateway
      // For this demo, we'll just mark the payment as completed
      await updateDoc(doc(db, "contracts", contractId), {
        paymentStatus: "completed",
        paymentDate: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      // Update local state
      setContracts(contracts.map(contract => 
        contract.id === contractId ? {...contract, paymentStatus: "completed"} : contract
      ));
      
      toast({
        title: "Payment Successful",
        description: "Your payment has been processed successfully.",
      });
    } catch (error) {
      console.error("Error processing payment:", error);
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingContract(null);
    }
  };

  const handleCancelRequest = async (contractId: string) => {
    if (!user) return;
    
    setProcessingContract(contractId);
    try {
      await updateDoc(doc(db, "contracts", contractId), {
        status: "cancelled",
        cancelledBy: "buyer",
        cancellationReason: "Cancelled by buyer",
        updatedAt: new Date().toISOString()
      });
      
      // Update local state
      setContracts(contracts.map(contract => 
        contract.id === contractId ? {...contract, status: "cancelled"} : contract
      ));
      
      toast({
        title: "Request Cancelled",
        description: "Your contract request has been cancelled.",
      });
    } catch (error) {
      console.error("Error cancelling request:", error);
      toast({
        title: "Error",
        description: "Failed to cancel the request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingContract(null);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading your dashboard...</div>;
  }

  // Empty state when no contracts are available
  if (contracts.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Buyer Dashboard</h1>
          <Link href="/marketplace">
            <Button>Browse Marketplace</Button>
          </Link>
        </div>

        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold mb-3">No Contracts Yet</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Browse the marketplace to find products and create contract proposals with farmers.
          </p>
          <Link href="/marketplace">
            <Button size="lg">Explore Marketplace</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Buyer Dashboard</h1>
        <Link href="/marketplace">
          <Button>Browse Marketplace</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Active Contracts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {getContractsByStatus("active").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Pending Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {getContractsByStatus("pending").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Completed Deals</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {getContractsByStatus("completed").length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
        {["active", "pending", "completed", "cancelled"].map((status) => (
          <TabsContent key={status} value={status}>
            <div className="grid gap-4">
              {getContractsByStatus(status as Contract["status"]).length === 0 ? (
                <p className="text-center py-10 text-muted-foreground">
                  No {status} contracts found.
                </p>
              ) : (
                getContractsByStatus(status as Contract["status"]).map((contract) => (
                  <Card key={contract.id}>
                    <CardHeader>
                      <CardTitle>{contract.cropName}</CardTitle>
                      <CardDescription>
                        Contract with {contract.farmerName}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Quantity</p>
                          <p>{contract.quantity} kg</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Price</p>
                          <p>₹{contract.price} per kg</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total Value</p>
                          <p>₹{contract.price * contract.quantity}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Delivery Date</p>
                          <p>{new Date(contract.deliveryDate).toLocaleDateString()}</p>
                        </div>
                        {contract.paymentStatus && (
                          <div>
                            <p className="text-sm text-muted-foreground">Payment Status</p>
                            <p className="capitalize">{contract.paymentStatus}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline">View Details</Button>
                      {status === "active" && contract.paymentStatus !== "completed" && (
                        <Button 
                          onClick={() => handleMakePayment(contract.id)}
                          disabled={processingContract === contract.id}
                        >
                          {processingContract === contract.id ? "Processing..." : "Make Payment"}
                        </Button>
                      )}
                      {status === "pending" && (
                        <Button 
                          variant="outline" 
                          className="text-red-500"
                          onClick={() => handleCancelRequest(contract.id)}
                          disabled={processingContract === contract.id}
                        >
                          {processingContract === contract.id ? "Processing..." : "Cancel Request"}
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
} 