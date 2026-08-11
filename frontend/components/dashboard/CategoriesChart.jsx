import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ChartCard from './ChartCard';

const CategoriesChart = ({ data }) => (
  <ChartCard title="Category Popularity" subtitle="Orders by category">
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis type="number" tick={{ fontSize: 12 }} />
        <YAxis dataKey="category" type="category" width={120} tick={{ fontSize: 12 }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="orders" fill="#FF8042" radius={[0, 4, 4, 0]} name="Orders" />
      </BarChart>
    </ResponsiveContainer>
  </ChartCard>
);

export default CategoriesChart;