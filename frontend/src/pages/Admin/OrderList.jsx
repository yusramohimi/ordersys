import React, { useEffect, useState } from "react";
import SideBar from "./SideBar";

const OrderList = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/admin/orders")
      .then((res) => res.json())
      .then((data) => {
        
        setTransactions(data);
      })
      .catch((err) => console.error(err));
  }, []);

  // Fonction pour supprimer une commande
  const handleCancel = (id) => {
    fetch(`http://localhost:8000/api/admin/orders/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          // Met à jour la liste après suppression
          setTransactions((prev) => prev.filter((txn) => txn.id !== id));
        } else {
          alert("Erreur lors de la suppression");
        }
      })
      .catch(() => alert("Erreur réseau"));
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64">
        <SideBar />
      </div>

      <div className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Orders List</h1>

        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "Order ID",
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
              {transactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{txn.id}</td>
                  <td className="px-6 py-4 text-gray-500">{txn.client_name}</td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(txn.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{txn.amount}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        txn.status === "livrée"
                          ? "bg-green-100 text-green-800"
                          : txn.status === "en_attente"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {txn.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      className="border border-red-500 text-red-600 hover:bg-red-50 text-xs px-3 py-1 rounded-md transition-all"
                      onClick={() => handleCancel(txn.id)}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">
                    No Available Orders.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderList;
