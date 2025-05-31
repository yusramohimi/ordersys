import { Link } from "react-router-dom";
import logoImage from "/src/assets/logo-fr.png";

export default function NavBar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <img
                src={logoImage}
                alt="Illustration connexion"
                className="h-12 w-auto"
              />
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/dashboard"
                className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Tableau de bord
              </Link>
              <Link
                to="/orders"
                className="border-transparent text-gray-500 hover:border-green-300 hover:text-green-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Mes commandes
              </Link>
              <Link
                to="/invoices"
                className="border-transparent text-gray-500 hover:border-green-300 hover:text-green-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Mes factures
              </Link>
              <Link
                to="/profile"
                className="border-transparent text-gray-500 hover:border-green-300 hover:text-green-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Mon profil
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
