//user
import { createBrowserRouter, RouteObject, Outlet } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import SignInPage from "../pages/signIn";
import SignUpPage from "../pages/signUp";
import PaymentPage from "../pages/paymentPage";
import Layout from "../components/layouts/layout";
import HomePage from "../pages/homePage";
import Dashboard from "../pages/dashBoard";
import ProfilePage from "../pages/profile";
import GigDetailPage from "../pages/gigDetail";
import CustomOrderPage from "../pages/customOrderPage";
import BuyerOrdersPage from "../pages/buyerOrders";
import AdvancedSearchPage from "../pages/advancedSearchPage";
import CreateGigForm from "../pages/createGig";
import SellerGigsPage from "../pages/sellerGigs";
import OrderManagement from "../pages/orderManagement";
import SellerDashboard from "../pages/sellerDashboard";
import EditGig from "../pages/editGig";
import BookmarkPage from "../pages/bookmarkPage";
import RedirectDashboard from "../pages/RedirectDashboard";
import ReviewGigPage from "../pages/reviewGig";
import BecomeFreelancer from "../pages/becomeFreelancer";
import RequireAdmin from "../middleware/RequireAdmin";
import Inbox from "../pages/inbox"; // Assuming this is the correct import for the inbox page
import ProtectedRoute from "../middleware/ProtectedRoute";
import LockedAccountRoute from "../middleware/LockedAccountRoute"; // Import LockedAccountRoute
import AuthenticatedLayout from "../components/layouts/AuthenticatedLayout";
import PaymentSuccess from "../pages/paymentSuccessPage";
import PaymentFailed from "../pages/paymentFail";
//admin
import AdminLayout from "../components/layouts/AdminLayout";
import AdminDashboard from "../pages/admin/Dashboard";
import AdminAccounts from "../pages/admin/AdminAccounts";
import AdminCategoryManagement from "../pages/admin/CategoryManagement";
import AdminGigApproval from "../pages/admin/GigApproval";
import AdminSellerManagement from "../pages/admin/SellerManagement";
import AdminTagManagement from "../pages/admin/TagManagement";
import AdminTransactionHistory from "../pages/admin/TransactionHistory";
import AdminUserFeedback from "../pages/admin/UserFeedback";
import AdminUserPermission from "../pages/admin/UserPermissions";
import AdminViolationReport from "../pages/admin/ViolationReports";
// Quảng cáo Job Hot
import AdminHotJobAds from "../pages/admin/HotJobAds";
import AdminCreateHotJobAd from "../pages/admin/CreateHotJobAd";
import ChatBoxLayout from "../components/layouts/ChatBoxLayout";

// Routes không cần đăng nhập
const publicRoutes: RouteObject[] = [
  { path: "/", element: <HomePage /> },
  { path: "/sign-in", element: <SignInPage /> },
  { path: "/sign-up", element: <SignUpPage /> },
  { path: "/payment", element: <PaymentPage /> },
  { path: "/gig/:id", element: <GigDetailPage /> },
  { path: "/advanced-search", element: <AdvancedSearchPage /> },
];

