import React from 'react';
import Chart from 'react-apexcharts';

const Apaexlinecolumn = ({ data }) => {
  if (!data) return <div>Loading chart...</div>;

  const options = {
    chart: {
      height: 350,
      type: 'line',
      stacked: false
    },
    stroke: {
      width: [0, 4]
    },
    colors: ['#3B82F6', '#10B981'],
    xaxis: {
      categories: data.monthly_orders.months.map(m => 
        new Date(m + '-01').toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })
      )
    },
    yaxis: [
      {
        title: {
          text: "Revenue (DH)"
        }
      },
      {
        opposite: true,
        title: {
          text: "Commandes"
        }
      }
    ]
  };

  const series = [
    {
      name: 'Revenue',
      type: 'column',
      data: data.monthly_orders.totals
    },
    {
      name: 'Commandes',
      type: 'line',
      data: data.monthly_orders.counts
    }
  ];

  return (
    <Chart
      options={options}
      series={series}
      type="line"
      height={350}
    />
  );
};

export default Apaexlinecolumn;