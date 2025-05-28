import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SideBar from "./SideBar";
import admin1 from "../../assets/admins/1.jpg";
import admin2 from "../../assets/admins/2.jpg";
import defaultImg from "../../assets/admins/default.png";

const ProfileAdmin = () => {
  const [admin, setAdmin] = useState({ nom: "", email: "", id: 1 });
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
const imageMap = {
  1: admin1,
  2: admin2,
  
};
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/admin/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setAdmin(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        nom: admin.nom,
        email: admin.email,
        ...(password && { password, password_confirmation: passwordConfirm }),
      };

      const res = await axios.put(
        "http://localhost:8000/api/admin/profile",
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMessage(res.data.message || "Profil mis à jour avec succès.");
      setTimeout(() => {
        navigate("/admin/dashboard"); // modifie selon ton route exacte
      }, 2000);
    } catch (err) {
      console.error(err);
      setMessage("Erreur lors de la mise à jour.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SideBar */}
      <SideBar />

      {/* Main content */}
      <div className="flex-1 ml-64 overflow-auto p-6">
        <h1 className="text-3xl font-semibold mb-6">Profile</h1>

        {message && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
            {message}
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-6 mb-6 flex items-center space-x-6">
          <img
            src={imageMap[admin.id] || defaultImg}
            alt="admin"
            className="w-24 h-24 rounded-full border object-cover"
          />


          <div>
            <p className="text-xl font-semibold">{admin.nom}</p>
            <p className="text-gray-600">{admin.email}</p>
            <p className="text-gray-400 text-sm">ID no: #{admin.id}</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow rounded-lg p-6 space-y-4"
        >
          <h2 className="text-xl font-semibold mb-2">
            Changer les informations
          </h2>
          <div>
            <label className="block text-sm font-medium mb-1">Nom</label>
            <input
              type="text"
              value={admin.nom}
              onChange={(e) => setAdmin({ ...admin, nom: e.target.value })}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={admin.email}
              onChange={(e) => setAdmin({ ...admin, email: e.target.value })}
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
              onClick={() => navigate("/admin/dashboard")}
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

export default ProfileAdmin;
