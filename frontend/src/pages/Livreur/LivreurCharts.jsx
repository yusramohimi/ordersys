import React from 'react';
import ReactApexChart from 'react-apexcharts';

const LivreurCharts = ({ orders }) => {
  if (!orders || orders.length === 0) {
    return <div className="text-center py-10">Aucune donnée disponible</div>;
  }

  // Groupement par mois avec format français
  const monthlyData = orders.reduce((acc, order) => {
    const date = new Date(order.created_at);
    const monthKey = date.toLocaleDateString('fr-FR', { 
      month: 'short', 
      year: 'numeric',
      timeZone: 'UTC' // Ajouté pour éviter les problèmes de fuseau horaire
    });
    
    if (!acc[monthKey]) {
      acc[monthKey] = { 
        count: 0, 
        total: 0,
        monthIndex: date.getMonth() + date.getFullYear() * 12 // Pour le tri
      };
    }
    
    acc[monthKey].count++;
    acc[monthKey].total += parseFloat(order.prix_total) || 0; // Conversion sécurisée
    return acc;
  }, {});

  // Tri des mois par ordre chronologique
  const sortedMonths = Object.entries(monthlyData)
    .sort((a, b) => a[1].monthIndex - b[1].monthIndex)
    .map(([month]) => month);

  const counts = sortedMonths.map(month => monthlyData[month].count);
  const totals = sortedMonths.map(month => monthlyData[month].total);

  // Statistiques par statut
  const statusCounts = orders.reduce((acc, order) => {
    const statut = order.statut?.toLowerCase() || 'inconnu';
    acc[statut] = (acc[statut] || 0) + 1;
    return acc;
  }, {});

  const statusLabels = Object.keys(statusCounts);
  const statusData = Object.values(statusCounts);

  const statusColors = {
    'en_attente': '#F59E0B',
    'confirmee': '#3B82F6',
    'en_livraison': '#8B5CF6',
    'livrée': '#10B981',
    'livree': '#10B981',
    'annulée': '#EF4444',
    'annulee': '#EF4444',
    'inconnu': '#999999'
  };

  // Options pour le graphique linéaire/barres
  const lineChartOptions = {
    chart: {
      height: 350,
      type: 'line',
      toolbar: { show: false }
    },
    stroke: { 
      width: [0, 4], // Largeur des traits (0 pour les colonnes, 4 pour la ligne)
      curve: 'smooth' 
    },
    colors: ['#3B82F6', '#10B981'], // Couleurs pour les séries
    xaxis: { 
      categories: sortedMonths,
      labels: {
        style: {
          fontSize: '12px'
        }
      }
    },
    yaxis: [
      { 
        title: { text: "Revenu (DH)" },
        min: 0 // Force l'axe Y à commencer à 0
      },
      { 
        opposite: true, 
        title: { text: "Nombre de commandes" },
        min: 0
      }
    ],
    tooltip: { 
      shared: true,
      y: {
        formatter: function(value, { seriesIndex }) {
          return seriesIndex === 0 
            ? `${value} DH` 
            : `${value} commande(s)`;
        }
      }
    },
    dataLabels: { enabled: false },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '60%'
      }
    }
  };

// Options pour le graphique radial (version complète 360° avec légende en bas)
const radialChartOptions = {
  chart: {
    type: 'radialBar',
    height: 350,
  },
  plotOptions: {
    radialBar: {
      startAngle: 0,
      endAngle: 360,
      hollow: {
        size: '30%',
      },
      track: {
        background: '#f1f1f1',
        strokeWidth: '97%',
        margin: 5,
      },
      dataLabels: {
        name: {
          fontSize: '14px',
          color: undefined,
          offsetY: -5,
        },
        value: {
          fontSize: '16px',
          color: undefined,
          offsetY: 5,
          formatter: function(val) {
            return val + '%';
          }
        },
        total: {
          show: true,
          label: 'Total',
          color: '#373d3f',
          formatter: function(w) {
            return w.globals.seriesTotals.reduce((a, b) => a + b, 0) + '%';
          }
        }
      }
    }
  },
  stroke: {
    lineCap: 'round'
  },
  labels: statusLabels.map(label => ({
    'en_attente': 'En attente',
    'confirmee': 'Confirmée',
    'en_livraison': 'En livraison',
    'livrée': 'Livrée',
    'livree': 'Livrée',
    'annulée': 'Annulée',
    'annulee': 'Annulée',
    'inconnu': 'Statut inconnu'
  }[label])),
  colors: statusLabels.map(label => statusColors[label] || '#999'),
  legend: {
    show: true,
    position: 'bottom',
    horizontalAlign: 'center',
    floating: false,
    fontSize: '12px',
    fontWeight: 500,
    markers: {
      width: 12,
      height: 12,
      radius: 12,
      offsetX: -5
    },
    itemMargin: {
      horizontal: 10,
      vertical: 5
    },
    formatter: function(seriesName, opts) {
      return seriesName + ': ' + opts.w.globals.series[opts.seriesIndex] + '%';
    }
  },
  responsive: [{
    breakpoint: 768,
    options: {
      chart: {
        height: 400
      },
      legend: {
        position: 'bottom',
        horizontalAlign: 'center'
      }
    }
  }]
};

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Activité Mensuelle</h2>
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
          <h2 className="text-lg font-semibold text-gray-800">Statut des Commandes</h2>
        </div>
        <div className="p-5">
          <ReactApexChart
            options={radialChartOptions}
            series={statusData}
            type="radialBar"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default LivreurCharts;