import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function PieChart({ name, data }) {
  const options = {
    responsive: true,
  };

  const labels = ["강주력", "주력", "1군", "2군", "3군", "4군", "일반"];
  const backgroundColor = [
    "rgb(255, 99, 132)",
    "rgb(255, 159, 64)",
    "rgb(255, 205, 86)",
    "rgb(75, 192, 192)",
    "rgb(54, 162, 235)",
    "rgb(153, 102, 255)",
    "rgb(201, 203, 207)",
  ];

  if (data[7]) {
    labels[7] = "선택 안함";
    backgroundColor[7] = "rgba(0, 0, 0, 0.3)";
  }

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: name,
        data: data,
        backgroundColor: backgroundColor,
        hoverOffset: 4,
      },
    ],
  };

  return <Pie options={options} data={chartData} />;
}

export default PieChart;
