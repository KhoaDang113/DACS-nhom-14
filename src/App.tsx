import { RouterProvider } from "react-router-dom";
import { NotificationProvider } from "./contexts/NotificationContext";
import router from "./routes";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { AccountProvider } from "./contexts/AccountContext";
import { UnreadMessagesProvider } from "./contexts/UnreadMessagesContext";
import { UserProvider } from "./contexts/UserContext";

const App: React.FC = () => {
  return (
    <UserProvider>
      <NotificationProvider>
        <FavoritesProvider>
          <AccountProvider>
            <RouterProvider router={router} />
          </AccountProvider>
        </FavoritesProvider>
      </NotificationProvider>
    </UserProvider>
  );
};

export default App;
