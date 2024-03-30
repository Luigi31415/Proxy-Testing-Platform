import { Route, createRoutesFromElements } from "react-router-dom";
import Root from "./Components/root";
import Login from "./Components/Login.js";
import Register from "./Components/Register.js";
import Dashboard from "./Components/Dashboard.js";

const routes = createRoutesFromElements(
  <>
    <Route path="/" element={<Root />}>
      <Route path="login" element={<Login />}></Route>
      <Route path="register" element={<Register />}></Route>
      <Route path="dashboard" element={<Dashboard />}></Route>
    </Route>
  </>
);
export default routes;
