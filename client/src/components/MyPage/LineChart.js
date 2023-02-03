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
import {
  MDBCard,
  MDBCardBody,
} from 'mdb-react-ui-kit';

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
    scales: {
      y: {
        type: 'category',
        labels: ["강주력", "주력", "1군", "2군", "3군", "4군", "일반"]
      },
    }
  };

  const data = {
    labels : props.label,
    datasets: [{
      label: props.name,
      data: props.data,
      fill: false,
      borderColor: props.color,
      tension: 0.1
    }]
  };

  return (
    <MDBCard className='shadow-5 w-100 border border-secondary'>
      <MDBCardBody>
        <Line options={options} data={data} height={200}/>
      </MDBCardBody>
    </MDBCard>
  )
}