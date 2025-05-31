import React, { useState, useEffect } from "react";
import axios from "axios";
import logoImage from "/src/assets/logo-fr.png";
import broxodentImage from "/src/assets/broxodent.jpg";
import FactureModal from "../FactureModal";


const ClientDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [selectedCommande, setSelectedCommande] = useState(null);
  
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        };

        const [profileRes, commandesRes] = await Promise.all([
          axios.get("http://localhost:8000/api/client/profile", { headers }),
          axios.get("http://localhost:8000/api/client/commandes", { headers }),
        ]);

        setProfile(profileRes.data);
        setOrders(commandesRes.data.map(cmd => ({
          id: cmd.id,
          product: "Brosse à dents sonore et mécanique",
          date: new Date(cmd.created_at).toLocaleDateString(),
          amount: cmd.prix_total + " MAD",
          status: cmd.statut,
          deliveryEstimate: cmd.heure_estimee_livraison
            ? new Date(cmd.heure_estimee_livraison).toLocaleDateString()
            : "Non défini",
          reference: "Réf. #" + cmd.id,
          image: broxodentImage,
          invoice: `/facture/${cmd.id}`,
        })));
      } catch (error) {
        console.error("Erreur chargement dashboard client :", error);
      }
    };

    fetchData();
  }, []);

  const handleOrderClick = (orderId) => {
    setSelectedOrder(orderId);
    setShowOrderDetails(true);
  };

  const closeModal = () => {
    setShowOrderDetails(false);
  };



  const selected = orders.find((o) => o.id === selectedOrder);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <div>
          <img src={logoImage} alt="Logo Santé Parodonte" className="h-12 w-auto" />
        </div>
        <div className="space-x-6 text-gray-700 font-medium">
          <a href="#" className="hover:text-green-600">Accueil</a>
          <a href="#commandes" className="hover:text-green-600">Commandes</a>
          <a href="#factures" className="hover:text-green-600">Factures</a>
          <a href="#" className="hover:text-green-600">Déconnexion</a>
        </div>
      </nav>

      <div className="p-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Bienvenue,</h2>

        {profile && (
          <div className="bg-white shadow-md rounded-xl p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Mes informations</h3>
            <p><strong>Nom :</strong> {profile.prenom} {profile.nom}</p>
            <p><strong>Email :</strong> {profile.email}</p>
            <p><strong>Adresse :</strong> {profile.ville}, {profile.adresse}</p>
          </div>
        )}

        <section id="commandes" className="bg-white rounded-lg shadow overflow-hidden mb-8">
          <h2 className="text-xl font-semibold p-6 border-b">Mes commandes</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produits</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleOrderClick(order.id)}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-green-600">{order.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img src={order.image} alt={order.product} className="w-12 h-12 object-cover rounded mr-3" />
                        <span className="text-sm text-gray-500">{order.product}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{order.date}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{order.amount}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div id="factures" className="bg-white shadow-md rounded-xl p-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Mes factures</h3>
          <ul className="space-y-2">
            {orders.map((order) => (
              <li key={order.id} className="border-b py-2 flex justify-between items-center">
                <div>
                  <strong>Facture #{order.id}</strong> - {order.amount}
                </div>
                <button
                  onClick={() => setSelectedCommande(order.id)}
                  className="text-green-500 hover:underline"
                >
                  Télécharger
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {showOrderDetails && selected && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">Détails de la commande</h3>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">✕</button>
              </div>

              <div className="flex items-start mb-6">
                <img src={selected.image} alt={selected.product} className="w-24 h-24 object-cover rounded mr-4" />
                <div>
                  <p className="font-medium">{selected.product}</p>
                  <p className="text-gray-600 text-sm mt-1">{selected.reference}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Statut</p>
                  <p className="font-medium">{selected.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Montant</p>
                  <p className="font-medium">{selected.amount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date de commande</p>
                  <p className="font-medium">{selected.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Estimation de livraison</p>
                  <p className="font-medium">{selected.deliveryEstimate}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Facture</h4>
                <button
                    onClick={() => setSelectedCommande(selected.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Télécharger la facture
                  </button>

              </div>

              <button className="mt-6 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                Annuler la commande
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

export default ClientDashboard;
