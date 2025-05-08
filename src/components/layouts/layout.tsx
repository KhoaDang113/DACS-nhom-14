import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../../components/Footer";
import { ReactNode } from "react";
import CategoryNav from "../CategoryNav";
import MobileNavbar from "../MobileNavbar";
import useRestrictedAccess from "../../hooks/useRestrictedAccess";

interface LayoutProps {
  children?: ReactNode;
}

const Layout: React.FC<LayoutProps> = () => {
  const { isLocked, isLoading } = useRestrictedAccess();

  return (
    <div className="flex flex-col w-full h-full items-center justify-start">
      <Navbar />
      <CategoryNav />
      <main className="pb-16 md:pb-0 w-full items-center justify-center">
        <Outlet />
      </main>
      <MobileNavbar />
      <Footer />
    </div>
  );
};

export default Layout;
