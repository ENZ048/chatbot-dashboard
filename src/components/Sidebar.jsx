import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Building2, Bot, UserPlus, LogOut } from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("isAdmin");
    navigate("/");
  };

  const navItemClass = ({ isActive }) =>
    `flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
      isActive
        ? "bg-gray-800 text-white"
        : "text-gray-400 hover:bg-gray-800 hover:text-white"
    }`;

  return (
    <aside className="h-screen w-64 bg-[#1a1c1f] border-r border-gray-700 p-4 hidden md:flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 text-center tracking-wide">
          Troika Tech
        </h2>
        <nav className="space-y-2">
          <NavLink to="/dashboard/overview" className={navItemClass}>
            <LayoutDashboard className="mr-2 h-5 w-5" /> Overview
          </NavLink>

          <NavLink to="/dashboard/companies" className={navItemClass}>
            <Building2 className="mr-2 h-5 w-5" /> Manage Companies
          </NavLink>

          <NavLink to="/dashboard/chatbots" className={navItemClass}>
            <Bot className="mr-2 h-5 w-5" /> Manage Chatbots
          </NavLink>

          <NavLink to="/dashboard/add-admin" className={navItemClass}>
            <UserPlus className="mr-2 h-5 w-5" /> Add Admin
          </NavLink>
        </nav>
      </div>

      <button
        onClick={logout}
        className="flex cursor-pointer items-center px-4 py-2 rounded-lg text-sm font-medium text-red-400 hover:text-white hover:bg-red-600 transition-all"
      >
        <LogOut className="mr-2 h-5 w-5" />
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
