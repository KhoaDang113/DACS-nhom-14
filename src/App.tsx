import { RouterProvider } from "react-router-dom";
import { NotificationProvider } from "./contexts/NotificationContext";
import router from "./routes";
import { FavoritesProvider } from './contexts/FavoritesContext';
import { AccountProvider } from './contexts/AccountContext';

const App: React.FC = () => {
  return (
    <NotificationProvider>
      <FavoritesProvider>
        <AccountProvider>
          <RouterProvider router={router} />
        </AccountProvider>
      </FavoritesProvider>
    </NotificationProvider>
  );
};

export default App;
