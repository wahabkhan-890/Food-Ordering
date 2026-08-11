import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ChartCard from './ChartCard';

const DailyOrdersChart = ({ data }) => (
  <ChartCard title="Daily Orders" subtitle="Last 7 days">
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="orders" fill="#0088FE" radius={[4, 4, 0, 0]} name="Orders" />
      </BarChart>
    </ResponsiveContainer>
  </ChartCard>
);

export default DailyOrdersChart;