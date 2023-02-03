import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart(props) {
  const options = {
    responsive: true,
  };
  
  let data = {
    labels: ['강주력', '주력', '1군', '2군', '3군', '4군', '일반'],
    datasets: [{
      label: props.name,
      data: props.data,
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(255, 159, 64)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
        'rgb(54, 162, 235)',
        'rgb(153, 102, 255)',
        'rgb(201, 203, 207)'
      ],
      hoverOffset: 4
    }]
  };

	return <Pie options={options} data={data} />
}