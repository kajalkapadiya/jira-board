import { useEffect } from "react";
import { Outlet } from "react-router-dom";

const PrivateRoute = () => {
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      window.location.href = "/";
    }
  }, []);

  return <Outlet />;
};

export default PrivateRoute;
