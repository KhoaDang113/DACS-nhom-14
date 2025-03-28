import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { ReactNode } from "react";

interface LayoutProps {
  children?: ReactNode;
}

const Layout: React.FC<LayoutProps> = () => {
  return (
    <div className="flex flex-col w-full h-screen items-center justify-start overflow-x-hidden">
      <Navbar />
      <main>
        <Outlet /> {}
      </main>
    </div>
  );
};

export default Layout;
