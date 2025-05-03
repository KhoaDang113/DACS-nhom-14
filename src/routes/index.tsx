//user
import { createBrowserRouter, RouteObject } from "react-router-dom";
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
import OrderComplaintPage from "../pages/orderComplaint";
import BecomeFreelancer from "../pages/becomeFreelancer";
import RequireAdmin from "../middleware/RequireAdmin";
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

const router: RouteObject[] = [
  {path: "/", element: <Layout />,
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
      { path: "/edit-gigs", element: <EditGig/>}, 
      { 
        path: "/review-gig/:orderId", 
        element: (
          <>
            <SignedIn>
              <ReviewGigPage />
              </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </> ),
      },
      { path: "/dashboard", element: (
          <>
            <SignedIn>
              <Dashboard />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        ), 
      },
      { path: "/create-gig", element: (
          <>
            <SignedIn>
              <CreateGigForm />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        ), 
      },
      { path: "/seller-gigs", element: (
          <>
            <SignedIn>
              <SellerGigsPage />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        ), 
      },
      { path: "/order-management", element: (
          <>
            <SignedIn>
              <OrderManagement />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        ), 
      },
      { path: "/seller-dashboard", element: (
          <>
            <SignedIn>
              <SellerDashboard />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        ), 
      },
      { path: "/edit-gig/:id", element: (
          <>
            <SignedIn>
              <EditGig />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
            </>
        ), 
      },
      { path: "/profile", element: (
          <>
            <SignedIn>
              <ProfilePage />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        ),
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
        ),
      },
      { path: "/orders", element: (
          <>
            <SignedIn>
              <BuyerOrdersPage />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        ),
      },
      { path: "/advanced-search", element: <AdvancedSearchPage /> },
      { path: "/bookmarks", element: (
          <>
            <SignedIn>
              <BookmarkPage />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        ) 
      },
      { path: "/redirect-dashboard", element: <RedirectDashboard /> },
      { path: "/orders-complaint", element: <OrderComplaintPage /> },
      { 
        path: "/become-freelancer", 
        element: (
          <>
            <SignedIn>
              <BecomeFreelancer />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        ),
      },
    ],
  },

  //admin path
  { path: "/admin", element: (
      <RequireAdmin>
        <AdminLayout />
      </RequireAdmin>
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
];

const routerBrowser = createBrowserRouter(router);

export default routerBrowser;
