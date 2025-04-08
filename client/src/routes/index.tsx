import { createBrowserRouter, RouteObject } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import SignInPage from "../pages/signIn";
import SignUpPage from "../pages/signUp";
import PaymentPage from "../pages/paymentPage";
import Layout from "../components/layout";
import HomePage from "../pages/homePage";
import DashBoard from "../pages/dashBoard"; // Import the dashboard page
import ProfilePage from "../pages/Profile";

const router: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/sign-in", element: <SignInPage /> },
      { path: "/sign-up", element: <SignUpPage /> },
      { path: "/payment", element: <PaymentPage /> },
      { path: "/dashBoard", element: <DashBoard /> }, // Add the jobs route
      { 
path: "/profile", 
element: (
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
