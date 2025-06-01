import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const ClientsByRegionChart = () => {
  const [categories, setCategories] = useState([]);
  const [seriesData, setSeriesData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/clients/regions")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.map(item => item.region));
        setSeriesData(data.map(item => item.total));
      })
      .catch((error) => {
        console.error("Erreur API clients/regions :", error);
      });
  }, []);

  const chartData = {
    series: [{ data: seriesData }],
    options: {
      chart: { toolbar: { show: false } },
      plotOptions: { bar: { horizontal: true } },
      dataLabels: { enabled: false },
      colors: ["#3498db"],
      grid: { borderColor: "#f1f1f1" },
      xaxis: { categories: categories },
    },
  };

  return (
    <div className="col-4">
      <div className="card shadow-sm p-3">
        <h5 className="text-center mb-3">Clients par Région</h5>
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="bar"
          height={350}
        />
      </div>
    </div>
  );
};

export default ClientsByRegionChart;
