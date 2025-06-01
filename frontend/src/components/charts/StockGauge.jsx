import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";
import { RotateCcw } from "lucide-react"; // ou tout autre icône
import "react-circular-progressbar/dist/styles.css";

const StockGauge = ({ produitId }) => {
  const [stockActuel, setStockActuel] = useState(0);
  const [stockMax, setStockMax] = useState(100);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  const fetchStock = async () => {
    try {
      setIsRefreshing(true);
      const response = await fetch(`http://localhost:8000/api/produits/${produitId}/stock`);
      const data = await response.json();
      setStockActuel(data.stock_actuel);
      setStockMax(data.stock_max);
    } catch (error) {
      console.error("Erreur lors de la récupération du stock :", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStock();
  }, [produitId]);

  const pourcentage = stockMax > 0 ? (stockActuel / stockMax) * 100 : 0;

  let pathColor = "#2ecc71";
  if (pourcentage < 60 && pourcentage >= 30) pathColor = "#f39c12";
  else if (pourcentage < 30) pathColor = "#e74c3c";

  const isLowStock = stockActuel < 200;

  return (
    <div className="flex flex-col items-center relative">
      {/* Bouton refresh top-right */}
      <button
        onClick={fetchStock}
        className="absolute right-2 top-2 text-gray-500 hover:text-green-600 transition"
        title="Rafraîchir le stock"
      >
        <RotateCcw className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`} />
      </button>

      <div className="w-72 h-72 mb-4">
        <CircularProgressbarWithChildren
          value={pourcentage}
          strokeWidth={10}
          styles={buildStyles({
            pathColor,
            trailColor: "#ecf0f1",
          })}
        >
          <div className="flex flex-col items-center justify-center">
            <div className="text-xl font-semibold text-gray-800">Stock</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              {stockActuel} / {stockMax}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              ({pourcentage.toFixed(0)}%)
            </div>
            {isLowStock && (
              <div className="mt-2 text-sm font-semibold text-red-600 animate-pulse">
                ⚠️ Stock faible !
              </div>
            )}
          </div>
        </CircularProgressbarWithChildren>
      </div>

      <button
        onClick={() => navigate("/admin/stock")}
        className="px-4 py-1 bg-green-100 text-green-700 text-sm rounded hover:bg-green-200 transition"
      >
        Ajouter du stock
      </button>
    </div>
  );
};

export default StockGauge;
