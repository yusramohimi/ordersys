import React, { useState, useEffect } from "react";
import SideBar from "./SideBar";

const AddLivreur = () => {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    region_id: "",
    password: "",
  });

  const [regions, setRegions] = useState([]);
  const [errors, setErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [backendError, setBackendError] = useState("");

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/regions");
        const data = await response.json();
        setRegions(data);
      } catch (error) {
        console.error("Erreur lors du chargement des régions :", error);
      }
    };
    fetchRegions();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!formData.nom.trim()) newErrors.nom = "Nom requis";
    // email regex simple
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) newErrors.email = "Email invalide";
    if (!/^\d{10}$/.test(formData.telephone))
      newErrors.telephone = "Téléphone invalide (10 chiffres requis)";
    if (!formData.region_id) newErrors.region_id = "Région requise";
    if (formData.password.length < 6)
      newErrors.password = "Mot de passe trop court (min 6 caractères)";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setBackendError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setBackendError("");

    const payload = {
      ...formData,
      region_id: parseInt(formData.region_id, 10),
    };

    try {
      const response = await fetch("http://localhost:8000/api/admin/livreurs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setFormSubmitted(true);
        setFormData({
          nom: "",
          email: "",
          telephone: "",
          region_id: "",
          password: "",
        });
        setErrors({});
        // Reset message succès au bout de 5s
        setTimeout(() => setFormSubmitted(false), 5000);
      } else {
        // Laravel retourne probablement les erreurs dans data.errors
        if (data.errors) {
          setErrors(data.errors);
        } else if (data.message) {
          setBackendError(data.message);
        } else {
          setBackendError("Erreur lors de l'ajout du livreur");
        }
      }
    } catch (error) {
      setBackendError("Erreur réseau : " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideBar />
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-green-600 mb-6">
            Ajouter un livreur
          </h2>

          {formSubmitted && (
            <div className="mb-4 text-green-600 text-center font-semibold">
              Livreur ajouté avec succès !
            </div>
          )}

          {backendError && (
            <div className="mb-4 text-red-600 text-center font-semibold">
              {backendError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label
                htmlFor="nom"
                className="block text-sm font-medium text-gray-700"
              >
                Nom
              </label>
              <input
                type="text"
                name="nom"
                id="nom"
                value={formData.nom}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.nom ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm`}
              />
              {errors.nom && (
                <p className="text-red-500 text-sm">{errors.nom}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="telephone"
                className="block text-sm font-medium text-gray-700"
              >
                Téléphone
              </label>
              <input
                type="text"
                name="telephone"
                id="telephone"
                value={formData.telephone}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.telephone ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm`}
              />
              {errors.telephone && (
                <p className="text-red-500 text-sm">{errors.telephone}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="region_id"
                className="block text-sm font-medium text-gray-700"
              >
                Région
              </label>
              <select
                name="region_id"
                id="region_id"
                value={formData.region_id}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.region_id ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm`}
              >
                <option value="">-- Sélectionner une région --</option>
                {regions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.nom}
                  </option>
                ))}
              </select>
              {errors.region_id && (
                <p className="text-red-500 text-sm">{errors.region_id}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Mot de passe
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 text-white font-semibold rounded-lg transition duration-200 ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? "Ajout en cours..." : "Ajouter"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddLivreur;
