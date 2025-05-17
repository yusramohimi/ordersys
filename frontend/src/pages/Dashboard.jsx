import { Link } from "react-router-dom";
import { Search, Globe, Bell, ChevronDown, Edit, Trash2 } from "lucide-react";
import Apaexlinecolumn from "../components/charts/Apexlinecolumn";
import RadialChart from "../components/charts/RadialChart";
import SideBar from "../components/SideBar";

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <SideBar />

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
            <button className="p-2 text-gray-500 hover:text-gray-700 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-medium">
                A
              </div>
              <span className="text-sm font-medium text-gray-700">Admin</span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {[
            {
              title: "Total Revenue",
              value: "$42,892",
              change: "+12%",
              icon: "↑",
              color: "bg-green-100",
              textColor: "text-green-600",
            },
            {
              title: "Orders",
              value: "1,258",
              change: "+8%",
              icon: "↑",
              color: "bg-blue-100",
              textColor: "text-blue-600",
            },
            {
              title: "Customers",
              value: "2,458",
              change: "+5%",
              icon: "↑",
              color: "bg-purple-100",
              textColor: "text-purple-600",
            },
            {
              title: "Conversion",
              value: "3.2%",
              change: "-0.5%",
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
                    {metric.value}
                  </h3>
                  <div className="flex items-center mt-2">
                    <span
                      className={`text-xs ${metric.textColor} flex items-center`}
                    >
                      {metric.icon} {metric.change}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
                      vs last month
                    </span>
                  </div>
                </div>
                <div
                  className={`h-12 w-12 rounded-full ${metric.color} flex items-center justify-center`}
                >
                  <span className="text-lg font-semibold">{metric.change}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">
                Sales Overview
              </h2>
            </div>
            <div className="p-5 h-100">
              {" "}
              {/* Hauteur fixée */}
              <Apaexlinecolumn />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">
                Revenue Sources
              </h2>
            </div>
            <div className="p-5">
              <div className="h-80 flex items-center justify-center">
                <RadialChart />
              </div>

              {/* Legend */}
              <div className="grid grid-cols-3 gap-4 mt-6 text-center">
                {[
                  { name: "Direct", value: "65%", color: "bg-blue-500" },
                  { name: "Organic", value: "25%", color: "bg-green-500" },
                  { name: "Referral", value: "10%", color: "bg-purple-500" },
                ].map((source, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <span
                        className={`h-3 w-3 rounded-full ${source.color}`}
                      ></span>
                      <span className="text-sm font-medium text-gray-700">
                        {source.name}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {source.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-5 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">
              Recent Orders
            </h2>
            <Link
              to="/orders/admin"
              className="text-sm text-green-600 hover:text-green-700 font-medium"
            >
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "Transaction ID",
                    "Client",
                    "Date",
                    "Amount",
                    "Status",
                    "Action",
                  ].map((header, i) => (
                    <th
                      key={i}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  {
                    id: "#TRX7891",
                    name: "Alex Johnson",
                    date: "15 May, 2023",
                    amount: "$245.00",
                    status: "Completed",
                  },
                  {
                    id: "#TRX7890",
                    name: "Maria Garcia",
                    date: "14 May, 2023",
                    amount: "$189.50",
                    status: "Pending",
                  },
                  {
                    id: "#TRX7889",
                    name: "David Wilson",
                    date: "14 May, 2023",
                    amount: "$320.75",
                    status: "Completed",
                  },
                  {
                    id: "#TRX7888",
                    name: "Sarah Miller",
                    date: "13 May, 2023",
                    amount: "$95.20",
                    status: "Failed",
                  },
                  {
                    id: "#TRX7887",
                    name: "James Brown",
                    date: "12 May, 2023",
                    amount: "$450.00",
                    status: "Completed",
                  },
                ].map((txn, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {txn.id}
                    </td>
                    <td className="px-6 py-4 text-gray-500">{txn.name}</td>
                    <td className="px-6 py-4 text-gray-500">{txn.date}</td>
                    <td className="px-6 py-4 text-gray-500">{txn.amount}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          txn.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : txn.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {txn.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button className="text-green-600 hover:text-green-700">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
