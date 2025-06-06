import {
  FaShoppingCart,
  FaPlusCircle,
  FaUsers,
  FaBoxOpen,
  FaWarehouse,
  FaTruck,
  FaHockeyPuck,
  FaSignOutAlt,
  FaClipboardList,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import logoImage from "/src/assets/logo.png";

function SideBar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:8000/api/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      localStorage.removeItem("token");
      navigate("/login"); // redirection après logout
    } catch (error) {
      console.error("Erreur lors du logout", error);
    }
  };
  return (
    <div className="w-64 h-screen bg-gradient-to-b from-green-700 to-green-800 text-white p-4 flex flex-col fixed shadow-xl">
      {/* Logo/Site Name */}
      <div className="p-4 border-b border-green-600 shrink-0">
        <img
          src={logoImage}
          alt="Logo"
          className="w-full max-w-[160px] mx-auto"
        />
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-2">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200
            ${
              isActive
                ? "bg-green-600 shadow-md"
                : "hover:bg-green-700 hover:pl-5"
            }`
          }
        >
          <FaHockeyPuck className="text-lg" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            `flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200
            ${
              isActive
                ? "bg-green-600 shadow-md"
                : "hover:bg-green-700 hover:pl-5"
            }`
          }
        >
          <FaShoppingCart className="text-lg" />
          <span>Orders List</span>
        </NavLink>

        <NavLink
          to="/admin/livreurs"
          className={({ isActive }) =>
            `flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200
            ${
              isActive
                ? "bg-green-600 shadow-md"
                : "hover:bg-green-700 hover:pl-5"
            }`
          }
        >
          <FaPlusCircle className="text-lg" />
          <span>Add User</span>
        </NavLink>

        <NavLink
          to="/admin/clientslist"
          className={({ isActive }) =>
            `flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200
            ${
              isActive
                ? "bg-green-600 shadow-md"
                : "hover:bg-green-700 hover:pl-5"
            }`
          }
        >
          <FaUsers className="text-lg" />
          <span>Clients List</span>
        </NavLink>
        <NavLink
          to="/admin/livreurslist"
          className={({ isActive }) =>
            `flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200
            ${
              isActive
                ? "bg-green-600 shadow-md"
                : "hover:bg-green-700 hover:pl-5"
            }`
          }
        >
          <FaTruck className="text-lg" />
          <span>Delivery Men List</span>
        </NavLink>

        <NavLink
          to="/admin/stock"
          className={({ isActive }) =>
            `flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200
            ${
              isActive
                ? "bg-green-600 shadow-md"
                : "hover:bg-green-700 hover:pl-5"
            }`
          }
        >
          <FaWarehouse className="text-lg" />
          <span>Stock Movement</span>
        </NavLink>

        <NavLink
          to="/admin/logs"
          className={({ isActive }) =>
            `flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200
            ${
              isActive
                ? "bg-green-600 shadow-md"
                : "hover:bg-green-700 hover:pl-5"
            }`
          }
        >
          <FaClipboardList className="text-lg" />
          <span>Admin Logs</span>
        </NavLink>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200 hover:bg-red-600 mt-6 text-left w-full"
        >
          <FaSignOutAlt className="text-lg" />
          <span>Logout</span>
        </button>
      </nav>

      {/* Footer/User Info */}
      <div className="mt-auto pt-4 border-t border-green-600 text-sm text-green-200">
        <p>© {new Date().getFullYear()} Gestion Stock</p>
      </div>
    </div>
  );
}

export default SideBar;
