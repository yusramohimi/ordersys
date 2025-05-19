import React, { useEffect, useState } from "react";
import axios from "axios";
import SideBar from "../Admin/SideBar"; 

const Product = () => {
  const [Products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/Products");
      setProducts(response.data);
    } catch (error) {
      console.error(" Erreur lors de la récupération des Products", error);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex h-screen">
        <SideBar />
        <div className="flex-1 flex flex-col items-center p-6">
          <h2 className="text-3xl font-bold mb-6">Liste des Products</h2>
          <div className="bg-white shadow-lg rounded-lg">
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border px-4 py-2">Référence</th>
                  <th className="border px-4 py-2">Désignation</th>
                  <th className="border px-4 py-2">Prix</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Products.length > 0 ? (
                  Products.map((Product) => (
                    <tr key={Product._id} className="bg-white text-center">
                      <td className="border px-4 py-2">{Product.reference}</td>
                      <td className="border px-4 py-2">{Product.designation}</td>
                      <td className="border px-4 py-2">{Product.prix} MAD</td>
                      <td className="border px-4 py-2">Actions</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4">Aucun Product trouvé.</td>
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

export default Product;

  