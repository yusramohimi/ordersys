import React, { useEffect, useState } from "react";
import SideBar from "./SideBar";
import FactureModal from "../FactureModal"; // <-- Assure-toi que le nom est bien le bon

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
  const handleUpdateOrder = () => {
    fetch(`http://localhost:8000/api/admin/orders/${selectedOrder.id}/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        heure_estimee_livraison: estimatedTime,
        statut: selectedStatus,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        setOrders((prev) =>
          prev.map((order) =>
            order.id === selectedOrder.id
              ? {
                  ...order,
                  heure_estimee_livraison: estimatedTime,
                  statut: selectedStatus,
                }
              : order
          )
        );
        setSelectedOrder(null);
        setEstimatedTime("");
        setSelectedStatus("");
      })
      .catch((err) => console.error("Erreur de mise à jour :", err));
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setEstimatedTime(order.heure_estimee_livraison || "");
    setSelectedStatus(order.statut || "en_attente");
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "en_attente":
        return "bg-yellow-100 text-yellow-800";
      case "confirmee":
        return "bg-blue-100 text-blue-800";
      case "en_cours":
        return "bg-purple-100 text-purple-800";
      case "en_livraison":
        return "bg-indigo-100 text-indigo-800"; // ✅ Ajouté
      case "livree":
      case "livrée": // au cas où tu reçois l’un ou l’autre
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
    <div className="flex h-screen bg-gray-100">
      <div className="w-64">
        <SideBar />
      </div>

      <div className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Orders List
        </h1>

        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["Order ID", "Client", "Date", "Amount", "Status", "Action"].map((header, i) => (
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
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td
                    className="px-6 py-4 font-medium text-green-600 cursor-pointer"
                    onClick={() => openOrderDetails(order)}
                  >
                    {order.id}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {order.client_name}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(order.created_at).toLocaleDateString()}
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
                  <td className="px-6 py-4 space-x-2">
                    <button
                      className="border border-red-500 text-red-600 hover:bg-red-50 text-xs px-3 py-1 rounded-md transition-all"
                      onClick={() => handleCancel(order.id)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedCommande(txn.id)}
                      className="bg-green-600 text-white hover:bg-green-700 text-xs px-3 py-1 rounded-md transition-all"
                    >
                      Invoice
                    </button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
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
