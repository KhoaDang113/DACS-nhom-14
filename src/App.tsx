import { RouterProvider } from "react-router-dom";
import { NotificationProvider } from "./contexts/NotificationContext";
import router from "./routes";
import { FavoritesProvider } from './context/FavoritesContext';

const App: React.FC = () => {
  return (
    <NotificationProvider>
      <FavoritesProvider>
        <RouterProvider router={router} />
      </FavoritesProvider>
    </NotificationProvider>
  );
};

export default App;
