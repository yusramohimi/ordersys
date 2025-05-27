import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { useState } from "react";
import logoImage from "/src/assets/logo-fr.png";

const loginSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(8, "Mot de passe trop court"),
});

export default function Login() {
  const [loginError, setLoginError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        credentials: "include", // ❗ Si tu utilises Sanctum. Sinon retire cette ligne.
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setLoginError(result.message || "Identifiants incorrects.");
        return;
      }

      if (result.token && result.user_type && result.user) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("role", result.user_type);
        localStorage.setItem("user", JSON.stringify(result.user));
        setLoginError("");
        window.location.href = `/${result.user_type}/dashboard`;
      } else {
        setLoginError("Données de réponse invalides.");
      }
    } catch (error) {
      console.error("Erreur de connexion :", error);
      setLoginError("Impossible de se connecter au serveur.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center bg-white p-4"
    >
      <div className="w-full max-w-4xl h-[500px] bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
        {/* Form Section */}
        <div className="md:w-1/2 p-8 flex flex-col justify-center items-center bg-gray-50">
          <div className="w-full max-w-sm space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-green-800">Bienvenue</h2>
              <p className="mt-2 text-sm text-gray-600">
                Connectez-vous à votre espace
              </p>
            </div>

            <form id="login-form" className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Adresse email
                </label>
                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  className={`mt-1 block w-full px-3 py-3 text-base border ${
                    errors.email ? "border-red-300" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Mot de passe
                </label>
                <input
                  id="password"
                  type="password"
                  {...register("password")}
                  className={`mt-1 block w-full px-3 py-3 text-base border ${
                    errors.password ? "border-red-300" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500`}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div className="w-full flex justify-center mb-2">
                <button
                  type="submit"
                  className="px-6 py-2 rounded-md bg-green-600 text-white text-sm font-medium hover:bg-green-700"
                >
                  Se connecter
                </button>
              </div>

              {loginError && (
                <p className="text-sm text-red-600 text-center">{loginError}</p>
              )}
            </form>
          </div>
        </div>

        {/* Image Section */}
        <div className="md:w-1/2 flex items-center justify-center bg-white p-4 h-full">
          <img
            src={logoImage}
            alt="Illustration connexion"
            className="max-w-[350px] w-full h-auto object-contain"
          />
        </div>
      </div>
    </motion.div>
  );
}
