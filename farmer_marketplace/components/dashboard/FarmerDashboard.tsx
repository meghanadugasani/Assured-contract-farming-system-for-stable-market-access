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
  buyerId: string;
  buyerName: string;
  status: "pending" | "active" | "completed" | "cancelled";
  createdAt: string;
  deliveryDate: string;
  farmerId?: string;
};

// Sample contracts for demonstration
const sampleContracts: Omit<Contract, "id" | "farmerId">[] = [
  {
    cropName: "Organic Tomatoes",
    quantity: 200,
    price: 25,
    buyerId: "sample-buyer-1",
    buyerName: "Fresh Foods Inc.",
    status: "active",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    deliveryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    cropName: "Rice",
    quantity: 500,
    price: 60,
    buyerId: "sample-buyer-2",
    buyerName: "Metro Supermarket",
    status: "pending",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    deliveryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    cropName: "Red Apples",
    quantity: 300,
    price: 75,
    buyerId: "sample-buyer-3",
    buyerName: "Organic Market Co.",
    status: "completed",
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    deliveryDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    cropName: "Green Chillies",
    quantity: 100,
    price: 45,
    buyerId: "sample-buyer-4",
    buyerName: "Spice Traders Ltd.",
    status: "cancelled",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    deliveryDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

export function FarmerDashboard() {
  const { user } = useAuth();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingContract, setProcessingContract] = useState<string | null>(null);

  const fetchContracts = async () => {
    if (!user) return;

    try {
      const q = query(
        collection(db, "contracts"),
        where("farmerId", "==", user.uid)
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
              farmerId: user.uid,
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

  const handleAcceptContract = async (contractId: string) => {
    if (!user) return;
    
    setProcessingContract(contractId);
    try {
      await updateDoc(doc(db, "contracts", contractId), {
        status: "active",
        updatedAt: new Date().toISOString()
      });
      
      // Update local state
      setContracts(contracts.map(contract => 
        contract.id === contractId ? {...contract, status: "active"} : contract
      ));
      
      toast({
        title: "Contract Accepted",
        description: "The contract has been accepted successfully.",
      });
    } catch (error) {
      console.error("Error accepting contract:", error);
      toast({
        title: "Error",
        description: "Failed to accept the contract. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingContract(null);
    }
  };

  const handleDeclineContract = async (contractId: string) => {
    if (!user) return;
    
    setProcessingContract(contractId);
    try {
      await updateDoc(doc(db, "contracts", contractId), {
        status: "cancelled",
        updatedAt: new Date().toISOString()
      });
      
      // Update local state
      setContracts(contracts.map(contract => 
        contract.id === contractId ? {...contract, status: "cancelled"} : contract
      ));
      
      toast({
        title: "Contract Declined",
        description: "The contract has been declined.",
      });
    } catch (error) {
      console.error("Error declining contract:", error);
      toast({
        title: "Error",
        description: "Failed to decline the contract. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingContract(null);
    }
  };

  const handleMarkAsDelivered = async (contractId: string) => {
    if (!user) return;
    
    setProcessingContract(contractId);
    try {
      await updateDoc(doc(db, "contracts", contractId), {
        status: "completed",
        updatedAt: new Date().toISOString(),
        deliveredDate: new Date().toISOString()
      });
      
      // Update local state
      setContracts(contracts.map(contract => 
        contract.id === contractId ? {...contract, status: "completed"} : contract
      ));
      
      toast({
        title: "Marked as Delivered",
        description: "The contract has been marked as delivered successfully.",
      });
    } catch (error) {
      console.error("Error marking contract as delivered:", error);
      toast({
        title: "Error",
        description: "Failed to mark the contract as delivered. Please try again.",
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
          <h1 className="text-3xl font-bold">Farmer Dashboard</h1>
          <Link href="/create-listing">
            <Button>Create New Listing</Button>
          </Link>
        </div>

        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold mb-3">No Contracts Yet</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Start by creating crop listings. Once buyers show interest, contract proposals will appear here.
          </p>
          <Link href="/create-listing">
            <Button size="lg">Create Your First Listing</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Farmer Dashboard</h1>
        <Link href="/create-listing">
          <Button>Create New Listing</Button>
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
            <CardTitle className="text-xl">Pending Contracts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {getContractsByStatus("pending").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Completed Contracts</CardTitle>
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
                        Contract with {contract.buyerName}
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
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline">View Details</Button>
                      {status === "pending" && (
                        <div className="space-x-2">
                          <Button 
                            variant="outline" 
                            className="text-red-500" 
                            onClick={() => handleDeclineContract(contract.id)}
                            disabled={processingContract === contract.id}
                          >
                            {processingContract === contract.id ? "Processing..." : "Decline"}
                          </Button>
                          <Button 
                            onClick={() => handleAcceptContract(contract.id)}
                            disabled={processingContract === contract.id}
                          >
                            {processingContract === contract.id ? "Processing..." : "Accept"}
                          </Button>
                        </div>
                      )}
                      {status === "active" && (
                        <Button 
                          onClick={() => handleMarkAsDelivered(contract.id)}
                          disabled={processingContract === contract.id}
                        >
                          {processingContract === contract.id ? "Processing..." : "Mark as Delivered"}
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