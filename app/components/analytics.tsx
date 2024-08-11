import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function AnalyticsPage() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const conversations = [0, 1, 2, 3, 4, 5];

  const data = {
    labels: days,
    datasets: [
      {
        label: 'Conversations',
        data: days.map(() => null),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Days'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Conversations'
        },
        ticks: {
          stepSize: 1,
          max: Math.max(...conversations)
        }
      }
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Analytics</h2>
      <p className="mb-4">View your analytics and statistics here.</p>
      <div style={{ width: '100%', height: '400px' }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}