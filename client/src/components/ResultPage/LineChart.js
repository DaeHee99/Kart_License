import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function LineChart(props) {
  const options = {
    responsive: true,
  };

  const labels = ['강주력', '주력', '1군', '2군', '3군', '4군', '일반'];

  const data = {
    labels,
    datasets: [{
      label: '개수',
      data: props.data,
      fill: false,
      borderColor: 'rgba(255, 205, 86)',
      tension: 0.1
    }]
  };

  return <Line options={options} data={data} />;
}