import React from "react";
import ReactApexChart from "react-apexcharts";

const LivreurCharts = ({ orders }) => {
  if (!orders || orders.length === 0) {
    return <div className="text-center py-10">Aucune donnée disponible</div>;
  }

  // Fonction de normalisation des statuts
  const normalizeStatus = (status) => {
    if (!status) return "inconnu";

    const statusMap = {
      en_attente: "en_attente",
      confirmee: "confirmee",
      confirme: "confirmee",
      en_cours: "en_cours",
      en_livraison: "en_livraison",
      livree: "livree",
      livrée: "livree",
      retour: "retour",
      annulee: "annulee",
      annulée: "annulee",
    };

    return statusMap[status.toLowerCase()] || "inconnu";
  };

  // Groupement par mois
  const monthlyData = orders.reduce((acc, order) => {
    const date = new Date(order.created_at);
    const monthKey = date.toLocaleDateString("fr-FR", {
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });

    if (!acc[monthKey]) {
      acc[monthKey] = {
        count: 0,
        total: 0,
        monthIndex: date.getMonth() + date.getFullYear() * 12,
      };
    }

    acc[monthKey].count++;
    acc[monthKey].total += parseFloat(order.prix_total) || 0;
    return acc;
  }, {});

  // Tri des mois
  const sortedMonths = Object.entries(monthlyData)
    .sort((a, b) => a[1].monthIndex - b[1].monthIndex)
    .map(([month]) => month);

  const counts = sortedMonths.map((month) => monthlyData[month].count);
  const totals = sortedMonths.map((month) => monthlyData[month].total);

  // Statistiques par statut normalisé
  const statusCounts = orders.reduce((acc, order) => {
    const statut = normalizeStatus(order.statut);
    acc[statut] = (acc[statut] || 0) + 1;
    return acc;
  }, {});

  const statusLabels = Object.keys(statusCounts).filter(Boolean);
  const totalOrders = orders.length;
  const statusPercentages = statusLabels.map((label) =>
    totalOrders > 0 ? Math.round((statusCounts[label] / totalOrders) * 100) : 0
  );

  // Mapping des libellés d'affichage
  const getDisplayLabel = (status) => {
    const displayMap = {
      en_attente: "En attente",
      confirmee: "Confirmée",
      en_cours: "En cours",
      en_livraison: "En livraison",
      livree: "Livrée",
      retour: "Retour",
      annulee: "Annulée",
      inconnu: "Autre",
    };
    return displayMap[status] || status;
  };

  const statusColors = {
    en_attente: "#F59E0B",
    confirmee: "#3B82F6",
    en_cours: "#8B5CF6",
    en_livraison: "#8B5CF6",
    livree: "#10B981",
    retour: "#F97316",
    annulee: "#EF4444",
    inconnu: "#999999",
  };

  // Options pour le graphique radial
  const radialChartOptions = {
    chart: {
      type: "radialBar",
      height: 350,
    },
    plotOptions: {
      radialBar: {
        startAngle: 0,
        endAngle: 360,
        hollow: {
          size: "30%",
        },
        track: {
          background: "#f1f1f1",
          strokeWidth: "97%",
          margin: 5,
        },
        dataLabels: {
          name: {
            fontSize: "14px",
            offsetY: -5,
          },
          value: {
            fontSize: "16px",
            offsetY: 5,
            formatter: (val) => `${val}%`,
          },
          total: {
            show: true,
            label: "Total",
            formatter: () => "100%",
          },
        },
      },
    },
    labels: statusLabels.map((label) => getDisplayLabel(label)),
    colors: statusLabels.map((label) => statusColors[label] || "#999"),
    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
      formatter: (seriesName, opts) => {
        const label = statusLabels[opts.seriesIndex];
        return `${seriesName}: ${statusCounts[label]} (${
          statusPercentages[opts.seriesIndex]
        }%)`;
      },
      markers: {
        width: 12,
        height: 12,
      },
    },
  };

  // Options pour le graphique linéaire/barres
  const lineChartOptions = {
    chart: {
      height: 350,
      type: "line",
      toolbar: { show: false },
    },
    stroke: {
      width: [0, 4], // Largeur des traits (0 pour les colonnes, 4 pour la ligne)
      curve: "smooth",
    },
    colors: ["#3B82F6", "#10B981"], // Couleurs pour les séries
    xaxis: {
      categories: sortedMonths,
      labels: {
        style: {
          fontSize: "12px",
        },
      },
    },
    yaxis: [
      {
        title: { text: "Revenu (DH)" },
        min: 0, // Force l'axe Y à commencer à 0
      },
      {
        opposite: true,
        title: { text: "Nombre de commandes" },
        min: 0,
      },
    ],
    tooltip: {
      shared: true,
      y: {
        formatter: function (value, { seriesIndex }) {
          return seriesIndex === 0 ? `${value} DH` : `${value} commande(s)`;
        },
      },
    },
    dataLabels: { enabled: false },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: "60%",
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Monthly Activity</h2>
        </div>
        <div className="p-5">
          <ReactApexChart
            options={lineChartOptions}
            series={[
              { name: 'Revenu total', type: 'column', data: totals },
              { name: 'Nombre de commandes', type: 'line', data: counts }
            ]}
            type="line"
            height={350}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Orders Status</h2>
        </div>
        <div className="p-5">
          <ReactApexChart
            options={radialChartOptions}
            series={statusPercentages}
            type="radialBar"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default LivreurCharts;
