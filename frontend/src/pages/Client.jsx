import React, { useEffect, useState } from "react";
import axios from "axios";
import SideBar from "../components/SideBar"; 

const Client = () => {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/clients");
      setClients(response.data);
    } catch (error) {
      console.error(" Erreur lors de la récupération des clients", error);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex h-screen">
        <SideBar />
        <div className="flex-1 flex flex-col items-center p-6">
          <h2 className="text-3xl font-bold mb-6">Liste des Clients</h2>
          <div className="bg-white shadow-lg rounded-lg">
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border px-4 py-2">Nom</th>
                  <th className="border px-4 py-2">Email</th>
                  <th className="border px-4 py-2">Téléphone</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.length > 0 ? (
                  clients.map((client) => (
                    <tr key={client._id} className="bg-white text-center">
                      <td className="border px-4 py-2">{client.nom}</td>
                      <td className="border px-4 py-2">{client.email}</td>
                      <td className="border px-4 py-2">{client.telephone}</td>
                      <td className="border px-4 py-2">Actions</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4">Aucun client trouvé.</td>
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

export default Client;

  