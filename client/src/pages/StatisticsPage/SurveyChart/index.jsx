import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { memo } from "react";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function SurveyChart({ title, data }) {
  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    indexAxis: "y",
  };

  const labels = data.map((item) => item.name);
  const backgroundColor = [
    "rgba(153, 102, 255, 0.2)",
    "rgba(54, 162, 235, 0.2)",
    "rgba(201, 203, 207, 0.2)",
    "rgba(255, 159, 64, 0.2)",
    "rgba(255, 99, 132, 0.2)",
  ];
  const borderColor = [
    "rgb(153, 102, 255)",
    "rgb(54, 162, 235)",
    "rgb(201, 203, 207)",
    "rgb(255, 159, 64)",
    "rgb(255, 99, 132)",
  ];

  const chartData = {
    labels,
    datasets: [
      {
        label: title,
        data: data.map((item) => item.count),
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 1,
      },
    ],
  };

  return (
    <Bar
      options={options}
      data={chartData}
      className="border border-dark"
      height={190}
    />
  );
}

export default memo(SurveyChart);
