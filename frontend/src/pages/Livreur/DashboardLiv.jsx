import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { Search, Globe, Bell, ChevronDown, Edit, Trash2 } from "lucide-react";
import Apaexlinecolumn from "../../components/charts/Apexlinecolumn";
import RadialChart from "../../components/charts/RadialChart";
import SideBarLiv from "./SideBarLiv";
import NotificationDropdown from "../NotificationDropdown";
import LivreurCharts from "./LivreurCharts";
const DashboardLiv = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const metrics = useMemo(() => {
    if (orders.length === 0) {
      return {
        total_revenue: { value: 0, change: 0 },
        total_orders: { value: 0, change: 0 },
        unique_clients: { value: 0, change: 0 },
        delivery_success_rate: { value: 0, change: 0 },
      };
    }
    const safeNumber = (value) => {
      const num = parseFloat(value);
      return isNaN(num) ? 0 : num;
    };
    const totalRevenue = orders.reduce(
      (sum, order) => sum + safeNumber(order.prix_total),
      0
    );

    const totalOrders = orders.length;

    const uniqueClients = [...new Set(orders.map((order) => order.client_name))]
      .length;

    const successfulDeliveries = orders.filter(
      (order) =>
        order.statut.toLowerCase() === "livrée" ||
        order.statut.toLowerCase() === "livree"
    ).length;
    const deliverySuccessRate = (successfulDeliveries / totalOrders) * 100;

    const simulateChange = (baseValue) => Math.random() * 10 - 2; // Entre -2% et +8%

    return {
      total_revenue: {
        value: totalRevenue,
        change: simulateChange(totalRevenue),
      },
      total_orders: {
        value: totalOrders,
        change: simulateChange(totalOrders),
      },
      unique_clients: {
        value: uniqueClients,
        change: simulateChange(uniqueClients),
      },
      delivery_success_rate: {
        value: deliverySuccessRate,
        change: simulateChange(deliverySuccessRate),
      },
    };
  }, [orders]);

  // Formatage des valeurs (identique à avant)
  const formatValue = (value, type) => {
    switch (type) {
      case "currency":
        return new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: "MAD",
          minimumFractionDigits: 0,
        }).format(value);
      case "percent":
        return `${value.toFixed(1)}%`;
      default:
        return new Intl.NumberFormat("fr-FR").format(value);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:8000/api/livreur/orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true, // utile si tu utilises Laravel Sanctum
          }
        );

        const sortedOrders = res.data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setOrders(sortedOrders);
      } catch (err) {
        console.error("Erreur lors de la récupération des commandes :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

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
  const [selectedOrder, setSelectedOrder] = useState(null);

  const closeModal = () => setSelectedOrder(null);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };
  const getStatusStyle = (statut) => {
    switch (statut.toLowerCase()) {
      case "en_attente":
        return "bg-yellow-100 text-yellow-800";
      case "confirmee":
        return "bg-blue-100 text-blue-800";
      case "en_cours":
        return "bg-purple-100 text-purple-800";
      case "en_livraison":
        return "bg-indigo-100 text-indigo-800";
      case "livree":
      case "livrée":
        return "bg-green-100 text-green-800";
      case "retour":
        return "bg-orange-100 text-orange-800";
      case "annulee":
      case "annulée":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <SideBarLiv />

      {/* Main Content */}
      <div className="flex-1 ml-64 overflow-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
            </div>
            <button className="p-2 text-gray-500 hover:text-gray-700">
              <Globe className="h-5 w-5" />
            </button>
            <div className="relative">
              <NotificationDropdown />
            </div>
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-medium">
                  L
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Livreur
                </span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-md z-50">
                  <Link
                    to="/livreur/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/lock"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Lock Screen
                  </Link>
                  <div className="border-t border-gray-200 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Metrics - Version dynamique basée sur les commandes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {[
            {
              key: "total_revenue",
              title: "Total Revenu",
              type: "currency",
              color: "bg-green-100",
              textColor: "text-green-600",
            },
            {
              key: "total_orders",
              title: "Orders",
              type: "number",
              color: "bg-blue-100",
              textColor: "text-blue-600",
            },
            {
              key: "unique_clients",
              title: "Clients",
              type: "number",
              color: "bg-purple-100",
              textColor: "text-purple-600",
            },
            {
              key: "delivery_success_rate",
              title: "Delivered Orders",
              type: "percent",
              color: "bg-red-100",
              textColor: "text-red-600",
            },
          ].map((metric, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{metric.title}</p>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {loading ? (
                      <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
                    ) : (
                      formatValue(metrics[metric.key]?.value || 0, metric.type)
                    )}
                  </h3>
                  <div className="flex items-center mt-2">
                    {loading ? (
                      <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                    ) : (
                      <>
                        <span
                          className={`text-xs ${
                            metrics[metric.key]?.change >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          } flex items-center`}
                        >
                          {metrics[metric.key]?.change >= 0 ? "↑" : "↓"}{" "}
                          {Math.abs(metrics[metric.key]?.change).toFixed(1)}%
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          vs mois dernier
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div
                  className={`h-12 w-12 rounded-full ${
                    metrics[metric.key]?.change >= 0
                      ? "bg-green-100"
                      : "bg-red-100"
                  } flex items-center justify-center`}
                >
                  <span
                    className={`text-lg font-semibold ${
                      metrics[metric.key]?.change >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {metrics[metric.key]?.change >= 0 ? "↑" : "↓"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!loading && <LivreurCharts orders={orders} />}
        {/* Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-5 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">
              Recent Orders
            </h2>
            <Link
              to="/livreur/orders"
              className="text-sm text-green-600 hover:text-green-700 font-medium"
            >
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {["Order ID", "Client", "Date", "prix_total", "Status"].map(
                    (header, i) => (
                      <th
                        key={i}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : (
                  orders.slice(0, 5).map((order, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {order.id}
                      </td>
                      <td
                        className="px-6 py-4 text-gray-500 cursor-pointer underline"
                        onClick={() => setSelectedOrder(order)}
                      >
                        {order.client_name}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {order.prix_total} DH
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                            order.statut
                          )}`}
                        >
                          {order.statut}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLiv;
