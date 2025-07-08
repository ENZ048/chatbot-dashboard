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
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="flex bg-[#0e1013] min-h-screen text-white">
      <Sidebar />
      <main className="flex-1 p-6 bg-[#121417] rounded-xl mx-4 my-6 shadow-lg border border-gray-800">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
