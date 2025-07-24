import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-4 py-24 text-center bg-gradient-to-b from-green-50 to-white">
        <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-green-900 sm:text-5xl md:text-6xl">
          Assured Contract Farming for Stable Market Access
        </h1>
        <p className="max-w-2xl mt-6 text-lg text-gray-600">
          Connect directly with buyers, secure contracts, and get guaranteed payments for your produce. Reduce market risks and enhance your income stability.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-10">
          <Link href="/sign-up" passHref>
            <Button size="lg" className="px-8 py-6 text-lg">
              Get Started
            </Button>
          </Link>
          <Link href="/marketplace" passHref>
            <Button size="lg" variant="outline" className="px-8 py-6 text-lg">
              Explore Marketplace
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container px-4 mx-auto">
          <h2 className="mb-16 text-3xl font-bold text-center">How FarmConnect Works</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="p-6 text-center bg-white border rounded-lg shadow-sm">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 text-white bg-green-600 rounded-full">
                1
              </div>
              <h3 className="mb-3 text-xl font-medium">Create Your Profile</h3>
              <p className="text-gray-600">
                Sign up as a farmer or buyer and create your detailed profile to showcase your products or requirements.
              </p>
            </div>
            <div className="p-6 text-center bg-white border rounded-lg shadow-sm">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 text-white bg-green-600 rounded-full">
                2
              </div>
              <h3 className="mb-3 text-xl font-medium">Negotiate Contracts</h3>
              <p className="text-gray-600">
                Connect with potential partners, negotiate terms, and establish transparent contracts with fair pricing.
              </p>
            </div>
            <div className="p-6 text-center bg-white border rounded-lg shadow-sm">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 text-white bg-green-600 rounded-full">
                3
              </div>
              <h3 className="mb-3 text-xl font-medium">Secure Payments</h3>
              <p className="text-gray-600">
                Fulfill your contract obligations and receive timely, secure payments through our platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 bg-green-50">
        <div className="container px-4 mx-auto">
          <h2 className="mb-16 text-3xl font-bold text-center">Success Stories</h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <p className="mb-4 italic text-gray-600">
                "Since joining FarmConnect, I've secured contracts for my entire harvest before the growing season even begins. This has removed the stress of market fluctuations and improved my income predictability."
              </p>
              <p className="font-medium">- Rajesh Kumar, Tomato Farmer</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <p className="mb-4 italic text-gray-600">
                "As a food processing company, we need consistent quality and supply. FarmConnect has helped us establish direct relationships with farmers, ensuring we get the best produce while supporting local agriculture."
              </p>
              <p className="font-medium">- Priya Sharma, Food Processing Manager</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-center bg-green-900 text-white">
        <div className="container px-4 mx-auto">
          <h2 className="mb-6 text-3xl font-bold">Ready to Transform Your Farming Business?</h2>
          <p className="max-w-2xl mx-auto mb-10 text-green-100">
            Join thousands of farmers and buyers already benefiting from assured contract farming.
          </p>
          <Link href="/sign-up" passHref>
            <Button size="lg" variant="outline" className="border-white hover:bg-white hover:text-green-900">
              Sign Up Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
