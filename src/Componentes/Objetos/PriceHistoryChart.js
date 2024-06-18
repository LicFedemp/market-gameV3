import React, { useState, useEffect } from "react";
import { useGeneralContext } from "../Provider";
import "../../Stylesheets/PriceHistoryChart.css";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PriceHistoryChart = () => {
  const { state } = useGeneralContext();
  const industrias = Object.keys(state.industry);
  const [ejeX, setEjeX] = useState(state.ronda + 2);

  useEffect(() => {
    setEjeX(state.ronda + 2);
  }, [state.ronda]);

  const allPrices = [
    ...state.industry.Tech.historial,
    ...state.industry.Health.historial,
    ...state.industry.Energy.historial,
  ];

  // Calcular el valor mínimo y máximo
  const minPrice = Math.min(...allPrices);
  const maxPrice = Math.max(...allPrices);

  // Definir el rango del eje y
  const yMin = minPrice - 10;
  const yMax = maxPrice + 10;
  const arrayRondas = Array.from({ length: ejeX }, (_, i) => i + 1);

  const chartData = {
    labels: arrayRondas,
    datasets: industrias.map((industryName) => {
      const industry = state.industry[industryName];
      return {
        label: industryName,
        data: industry.historial,
        fill: false,
        backgroundColor: getColor(industryName),
        borderColor: getColor(industryName),
      };
    }),
    // [
    //   {
    //     label: "Tech",
    //     data: state.industry.Tech.historial,
    //     borderColor: "rgba(75, 192, 192, 1)",
    //     backgroundColor: "rgba(75, 192, 192, 0.2)",
    //     fill: false,
    //     tension: 0.1,
    //   },
    //   {
    //     label: "Health",
    //     data: state.industry.Health.historial,
    //     borderColor: "rgba(255, 99, 132, 1)",
    //     backgroundColor: "rgba(255, 99, 132, 0.2)",
    //     fill: false,
    //     tension: 0.1,
    //   },
    //   {
    //     label: "Energy",
    //     data: state.industry.Energy.historial,
    //     borderColor: "rgba(54, 162, 235, 1)",
    //     backgroundColor: "rgba(54, 162, 235, 0.2)",
    //     fill: false,
    //     tension: 0.1,
    //   },
    // ],
  };

  const options = {
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "Rounds",
        },
        ticks: {
          color: "black", // Asegurarse de que los números de las rondas sean visibles
        },
      },
      y: {
        display: true,
        min: yMin,
        max: yMax,
        title: {
          display: true,
          text: "Prices",
        },
        ticks: {
          color: "black",
        },
      },
    },
    plugins: {
      legend: {
        position: "bottom",
      },
      tooltip: {
        enabled: true,
      },
    },
  };
  function getColor(industryName) {
    switch (industryName) {
      case "Tech":
        return "rgba(76, 145, 255, 1)";
      case "Energy":
        return "rgba(255,99,132,1)";
      case "Health":
        return "rgba(54, 255, 155, 1)";
      default:
        return "rgba(75,192,192,1)";
    }
  }
  return (
    <div className="chart-modal-content">
      <h2>Price History of All Industries</h2>
      <div className="chart-content">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default PriceHistoryChart;
