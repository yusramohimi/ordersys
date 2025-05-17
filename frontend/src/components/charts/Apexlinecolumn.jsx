import React, { useMemo } from "react";
import ReactApexChart from "react-apexcharts";

const Apaexlinecolumn = () => {
  const chartData = useMemo(() => ({
    series: [
      {
        name: "Net Profit",
        data: [46, 57, 59, 54, 62, 58, 64, 60, 66],
      },
      {
        name: "Revenue",
        data: [74, 83, 102, 97, 86, 106, 93, 114, 94],
      },
      {
        name: "Free Cash Flow",
        data: [37, 42, 38, 26, 47, 50, 54, 55, 43],
      },
    ],
    options: {
      chart: {
        type: "bar",
        toolbar: { show: false },
        zoom: { enabled: false },
        background: "#ffffff", // Fond blanc du graphique
        foreColor: "#4B5563", // texte gris (tailwind gray-700)
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "45%",
          endingShape: "rounded",
        },
      },
      dataLabels: { enabled: false },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      colors: ["#e5ecf8", "#3d8ef8", "#34c38f"],
      xaxis: {
        categories: ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
        axisBorder: { color: "#e0e0e0" },
        axisTicks: { color: "#e0e0e0" },
      },
      yaxis: {
        title: { text: "$ (thousands)" },
      },
      fill: { opacity: 1 },
      tooltip: {
        y: {
          formatter: (val) => `$${val} thousands`,
        },
      },
      grid: {
        borderColor: "#f1f1f1",
        strokeDashArray: 4,
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        fontSize: "14px",
      },
    },
  }), []);

  return (
    <div className="h-full bg-white rounded-xl shadow-md p-4">
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="bar"
        height="100%"  // Prend la hauteur du conteneur parent
        width="100%"
      />
    </div>
  );
};

export default Apaexlinecolumn;
