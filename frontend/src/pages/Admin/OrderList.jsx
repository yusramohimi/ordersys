import React from "react";
import SideBar from "./SideBar";

const OrderList = () => {
  const transactions = [
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
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64">
        <SideBar />
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 overflow-auto">
        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Order List
        </h1>

        {/* Table */}
        <div className="bg-white shadow rounded-lg overflow-x-auto">
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
              {transactions.map((txn, i) => (
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
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="border border-green-500 text-green-600 hover:bg-green-50 text-xs px-3 py-1 rounded-md transition-all"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="border border-red-500 text-red-600 hover:bg-red-50 text-xs px-3 py-1 rounded-md transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="border border-blue-500 text-blue-600 hover:bg-blue-50 text-xs px-3 py-1 rounded-md transition-all"
                      >
                        Details
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
  );
};

export default OrderList;
