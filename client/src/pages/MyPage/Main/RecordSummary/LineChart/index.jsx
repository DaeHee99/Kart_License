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
import { Line } from "react-chartjs-2";
import { MDBCard, MDBCardBody } from "mdb-react-ui-kit";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function LineChart({ label, name, data, color }) {
  const options = {
    responsive: true,
    scales: {
      y: {
        type: "category",
        labels: ["강주력", "주력", "1군", "2군", "3군", "4군", "일반"],
      },
    },
  };

  const chartData = {
    labels: label,
    datasets: [
      {
        label: name,
        data: data,
        fill: false,
        borderColor: color,
        tension: 0.1,
      },
    ],
  };

  return (
    <MDBCard className="shadow-5 w-100 border border-secondary">
      <MDBCardBody>
        <Line options={options} data={chartData} height={200} />
      </MDBCardBody>
    </MDBCard>
  );
}

export default LineChart;