// Routes cần đăng nhập và được bảo vệ
const protectedRoutes: RouteObject[] = [
  {
    path: "/redirect-dashboard",
    element: (
      <SignedIn>
        <ProtectedRoute>
          <RedirectDashboard />
        </ProtectedRoute>
      </SignedIn>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <SignedIn>
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </SignedIn>
    ),
  },
  {
    path: "/profile",
    element: (
      <SignedIn>
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      </SignedIn>
    ),
  },
  {
    path: "/profile/:userId",
    element: (
      <SignedIn>
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      </SignedIn>
    ),
  },
  {
    path: "/create-gig",
    element: (
      <SignedIn>
        <ProtectedRoute>
          <LockedAccountRoute>
            <CreateGigForm />
          </LockedAccountRoute>
        </ProtectedRoute>
      </SignedIn>
    ),
  },
  {
    path: "/seller-gigs",
    element: (
      <SignedIn>
        <ProtectedRoute>
          <LockedAccountRoute>
            <SellerGigsPage />
          </LockedAccountRoute>
        </ProtectedRoute>
      </SignedIn>
    ),
  },
  {
    path: "/order-management",
    element: (
      <SignedIn>
        <ProtectedRoute>
          <LockedAccountRoute>
            <OrderManagement />
          </LockedAccountRoute>
        </ProtectedRoute>
      </SignedIn>
    ),
  },
  {
    path: "/seller-dashboard",
    element: (
      <SignedIn>
        <ProtectedRoute>
          <LockedAccountRoute>
            <SellerDashboard />
          </LockedAccountRoute>
        </ProtectedRoute>
      </SignedIn>
    ),
  },
  {
    path: "/edit-gig/:id",
    element: (
      <SignedIn>
        <ProtectedRoute>
          <LockedAccountRoute>
            <EditGig />
          </LockedAccountRoute>
        </ProtectedRoute>
      </SignedIn>
    ),
  },
  {
    path: "/custom-order/:id",
    element: (
      <SignedIn>
        <ProtectedRoute>
          <LockedAccountRoute>
            <CustomOrderPage />
          </LockedAccountRoute>
        </ProtectedRoute>
      </SignedIn>
    ),
  },
  {
    path: "/orders",
    element: (
      <SignedIn>
        <ProtectedRoute>
          <LockedAccountRoute>
            <BuyerOrdersPage />
          </LockedAccountRoute>
        </ProtectedRoute>
      </SignedIn>
    ),
  },
  {
    path: "/bookmarks",
    element: (
      <SignedIn>
        <ProtectedRoute>
          <BookmarkPage />
        </ProtectedRoute>
      </SignedIn>
    ),
  },
  {
    path: "/become-freelancer",
    element: (
      <SignedIn>
        <ProtectedRoute>
          <LockedAccountRoute>
            <BecomeFreelancer />
          </LockedAccountRoute>
        </ProtectedRoute>
      </SignedIn>
    ),
  },
  {
    path: "/review-gig/:orderId",
    element: (
      <SignedIn>
        <ProtectedRoute>
          <LockedAccountRoute>
            <ReviewGigPage />
          </LockedAccountRoute>
        </ProtectedRoute>
      </SignedIn>
    ),
  },
  {
    path: "/payment/success",
    element: (
      <SignedIn>
        <ProtectedRoute>
          <LockedAccountRoute>
            <PaymentSuccess />
          </LockedAccountRoute>
        </ProtectedRoute>
      </SignedIn>
    ),
  },
  {
    path: "/payment/failed",
    element: (
      <SignedIn>
        <ProtectedRoute>
          <LockedAccountRoute>
            <PaymentFailed />
          </LockedAccountRoute>
        </ProtectedRoute>
      </SignedIn>
    ),
  },
];

const router: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      // Public routes
      ...publicRoutes,

      // Protected routes
      {
        element: (
          <SignedIn>
            <AuthenticatedLayout>
              <Outlet />
            </AuthenticatedLayout>
          </SignedIn>
        ),
        children: protectedRoutes.map((route) => ({
          path: route.path?.toString().replace(/^\//, ""),
          element: route.element,
        })),
      },

      // Fallback for routes that need sign in
      {
        path: "*",
        element: (
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
        ),
      },
    ],
  },

  //admin path
  {
    path: "/admin",
    element: (
      <SignedIn>
        <AuthenticatedLayout>
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        </AuthenticatedLayout>
      </SignedIn>
    ),
    children: [
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "accounts", element: <AdminAccounts /> },
      { path: "category-management", element: <AdminCategoryManagement /> },
      { path: "gig-approval", element: <AdminGigApproval /> },
      { path: "seller-management", element: <AdminSellerManagement /> },
      { path: "tag-management", element: <AdminTagManagement /> },
      { path: "transaction-history", element: <AdminTransactionHistory /> },
      { path: "user-feedback", element: <AdminUserFeedback /> },
      { path: "user-permission", element: <AdminUserPermission /> },
      { path: "violation-report", element: <AdminViolationReport /> },
      // Quảng cáo Job Hot
      { path: "hot-job-ads", element: <AdminHotJobAds /> },
      { path: "hot-job-ads/create", element: <AdminCreateHotJobAd /> },
    ],
  },
  {
    path: "/inbox",
    element: <ChatBoxLayout />,
    children: [
      {
        path: "/inbox/:id",
        element: (
          <>
            <SignedIn>
              <Inbox />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        ),
      },
    ],
  },
];

const routerBrowser = createBrowserRouter(router);

export default routerBrowser;
