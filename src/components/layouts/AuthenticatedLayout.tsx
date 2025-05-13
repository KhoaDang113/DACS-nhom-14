import { ReactNode, useEffect } from "react";
import { AccountProvider } from "../../contexts/AccountContext";
import { Outlet } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

interface AuthenticatedLayoutProps {
  children?: ReactNode;
}

const AuthenticatedLayout = ({ children }: AuthenticatedLayoutProps) => {
  const { getToken } = useAuth();

  // Lưu token vào localStorage để sử dụng trong axios interceptor
  useEffect(() => {
    const storeToken = async () => {
      try {
        const token = await getToken();
        if (token) {
          localStorage.setItem("auth_token", token);
        }
      } catch (error) {
        console.error("Error storing authentication token:", error);
      }
    };

    storeToken();
  }, [getToken]);

  return <AccountProvider>{children || <Outlet />}</AccountProvider>;
};

export default AuthenticatedLayout;
