import React from 'react';
import Chart from 'react-apexcharts';

const RadialChart = ({ data }) => {
  if (!data) return <div>Loading chart...</div>;

  const statusMap = {
    'en_attente': 'En attente',
    'confirmée': 'Confirmée',
    'en_livraison': 'En livraison',
    'livrée': 'Livrée',
    'annulée': 'Annulée'
  };

  const options = {
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: '14px',
            formatter: function(val) {
              return statusMap[val] || val;
            }
          },
          value: {
            fontSize: '16px',
            formatter: function(val) {
              return val;
            }
          },
          total: {
            show: true,
            label: 'Total',
            formatter: function() {
              return data.status_stats.data.reduce((a, b) => a + b, 0);
            }
          }
        }
      }
    },
    labels: data.status_stats.labels,
    colors: data.status_stats.colors
  };

  return (
    <Chart
      options={options}
      series={data.status_stats.data}
      type="radialBar"
      height={350}
    />
  );
};

export default RadialChart;