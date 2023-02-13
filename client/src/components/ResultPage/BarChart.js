import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function BarChart(props) {
  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    },
    indexAxis: 'y',
  };
  
  let labels = ['강주력', '주력', '1군', '2군', '3군', '4군', '일반'];
  let backgroundColor = [
    'rgba(255, 99, 132, 0.2)',
    'rgba(255, 159, 64, 0.2)',
    'rgba(255, 205, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(201, 203, 207, 0.2)'
  ];
  let borderColor = [
    'rgb(255, 99, 132)',
    'rgb(255, 159, 64)',
    'rgb(255, 205, 86)',
    'rgb(75, 192, 192)',
    'rgb(54, 162, 235)',
    'rgb(153, 102, 255)',
    'rgb(201, 203, 207)'
  ];

  if(props.data[7]) {
    labels[7] = '선택 안함';
    backgroundColor[7] = 'rgba(0, 0, 0, 0.3)';
    borderColor[7] = 'rgba(0, 0, 0)';
  }
  
  const data = {
    labels,
    datasets: [{
      label: props.name,
      data: props.data,
      backgroundColor: backgroundColor,
      borderColor: borderColor,
      borderWidth: 1
    }],
  };

  return <Bar options={options} data={data} className='border border-dark' height={190}/>;
}
