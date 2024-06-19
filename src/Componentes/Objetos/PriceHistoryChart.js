import React, { useState, useEffect } from "react";
import { useGeneralContext } from "../Provider";
import "../../Stylesheets/PriceHistoryChart.css";
import { Line } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
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
  Legend,
  ChartDataLabels
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
        datalabels: {
          align: "end",
          anchor: "end",
          color: "black",
          borderColor: "black",
          font: {
            size: 15, // Tamaño de la letra
            weight: "bold", // Peso de la letra
          },
        },
      };
    }),
  };

  const options = {
    plugins: {
      legend: {
        position: "bottom",
      },
      datalabels: {
        display: true,
        color: "black",
        font: {
          size: 15, // Tamaño de la letra
          weight: "bold", // Peso de la letra
        },
        offset: 4, // Desplazamiento en píxeles
        formatter: (value) => value,
      },
    },
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
        position: "top",
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
      <div className="chart-content">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default PriceHistoryChart;
