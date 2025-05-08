import { ReactNode } from 'react';
import { AccountProvider } from '../../contexts/AccountContext';
import { Outlet } from 'react-router-dom';

interface AuthenticatedLayoutProps {
  children?: ReactNode;
}

const AuthenticatedLayout = ({ children }: AuthenticatedLayoutProps) => {
  return (
    <AccountProvider>
      {children || <Outlet />}
    </AccountProvider>
  );
};

export default AuthenticatedLayout;