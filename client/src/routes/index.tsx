import { createBrowserRouter, RouteObject } from "react-router-dom";
import SignInPage from "../pages/signIn";
import SignUpPage from "../pages/signUp";
import PaymentPage from "../pages/paymentPage";
import Layout from "../components/layout";
import HomePage from "../pages/homePage";
const router: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/sign-in", element: <SignInPage /> },
      { path: "/sign-up", element: <SignUpPage /> },
      { path: "/payment", element: <PaymentPage /> },
    ],
  },
];
const routerBrowser = createBrowserRouter(router);

export default routerBrowser;
