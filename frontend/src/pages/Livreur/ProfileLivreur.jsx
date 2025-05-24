import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SideBarLiv from "./SideBarLiv";

const ProfileLivreur = () => {
  const [livreur, setLivreur] = useState({
    nom: "",
    email: "",
    telephone: "",
    id: null,
  });
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/livreur/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setLivreur(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        nom: livreur.nom,
        email: livreur.email,
        telephone: livreur.telephone,
        ...(password && { password, password_confirmation: passwordConfirm }),
      };

      const res = await axios.put(
        "http://localhost:8000/api/livreur/profile",
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMessage(res.data.message || "Profil mis à jour avec succès.");
      setTimeout(() => navigate("/livreur/dashboard"), 1500);
    } catch (err) {
      console.error(err);
      setMessage("Erreur lors de la mise à jour.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideBarLiv />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-semibold mb-6">Profil Livreur</h1>

        {message && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
            {message}
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-6 mb-6 flex items-center space-x-6">
          <img src="" alt="livreur" className="w-24 h-24 rounded-full border" />
          <div>
            <p className="text-xl font-semibold">{livreur.nom}</p>
            <p className="text-gray-600">{livreur.email}</p>
            <p className="text-gray-400 text-sm">
              Téléphone : {livreur.telephone}
            </p>
            <p className="text-gray-400 text-sm">ID no: #{livreur.id}</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow rounded-lg p-6 space-y-4"
        >
          <h2 className="text-xl font-semibold mb-2">
            Modifier les informations
          </h2>
          <div>
            <label className="block text-sm font-medium mb-1">Nom</label>
            <input
              type="text"
              value={livreur.nom}
              onChange={(e) => setLivreur({ ...livreur, nom: e.target.value })}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={livreur.email}
              onChange={(e) =>
                setLivreur({ ...livreur, email: e.target.value })
              }
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Téléphone</label>
            <input
              type="text"
              value={livreur.telephone}
              onChange={(e) =>
                setLivreur({ ...livreur, telephone: e.target.value })
              }
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Laisser vide pour ne pas changer"
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate("/livreur/dashboard")}
              className="bg-gray-300 hover:bg-gray-400 text-black font-semibold px-4 py-2 rounded"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded"
            >
              Sauvegarder les modifications
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileLivreur;
