import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

import logodark from '../assets/logo-fr.png';
import admin1 from '../assets/admins/1.jpg';
import admin2 from '../assets/admins/2.jpg';
import defaultImg from '../assets/admins/default.png';

const LockScreen = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const resAdmin = await axios.get("http://localhost:8000/api/admin/profile", config);
      if (resAdmin.data?.id) {
        setUser({ ...resAdmin.data, role: "admin" });
        return;
      }
    } catch (_) {}

    try {
      const resLivreur = await axios.get("http://localhost:8000/api/livreur/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (resLivreur.data?.id) {
        setUser({ ...resLivreur.data, role: "livreur" });
        return;
      }
    } catch (_) {
      setUser({ nom: "Utilisateur", role: "inconnu" });
    }
  };

  const avatarMap = {
    1: admin1,
    2: admin2,
  };

  const avatar =
    user?.role === "admin" ? avatarMap[user.id] || defaultImg : defaultImg;

const handleUnlock = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const res = await axios.post("http://localhost:8000/api/unlock", { password }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    localStorage.removeItem("locked");

    if (res.data.role === "admin") {
      return navigate("/admin/dashboard");
    }

    if (res.data.role === "livreur") {
      return navigate("/livreur/dashboard");
    }

    navigate("/login");
  } catch (err) {
    setError("Mot de passe incorrect.");
  }
};

  useEffect(() => {
    document.title = "Écran Verrouillé";
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="mb-6 text-center">
        <img src={logodark} alt="logo" className="h-16 mx-auto" />
        <h1 className="text-xl font-semibold mt-2 text-gray-800">Écran Verrouillé</h1>
        <p className="text-gray-600 text-sm">Entrez votre mot de passe pour continuer</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col items-center">
          <img
            src={avatar}
            alt="user"
            className="w-24 h-24 rounded-full object-cover border border-gray-300 shadow-sm mb-3"
          />
          <h2 className="text-lg font-medium text-gray-800 mb-4">{user?.nom}</h2>
        </div>

        <form onSubmit={handleUnlock}>
          <label htmlFor="password" className="text-sm text-gray-700 font-medium block mb-1">
            Mot de passe
          </label>
          <input
            type="password"
            id="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
          >
            Déverrouiller
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          Pas vous ?{" "}
          <Link to="/login" className="text-green-600 hover:underline font-medium">
            Se déconnecter
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-6 text-gray-400 text-sm text-center">
        © {new Date().getFullYear()} Santé Parodonte.
      </footer>
    </div>
  );
};

export default LockScreen;
