import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import Header from "./Header";

export default function Root() {
  if (window.location.href.endsWith("/")) {
    return <Navigate to="/login" />;
  }
  return (
    <>
      <Header></Header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
