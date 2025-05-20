import React, { useEffect, useState } from "react";
import SideBarLiv from "./SideBarLiv";

const OrderListLiv = () => {
  const [transactions, setTransactions] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/api/livreur/orders")
      .then((res) => res.json())
      .then((data) => {
        setTransactions(data);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleCancel = (id) => {
    fetch(`http://localhost:8000/api/livreur/orders/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          setTransactions((prev) => prev.filter((txn) => txn.id !== id));
        } else {
          alert("Erreur lors de la suppression");
        }
      })
      .catch(() => alert("Erreur réseau"));
  };

  // Fonction qui met à jour statut et heure estimée
  const handleUpdateOrder = () => {
    fetch(`http://localhost:8000/api/livreur/orders/${selectedOrder.id}/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        heure_estimee_livraison: estimatedTime,
        status: selectedStatus,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        setTransactions((prev) =>
          prev.map((txn) =>
            txn.id === selectedOrder.id
              ? {
                  ...txn,
                  heure_estimee_livraison: estimatedTime,
                  status: selectedStatus,
                }
              : txn
          )
        );
        setSelectedOrder(null);
        setEstimatedTime("");
        setSelectedStatus("");
      })
      .catch((err) => console.error(err));
  };

  // Lors de l'ouverture de la popup on initialise le status aussi
  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setEstimatedTime(order.heure_estimee_livraison || "");
    setSelectedStatus(order.status || "en_attente");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64">
        <SideBarLiv />
      </div>

      <div className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Orders List
        </h1>

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
                  <td
                    className="px-6 py-4 font-medium text-green-600 cursor-pointer"
                    onClick={() => openOrderDetails(txn)}
                  >
                    {txn.id}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{txn.client_name}</td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(txn.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{txn.prix_total}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        txn.status === "livree"
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

      {selectedOrder && (
        <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg border shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-green-700">
              Order Details
            </h2>
            <p>
              <strong>Client:</strong> {selectedOrder.client_name}
            </p>
            <p>
              <strong>Adresse:</strong> {selectedOrder.adresse}
            </p>
            <p>
              <strong>Montant:</strong> {selectedOrder.prix_total}
            </p>

            <p>
              <strong>Date:</strong>{" "}
              {new Date(selectedOrder.created_at).toLocaleDateString()}
            </p>
            <div className="my-2">
              <label className="block text-sm font-medium text-gray-700">
                Statut de la commande
              </label>
              <select
                className="w-full mt-1 border-gray-300 rounded-md"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="en_attente">En attente</option>
                <option value="en_cours">En cours</option>
                <option value="livree">Livrée</option>
                <option value="annulee">Annulée</option>
              </select>
            </div>

            <div className="my-2">
              <label className="block text-sm font-medium text-gray-700">
                Heure estimée de livraison
              </label>
              <input
                type="datetime-local"
                className="w-full mt-1 border-gray-300 rounded-md"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
              />
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="bg-gray-200 px-4 py-2 rounded"
                onClick={() => setSelectedOrder(null)}
              >
                Fermer
              </button>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded"
                onClick={handleUpdateOrder}
              >
                Modifier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderListLiv;
