import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Search, Globe, Bell, ChevronDown } from "lucide-react";
import Apaexlinecolumn from "../../components/charts/Apexlinecolumn";
import RadialChart from "../../components/charts/RadialChart";
import SideBar from "./SideBar";
import NotificationDropdown from "../NotificationDropdown";
import admin1 from "../../assets/admins/1.jpg";
import admin2 from "../../assets/admins/2.jpg";
import defaultImg from "../../assets/admins/default.png";

const Dashboard = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [clients, setClients] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deliveryMen, setDeliveryMen] = useState([]);
  const [admin, setAdmin] = useState({ nom: "", email: "", id: 1 });
  const [searchTerm, setSearchTerm] = useState("");
  const sectionsRef = useRef({
    "sales-overview": null,
    "revenue-sources": null,
    "recent-orders": null,
    "latest-clients": null,
    "latest-delivery": null,
  });

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term === "") {
      // Si la recherche est vide, affichez toutes les sections
      Object.values(sectionsRef.current).forEach((section) => {
        if (section) section.style.display = "block";
      });
      return;
    }

    // Filtrez les sections en fonction du terme de recherche
    Object.entries(sectionsRef.current).forEach(([key, section]) => {
      if (section) {
        const shouldShow =
          key.includes(term.replace(/\s+/g, "-")) ||
          section.textContent.toLowerCase().includes(term);
        section.style.display = shouldShow ? "block" : "none";
      }
    });
  };

  // Ajoutez des refs à vos sections
  const setSectionRef = (element, key) => {
    sectionsRef.current[key] = element;
  };
  const imageMap = {
    1: admin1,
    2: admin2,
  };
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/admin/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setAdmin(res.data))
      .catch((err) => console.error(err));
  }, []);
  const navigate = useNavigate();
  useEffect(() => {
    fetch("http://localhost:8000/api/admin/clientslist/latest")
      .then((res) => res.json())
      .then((data) => setClients(data))
      .catch((err) => console.error("Erreur fetch clients:", err));
  }, []);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token admin manquant.");
      return;
    }

    axios
      .get("http://localhost:8000/api/admin/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })
      .then((res) => {
        const sortedOrders = res.data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setOrders(sortedOrders);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération des commandes :", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:8000/api/admin/livreurlist/latest")
      .then((res) => res.json())
      .then((data) => setDeliveryMen(data))
      .catch((err) => console.error(err));
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
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };
  const getStatusStyle = (statut) => {
    switch (statut.toLowerCase()) {
      case "en_attente":
        return "bg-yellow-100 text-yellow-800";
      case "confirmée":
        return "bg-blue-100 text-blue-800";
      case "en_cours":
        return "bg-purple-100 text-purple-800";
      case "en_livraison":
        return "bg-indigo-200 text-indigo-800";
      case "livrée":
        return "bg-green-100 text-green-800";
      case "retour":
        return "bg-orange-100 text-orange-800";
      case "annulée":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const [chartData, setChartData] = useState({
    ordersStats: null,
    stockMovements: null,
    clientsGrowth: null,
    loading: true,
  });

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        };

        const [ordersRes, stockRes, clientsRes] = await Promise.all([
          axios.get("http://localhost:8000/api/admin/orders-stats", {
            headers,
          }),
          axios.get("http://localhost:8000/api/admin/stock-movements", {
            headers,
          }),
          axios.get("http://localhost:8000/api/admin/clients-growth", {
            headers,
          }),
        ]);

        setChartData({
          ordersStats: ordersRes.data,
          stockMovements: stockRes.data,
          clientsGrowth: clientsRes.data,
          loading: false,
        });
      } catch (error) {
        console.error("Error fetching chart data:", error);
        setChartData((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchChartData();
  }, []);
  const [metrics, setMetrics] = useState({
    total_revenue: { value: 0, change: 0 },
    total_orders: { value: 0, change: 0 },
    total_clients: { value: 0, change: 0 },
    conversion_rate: { value: 0, change: 0 },
    loading: true,
  });

  
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8000/api/admin/metrics",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMetrics({
          ...response.data,
          loading: false,
        });
      } catch (error) {
        console.error("Error fetching metrics:", error);
        setMetrics((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchMetrics();
  }, []);
  const formatValue = (value, type) => {
    switch (type) {
      case "currency":
        return new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: "MAD",
        }).format(value);
      case "percent":
        return `${value.toFixed(1)}%`;
      default:
        return new Intl.NumberFormat("fr-FR").format(value);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <div className="flex-1 ml-64 overflow-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Bienvenue, {admin.nom || "Admin"}
          </h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <div className="relative">
              <NotificationDropdown />
            </div>

            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={imageMap[admin.id] || defaultImg}
                    alt="admin"
                    className="w-10 h-10 rounded-full border object-cover"
                  />
                </div>
                <span className="text-sm font-medium text-gray-700">Admin</span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-md z-50">
                  <Link
                    to="/admin/profile"
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

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {[
            {
              key: "total_revenue",
              title: "Total Revenue",
              type: "currency",
              icon: "↑",
              color: "bg-green-100",
              textColor: "text-green-600",
            },
            {
              key: "total_orders",
              title: "Orders",
              type: "number",
              icon: "↑",
              color: "bg-blue-100",
              textColor: "text-blue-600",
            },
            {
              key: "total_clients",
              title: "Customers",
              type: "number",
              icon: "↑",
              color: "bg-purple-100",
              textColor: "text-purple-600",
            },
            {
              key: "conversion_rate",
              title: "Conversion",
              type: "percent",
              icon: "↓",
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
                    {metrics.loading ? (
                      <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
                    ) : (
                      formatValue(metrics[metric.key]?.value || 0, metric.type)
                    )}
                  </h3>
                  <div className="flex items-center mt-2">
                    {metrics.loading ? (
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

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div
            ref={(el) => setSectionRef(el, "sales-overview")}
            className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100"
          >
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">
                Sales Overview
              </h2>
            </div>
            <div className="p-5 h-100">
              {chartData.loading ? (
                <div className="flex justify-center items-center h-80">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                </div>
              ) : (
                <Apaexlinecolumn data={chartData.ordersStats} />
              )}
            </div>
          </div>

          <div
            ref={(el) => setSectionRef(el, "order-status")}
            className="bg-white rounded-xl shadow-sm border border-gray-100"
          >
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">
                Orders Status
              </h2>
            </div>
            <div className="p-5">
              {chartData.loading ? (
                <div className="flex justify-center items-center h-80">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                </div>
              ) : (
                <>
                  <div className="h-80 flex items-center justify-center">
                    <RadialChart data={chartData.ordersStats} />
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-6 text-center">
                    {chartData.ordersStats?.status_stats?.labels?.map(
                      (label, i) => (
                        <div key={i}>
                          <div className="flex items-center justify-center gap-2 mb-1">
                            <span
                              className={`h-3 w-3 rounded-full`}
                              style={{
                                backgroundColor:
                                  chartData.ordersStats.status_stats.colors[i],
                              }}
                            ></span>
                            <span className="text-sm font-medium text-gray-700">
                              {{
                                en_attente: "En attente",
                                confirmée: "Confirmée",
                                en_livraison: "En livraison",
                                livrée: "Livrée",
                                annulée: "Annulée",
                              }[label] || label}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {chartData.ordersStats.status_stats.data[i]}{" "}
                            commandes
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Orders */}
        <div
          ref={(el) => setSectionRef(el, "recent-orders")}
          className="bg-white rounded-xl shadow-sm border border-gray-100"
        >
          <div className="p-5 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">
              Recent Orders
            </h2>
            <Link
              to="/admin/orders"
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
        {/* Latest Clients */}
        <div
          ref={(el) => setSectionRef(el, "latest-clients")}
          className="bg-white rounded-xl shadow-sm border border-gray-100 mt-6"
        >
          <div className="p-5 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">
              Latest Clients
            </h2>
            <Link
              to="/admin/clientslist"
              className="text-sm text-green-600 hover:text-green-700 font-medium"
            >
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Added on
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {clients.map((client, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900 font-medium">
                      {client.nom}
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-medium">
                      {client.prenom}
                    </td>
                    <td className="px-6 py-4 text-gray-700">{client.email}</td>
                    <td className="px-6 py-4 text-gray-700">
                      {client.telephone}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(client.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Livreur List */}
        <div
          ref={(el) => setSectionRef(el, "latest-delivery")}
          className="bg-white rounded-xl shadow-sm border border-gray-100 mt-6"
        >
          <div className="p-5 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">
              Latest Delivery Men
            </h2>
            <Link
              to="/admin/livreurlist"
              className="text-sm text-green-600 hover:text-green-700 font-medium"
            >
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Region ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Region
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {deliveryMen.length > 0 ? (
                  deliveryMen.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {user.id}
                      </td>
                      <td className="px-6 py-4 text-gray-700">{user.nom}</td>
                      <td className="px-6 py-4 text-gray-500">
                        {user.region_id}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {user.region?.nom || "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No delivery men found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
