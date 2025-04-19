import { createBrowserRouter, RouteObject } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import SignInPage from "../pages/signIn";
import SignUpPage from "../pages/signUp";
import PaymentPage from "../pages/paymentPage";
import Layout from "../components/layout";
import HomePage from "../pages/homePage";
import Dashboard from "../pages/dashboard";
import ProfilePage from "../pages/profile";
import CreateGigForm from "../pages/createGig";
import SellerGigsPage from "../pages/sellerGigs";
import OrderManagement from "../pages/orderManagement";
import SellerDashboard from "../pages/sellerDashboard"; 
import EditGig from "../pages/editGig";// Import the SellerDashboard component

const router: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/sign-in", element: <SignInPage /> },
      { path: "/sign-up", element: <SignUpPage /> },
      { path: "/payment", element: <PaymentPage /> },
      { path: "/dash-board", element: <Dashboard /> },
      { path: "/create-gig", element: <CreateGigForm /> },
      { path: "/seller-gigs", element: <SellerGigsPage />},
      { path: "/order-management", element: <OrderManagement />},
      { path: "/seller-dashboard", element: <SellerDashboard/>},
      { path: "/edit-gigs", element: <EditGig/>}, // Add the jobs route
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
    ],
  },
];
const routerBrowser = createBrowserRouter(router);

export default routerBrowser;
