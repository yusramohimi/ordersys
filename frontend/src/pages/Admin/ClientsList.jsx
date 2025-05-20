import React, { useEffect, useState } from "react";
import SideBar from "./SideBar";

const ClientList = () => {
  const [clients, setClients] = useState([]);

  const fetchClients = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/admin/clientslist");
      const data = await res.json();
      setClients(data);
    } catch (err) {
      console.error("Erreur lors du chargement des clients:", err);
    }
  };

  const deleteClient = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) return;

    try {
      const res = await fetch(`http://localhost:8000/api/admin/clientslist/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setClients(clients.filter((client) => client.id !== id));
      } else {
        console.error("La suppression a échoué");
      }
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64">
        <SideBar />
      </div>

      {/* Contenu principal */}
      <div className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Liste des Clients</h1>

        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "ID",
                  "Prénom",
                  "Nom",
                  "Email",
                  "Ville",
                  "Région",
                  "Adresse",
                  "Créé le",
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
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{client.id}</td>
                  <td className="px-6 py-4 text-gray-500">{client.prenom}</td>
                  <td className="px-6 py-4 text-gray-500">{client.nom}</td>
                  <td className="px-6 py-4 text-gray-500">{client.email}</td>
                  <td className="px-6 py-4 text-gray-500">{client.ville}</td>
                  <td className="px-6 py-4 text-gray-500">{client.region_id}</td>
                  <td className="px-6 py-4 text-gray-500">{client.adresse}</td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(client.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => deleteClient(client.id)}
                      className="border border-red-500 text-red-600 hover:bg-red-50 text-xs px-3 py-1 rounded-md transition-all"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
              {clients.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center px-6 py-4 text-gray-500">
                    Aucun client trouvé.
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

export default ClientList;

  