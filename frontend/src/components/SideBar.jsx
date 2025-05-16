import { FaShoppingCart, FaPlusCircle, FaUsers, FaBoxOpen, FaWarehouse, FaTruck, FaHockeyPuck } from "react-icons/fa";
import { NavLink } from "react-router-dom";

function SideBar() {
  return (
    <div className="w-64 h-screen bg-gradient-to-b from-green-700 to-green-800 text-white p-4 flex flex-col fixed shadow-xl">
      {/* Logo/Site Name */}
      <div className="mb-8 p-4 text-center border-b border-green-600">
        <h2 className="text-xl font-bold">Gestion Stock</h2>
      </div>
      
      {/* Navigation Links */}
      <nav className="flex-1 space-y-2">
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => 
            `flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200
            ${isActive ? 'bg-green-600 shadow-md' : 'hover:bg-green-700 hover:pl-5'}`
          }
        >
          <FaHockeyPuck className="text-lg" /> 
          <span>Dashboard</span>
        </NavLink>

        <NavLink 
          to="/achat" 
          className={({ isActive }) => 
            `flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200
            ${isActive ? 'bg-green-600 shadow-md' : 'hover:bg-green-700 hover:pl-5'}`
          }
        >
          <FaShoppingCart className="text-lg" /> 
          <span>Liste des Achats</span>
        </NavLink>

        <NavLink 
          to="/achatform" 
          className={({ isActive }) => 
            `flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200
            ${isActive ? 'bg-green-600 shadow-md' : 'hover:bg-green-700 hover:pl-5'}`
          }
        >
          <FaPlusCircle className="text-lg" /> 
          <span>Ajouter un Achat</span>
        </NavLink>

        <NavLink 
          to="/client" 
          className={({ isActive }) => 
            `flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200
            ${isActive ? 'bg-green-600 shadow-md' : 'hover:bg-green-700 hover:pl-5'}`
          }
        >
          <FaUsers className="text-lg" /> 
          <span>Clients</span>
        </NavLink>

        <NavLink 
          to="/article" 
          className={({ isActive }) => 
            `flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200
            ${isActive ? 'bg-green-600 shadow-md' : 'hover:bg-green-700 hover:pl-5'}`
          }
        >
          <FaBoxOpen className="text-lg" /> 
          <span>Articles</span>
        </NavLink>

        <NavLink 
          to="/stock" 
          className={({ isActive }) => 
            `flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200
            ${isActive ? 'bg-green-600 shadow-md' : 'hover:bg-green-700 hover:pl-5'}`
          }
        >
          <FaWarehouse className="text-lg" /> 
          <span>Stock</span>
        </NavLink>

        <NavLink 
          to="/fournisseur" 
          className={({ isActive }) => 
            `flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200
            ${isActive ? 'bg-green-600 shadow-md' : 'hover:bg-green-700 hover:pl-5'}`
          }
        >
          <FaTruck className="text-lg" /> 
          <span>Fournisseurs</span>
        </NavLink>
      </nav>

      {/* Footer/User Info */}
      <div className="mt-auto pt-4 border-t border-green-600 text-sm text-green-200">
        <p>© {new Date().getFullYear()} Gestion Stock</p>
      </div>
    </div>
  );
}

export default SideBar;