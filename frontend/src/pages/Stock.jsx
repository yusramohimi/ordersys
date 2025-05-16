import React, { useEffect, useState } from "react";
import axios from "axios";
import SideBar from "../components/SideBar"; 

const Stock = () => {
  const [stock, setStock] = useState([]);

  useEffect(() => {
    fetchStock();
  }, []);

  const fetchStock = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/stock");
      setStock(response.data);
    } catch (error) {
      console.error(" Erreur lors de la récupération du stock", error);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex h-screen">
        <SideBar />
        <div className="flex-1 flex flex-col items-center p-6">
          <h2 className="text-3xl font-bold mb-6">Gestion du Stock</h2>
          <div className="bg-white shadow-lg rounded-lg">
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border px-4 py-2">Article</th>
                  <th className="border px-4 py-2">Quantité</th>
                  <th className="border px-4 py-2">Prix unitaire</th>
                  <th className="border px-4 py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {stock.length > 0 ? (
                  stock.map((item) => (
                    <tr key={item._id} className="bg-white text-center">
                      <td className="border px-4 py-2">{item.article}</td>
                      <td className="border px-4 py-2">{item.quantite}</td>
                      <td className="border px-4 py-2">{item.prix} MAD</td>
                      <td className="border px-4 py-2">{item.quantite * item.prix} MAD</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4">Aucun produit en stock.</td>
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

export default Stock;

  