import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "../components/Footer";
import { ReactNode } from "react";

interface LayoutProps {
  children?: ReactNode;
}

const Layout: React.FC<LayoutProps> = () => {
  return (
    <div className="flex flex-col w-full h-full items-center justify-start ">
      <Navbar />
      <main>
        <Outlet /> {}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
