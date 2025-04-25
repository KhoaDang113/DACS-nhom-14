import { createBrowserRouter, RouteObject } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import SignInPage from "../pages/signIn";
import SignUpPage from "../pages/signUp";
import PaymentPage from "../pages/paymentPage";
import Layout from "../components/layout";
import HomePage from "../pages/homePage";
import Dashboard from "../pages/dashboard";
import ProfilePage from "../pages/profile";
import GigDetailPage from "../pages/gigDetail";
import CustomOrderPage from "../pages/customOrderPage";
import BuyerOrdersPage from "../pages/buyerOrders";
import AdvancedSearchPage from '../pages/advancedSearchPage';
import CreateGigForm from "../pages/createGig";
import SellerGigsPage from "../pages/sellerGigs";
import OrderManagement from "../pages/orderManagement";
import SellerDashboard from "../pages/sellerDashboard"; 
import EditGigsPage from "../pages/editGig";// Import the SellerDashboard component

const router: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/sign-in", element: <SignInPage /> },
      { path: "/sign-up", element: <SignUpPage /> },
      { path: "/payment", element: <PaymentPage /> },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/create-gig", element: <CreateGigForm /> },
      { path: "/seller-gigs", element: <SellerGigsPage />},
      { path: "/order-management", element: <OrderManagement />},
      { path: "/seller-dashboard", element: <SellerDashboard/>}, 
      { path: "/edit-gig/:id", element: <EditGigsPage/>}, // Add the jobs route
      { path: "/profile", element: (
          <>
            <SignedIn>
              <ProfilePage />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        ) 
      },
      { path: "/gig/:id", element: <GigDetailPage /> },
      { path: "/custom-order/:id", element: (
          <>
            <SignedIn>
              <CustomOrderPage />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        ) 
      },
      { 
        path: "/orders", 
        element: (
          <>
            <SignedIn>
              <BuyerOrdersPage />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        ) 
      },
      { path: "/advanced-search", element: <AdvancedSearchPage /> },
    ],
  },
];

const routerBrowser = createBrowserRouter(router);

export default routerBrowser;
