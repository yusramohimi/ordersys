import React, { useEffect, useState } from "react";
import axios from "axios";
import SideBar from "./SideBar";

const StockMovement = () => {
  const [produits, setProduits] = useState([]);
  const [formData, setFormData] = useState({
    produit_id: '',
    type: '',
    quantite: '',
    motif: ''
  });

  useEffect(() => {
    axios.get('http://localhost:8000/api/admin/produits')
      .then(res => {
        // Suppression des doublons par ID (au cas où)
        const uniqueProduits = Array.from(new Map(res.data.map(item => [item.id, item])).values());
        setProduits(uniqueProduits);
      })
      .catch(err => console.error(err));
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/admin/stock', formData);
      alert('Mouvement de stock enregistré avec succès.');
      setFormData({ produit_id: '', type: '', quantite: '', motif: '' });
    } catch (err) {
      alert('Erreur lors de l\'enregistrement du mouvement.');
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideBar />
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-xl">
          <h2 className="text-2xl font-bold text-center text-green-600 mb-6">
            Add a Stock Mouvement
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Produit
              </label>
              <select
                name="produit_id"
                value={formData.produit_id}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                required
              >
                <option value="">-- Select a product --</option>
                {produits.map(produit => (
                  <option key={produit.id} value={produit.id}>{produit.nom}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mouvement Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                required
              >
                <option value="">-- Select a type --</option>
                <option value="entrée">Entry</option>
                <option value="sortie">Exit</option>
                <option value="ajustement">Adjustement</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <input
                type="number"
                name="quantite"
                value={formData.quantite}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Motif (optionnel)
              </label>
              <textarea
                name="motif"
                value={formData.motif}
                onChange={handleChange}
                rows="3"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <div className="pt-4 text-center">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-all"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StockMovement;
