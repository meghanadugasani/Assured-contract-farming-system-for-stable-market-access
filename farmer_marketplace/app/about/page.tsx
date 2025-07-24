import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Users, ArrowRightLeft, Heart, Shield, Star, Phone, Mail } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="relative mb-10 text-center">
        <div className="absolute inset-0 flex items-center justify-center opacity-5">
          <Leaf className="w-64 h-64" />
        </div>
        <h1 className="relative mb-4 text-4xl font-bold tracking-tight">About FarmConnect</h1>
        <p className="relative max-w-2xl mx-auto text-lg text-muted-foreground">
          Building a sustainable future for farmers and buyers through direct relationships and assured contracts
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto space-y-10">
        <Card className="overflow-hidden border-green-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="absolute right-0 top-0 h-16 w-16 rounded-bl-full bg-green-50 flex items-center justify-center p-3">
            <Heart className="h-6 w-6 text-green-600" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-green-800">Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">
              FarmConnect aims to transform agricultural commerce by building a robust platform that connects
              farmers directly with buyers through assured contract farming. We're dedicated to creating
              stable market access for farmers while ensuring quality produce for buyers.
            </p>
          </CardContent>
        </Card>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="overflow-hidden border-amber-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-2 bg-amber-500"></div>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-amber-600" />
                For Farmers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                List your crops, negotiate fair prices, and secure guaranteed contracts before harvest.
                Reduce market uncertainty and focus on what you do best - growing quality produce.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center text-sm">
                  <ArrowRightLeft className="mr-2 h-4 w-4 text-amber-600" />
                  <span>Secure pre-harvest contracts</span>
                </li>
                <li className="flex items-center text-sm">
                  <ArrowRightLeft className="mr-2 h-4 w-4 text-amber-600" />
                  <span>Guaranteed payment terms</span>
                </li>
                <li className="flex items-center text-sm">
                  <ArrowRightLeft className="mr-2 h-4 w-4 text-amber-600" />
                  <span>Direct buyer relationships</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden border-blue-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-2 bg-blue-500"></div>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-blue-600" />
                For Buyers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Discover reliable farmers, establish direct relationships, and secure consistent supply
                of quality agricultural products. Streamline your procurement process and support
                sustainable farming practices.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center text-sm">
                  <ArrowRightLeft className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Quality assured produce</span>
                </li>
                <li className="flex items-center text-sm">
                  <ArrowRightLeft className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Transparent pricing</span>
                </li>
                <li className="flex items-center text-sm">
                  <ArrowRightLeft className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Traceable supply chain</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <Card className="overflow-hidden border-indigo-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="p-6 bg-gradient-to-r from-indigo-50 to-indigo-100">
            <h2 className="flex items-center text-2xl font-bold text-indigo-800 mb-4">
              <Shield className="mr-3 h-6 w-6 text-indigo-600" />
              Benefits of Contract Farming
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Star className="mr-2 h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <span>Guaranteed market access for farmers</span>
                </li>
                <li className="flex items-start">
                  <Star className="mr-2 h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <span>Price stability and income security</span>
                </li>
                <li className="flex items-start">
                  <Star className="mr-2 h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <span>Reduced market risks and uncertainties</span>
                </li>
                <li className="flex items-start">
                  <Star className="mr-2 h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <span>Direct farmer-buyer relationships</span>
                </li>
              </ul>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Star className="mr-2 h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <span>Transparent and secure transactions</span>
                </li>
                <li className="flex items-start">
                  <Star className="mr-2 h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <span>Quality assurance for buyers</span>
                </li>
                <li className="flex items-start">
                  <Star className="mr-2 h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <span>Consistent supply chain management</span>
                </li>
                <li className="flex items-start">
                  <Star className="mr-2 h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <span>Support for sustainable agricultural practices</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>
        
        <Card className="overflow-hidden border-emerald-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-emerald-800">Contact Us</CardTitle>
            <CardDescription>Have questions or feedback? We'd love to hear from you!</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:gap-8">
              <div className="flex items-center mb-4 sm:mb-0">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mr-3">
                  <Mail className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">contact@farmconnect.com</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mr-3">
                  <Phone className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">+91 1234567890</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 