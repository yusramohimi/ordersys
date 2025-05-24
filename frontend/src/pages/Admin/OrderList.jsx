import React, { useEffect, useState } from "react";
import SideBar from "./SideBar";
import FactureModal from "../FactureModal";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [selectedCommande, setSelectedCommande] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetch("http://localhost:8000/api/admin/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setFilteredOrders(data);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(
        orders.filter((order) => order.statut === statusFilter)
      );
    }
  }, [statusFilter, orders]);

  const handleCancel = (id) => {
    fetch(`http://localhost:8000/api/admin/orders/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          setOrders((prev) => prev.filter((order) => order.id !== id));
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
      case "confirmée":
        return "bg-blue-100 text-blue-800";
      case "en_cours":
        return "bg-purple-100 text-purple-800";
      case "en_livraison":
        return "bg-indigo-200 text-indigo-800";
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
    <div className="flex h-screen bg-gray-100">
      <div className="w-64">
        <SideBar />
      </div>

      <div className="flex-1 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">
            Orders List
          </h1>
          <div className="mt-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="en_attente">En attente</option>
              <option value="confirmée">Confirmée</option>
              <option value="en_cours">En cours</option>
              <option value="en_livraison">En livraison</option>
              <option value="livrée">Livrée</option>
              <option value="retour">Retour</option>
              <option value="annulee">Annulée</option>
            </select>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => (
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
                      className="border border-red-500 text-red-600 hover:bg-red-50 text-xs px-3 py-1 rounded-md"
                      onClick={() => handleCancel(order.id)}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-green-600 text-white hover:bg-green-700 text-xs px-3 py-1 rounded-md"
                      onClick={() => setSelectedCommande(order.id)}
                    >
                      Invoice
                    </button>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">
                    Aucune commande trouvée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de détails commande */}
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
                value={selectedStatus || ""}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="en_attente">En attente</option>
                <option value="confirmée">Confirmée</option>
                <option value="en_cours">En cours</option>
                <option value="en_livraison">En livraison</option>
                <option value="livrée">Livrée</option>
                <option value="retour">Retour</option>
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
                value={estimatedTime || ""}
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

      {/* Modal de facture */}
      {selectedCommande && (
        <FactureModal
          commandeId={selectedCommande}
          onClose={() => setSelectedCommande(null)}
        />
      )}
    </div>
  );
};

export default OrderList;
