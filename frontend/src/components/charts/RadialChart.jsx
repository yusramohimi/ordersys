import React from "react";
import ReactApexChart from "react-apexcharts";

const RadialChartData = {
  series: [44, 55, 67, 83],
  options: {
    chart: {
      background: "#ffffff",
      foreColor: "#4B5563", // gray-700
    },
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: "22px",
          },
          value: {
            fontSize: "16px",
          },
          total: {
            show: true,
            label: "Total",
            formatter: function () {
              return 249;
            },
          },
        },
      },
    },
    series: [65, 25, 10], // pour correspondre à ta légende
    labels: ["Direct", "Organic", "Referral"],
    colors: ["#3b82f6", "#22c55e", "#8b5cf6"], // blue-500, green-500, purple-500
  },
};

const RadialChart = () => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 h-full w-full">
      <ReactApexChart
        options={RadialChartData.options}
        series={RadialChartData.series}
        type="radialBar"
        height="100%"
        width="100%"
      />
    </div>
  );
};

export default RadialChart;
