import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    const token = localStorage.getItem("adminToken");

    if (!isAdmin || !token) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="bg-[#0e1013] min-h-screen text-white">
      <Sidebar />
      <main className="ml-64 p-6 bg-[#121417] min-h-screen overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
