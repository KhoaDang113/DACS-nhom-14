import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "../components/Footer";
import { ReactNode } from "react";
import CategoryNav from "./CategoryNav";
interface LayoutProps {
  children?: ReactNode;
}

const Layout: React.FC<LayoutProps> = () => {
  return (
    <div className="flex flex-col w-full h-full items-center justify-start">
      <Navbar />
      <div className="sticky top-[81px] z-50 w-full items-center ">
        <CategoryNav />
      </div>
      <main>
        <Outlet /> {}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
