import { RouterProvider } from "react-router-dom";
import { NotificationProvider } from "./contexts/NotificationContext";
import router from "./routes";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { AccountProvider } from "./contexts/AccountContext";
import { UnreadMessagesProvider } from "./contexts/UnreadMessagesContext";
const App: React.FC = () => {
  return (
    // <UnreadMessagesProvider>
    <NotificationProvider>
      <FavoritesProvider>
        <AccountProvider>
          <RouterProvider router={router} />
        </AccountProvider>
      </FavoritesProvider>
    </NotificationProvider>
    // </UnreadMessagesProvider>
  );
};

export default App;
