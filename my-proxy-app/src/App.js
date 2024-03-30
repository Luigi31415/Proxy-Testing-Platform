import { RouterProvider, createBrowserRouter } from "react-router-dom";
import routes from "./routes";

function App() {
  const router = createBrowserRouter(routes);
  return (
    <RouterProvider router={router} fallbackElement={<p>Initial Load...</p>} />
  );
}

export default App;