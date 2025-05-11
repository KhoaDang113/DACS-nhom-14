import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";
import MobileNavbar from "../MobileNavbar";

const ChatBoxLayout: React.FC = () => {
  return (
    <div className="flex flex-col w-full h-screen justify-start items-start">
      {/* Navbar for larger screens */}
      <Navbar />

      {/* Main content */}
      <main className="flex-1 md:w-[92%] w-full mx-auto px-4 pb-0 sm:px-6 lg:px-8 py-4">
        <Outlet />
      </main>

      {/* Mobile Navbar for smaller screens */}
      <MobileNavbar />
    </div>
  );
};

export default ChatBoxLayout;
