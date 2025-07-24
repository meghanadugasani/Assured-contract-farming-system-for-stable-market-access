# FarmConnect - Assured Contract Farming Platform

A comprehensive platform that facilitates assured contract farming agreements between farmers and buyers. This platform enables transparent communication, secure contracts, and timely payments, ensuring farmers have a reliable market for their crops.

## Deployment

### Deploying to Vercel

To deploy the application to Vercel, follow these steps:

1. Push your code to a GitHub repository
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click on "Add New..." and select "Project"
4. Import your GitHub repository
5. Configure as follows:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: npm run build
   - Output Directory: .next
   - Environment Variables: Add any Firebase API keys and other secrets

6. Click "Deploy"

## Environment Setup

To set up the development environment:

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

## Project Structure

- `/app` - Next.js App Router pages and components
- `/components` - Reusable UI components
- `/lib` - Utility functions and Firebase configuration
- `/public` - Static assets

## Features

- **User Authentication**: Separate accounts for farmers and buyers
- **Farmer Dashboard**: Manage crop listings and track contracts
- **Buyer Dashboard**: Browse marketplace and manage contracts with farmers
- **Marketplace**: Search and filter available crops from farmers
- **Contract Management**: Create, accept, and track contracts between farmers and buyers
- **Secure Payments**: Track payments and deliveries

## Technology Stack

- **Frontend**: Next.js with App Router, React, TypeScript, Tailwind CSS
- **UI Components**: Shadcn/UI
- **Authentication & Database**: Firebase Authentication and Firestore
- **Form Validation**: React Hook Form and Zod

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Firebase project

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/farmer-marketplace.git
   cd farmer-marketplace
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)

4. Create a `.env.local` file in the root directory with your Firebase config:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

5. Run the development server:
   ```
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Firestore Database Structure

The application uses the following Firestore collections:

- **users**: User profiles for farmers and buyers
- **listings**: Crop listings created by farmers
- **contracts**: Contract agreements between farmers and buyers

## Usage

1. **Sign Up**: Create an account as either a farmer or a buyer
2. **For Farmers**:
   - Create listings for your crops with details like quantity, price, and harvest date
   - Manage contract requests from buyers
   - Track active contracts and their status
3. **For Buyers**:
   - Browse the marketplace for available crops
   - Filter and search for specific crops or farmers
   - Create contract proposals with farmers
   - Track active contracts and make payments

## License

This project is licensed under the MIT License.
