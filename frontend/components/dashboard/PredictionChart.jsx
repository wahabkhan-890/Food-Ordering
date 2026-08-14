import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ChartCard from './ChartCard';

const PredictionChart = ({ data }) => {
  // Combine actual + predicted for chart
  const chartData = [];

  // Add actual data
  data.actual_last_7_days?.forEach(item => {
    chartData.push({
      date: item._id,
      actual: item.count,
      predicted: null,
      type: 'Actual'
    });
  });

  // Add predicted data
  data.predictions?.forEach(item => {
    chartData.push({
      date: item.date,
      actual: null,
      predicted: item.predicted_orders,
      type: 'Predicted'
    });
  });

  return (
    <ChartCard title="Demand Prediction" subtitle="Next 7 Days Forecast">
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#0088FE"
            strokeWidth={2}
            dot={{ r: 4 }}
            name="Actual Orders"
            connectNulls={false}
          />
          <Line
            type="monotone"
            dataKey="predicted"
            stroke="#FF8042"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ r: 4 }}
            name="Predicted Orders"
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default PredictionChart;