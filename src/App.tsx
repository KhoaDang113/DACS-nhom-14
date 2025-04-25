import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { FavoritesProvider } from './context/FavoritesContext';

const App: React.FC = () => {
  return (
    <FavoritesProvider>
      <RouterProvider router={router} />
    </FavoritesProvider>
  );
};

export default App;
