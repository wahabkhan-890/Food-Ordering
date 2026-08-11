import { useQuery } from '@tanstack/react-query';
import API from '../services/api';
import SummaryCard from '../components/dashboard/SummaryCard';
import LoadingSpinner from '../components/dashboard/LoadingSpinner';
import ErrorMessage from '../components/dashboard/ErrorMessage';
import DailyOrdersChart from '../components/dashboard/DailyOrdersChart';
import TopItemsChart from '../components/dashboard/TopItemsChart';
import PeakHoursChart from '../components/dashboard/PeakHoursChart';
import CategoriesChart from '../components/dashboard/CategoriesChart';

// Fetch functions
const fetchDailyOrders = async () => {
  const res = await API.get('/analytics/daily-orders?days=7');
  return res.data.daily_orders.map(item => ({
    date: item._id,
    orders: item.count,
    revenue: item.revenue || 0
  }));
};

const fetchTopItems = async () => {
  const res = await API.get('/analytics/top-items?limit=5');
  return res.data.top_items.map(item => ({
    name: item._id,
    quantity: item.total_quantity
  }));
};

const fetchPeakHours = async () => {
  const res = await API.get('/analytics/peak-hours');
  return res.data.peak_hours.map(item => ({
    hour: `${item.hour}:00`,
    orders: item.count
  }));
};

const fetchCategories = async () => {
  const res = await API.get('/analytics/categories');
  return res.data.categories.map(item => ({
    category: item._id,
    orders: item.count
  }));
};

const AdminDashboard = () => {
  const dailyOrdersQuery = useQuery({ queryKey: ['dailyOrders'], queryFn: fetchDailyOrders });
  const topItemsQuery = useQuery({ queryKey: ['topItems'], queryFn: fetchTopItems });
  const peakHoursQuery = useQuery({ queryKey: ['peakHours'], queryFn: fetchPeakHours });
  const categoriesQuery = useQuery({ queryKey: ['categories'], queryFn: fetchCategories });

  // Loading state — using reusable component
  if (dailyOrdersQuery.isLoading || topItemsQuery.isLoading || 
      peakHoursQuery.isLoading || categoriesQuery.isLoading) {
    return <LoadingSpinner message="Loading Dashboard..." />;
  }

  // Error state — using reusable component
  if (dailyOrdersQuery.isError || topItemsQuery.isError || 
      peakHoursQuery.isError || categoriesQuery.isError) {
    return <ErrorMessage message="Failed to load dashboard. Please login as admin." />;
  }

  const dailyOrders = dailyOrdersQuery.data || [];
  const topItems = topItemsQuery.data || [];
  const peakHours = peakHoursQuery.data || [];
  const categories = categoriesQuery.data || [];

  return (
    <div style={{ padding: 30, background: '#f5f5f5', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', marginBottom: 30, color: '#333' }}>
        Admin Dashboard 📊
      </h1>

      {/* Summary Cards */}
      <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginBottom: 30, flexWrap: 'wrap' }}>
        <SummaryCard 
          title="Total Orders" 
          value={dailyOrders.reduce((sum, d) => sum + d.orders, 0)} 
          color="#0088FE" 
          icon="📦"
        />
        <SummaryCard 
          title="Top Item" 
          value={topItems[0]?.name || 'N/A'} 
          color="#00C49F" 
          icon="⭐"
        />
        <SummaryCard 
          title="Peak Hour" 
          value={peakHours.reduce((max, h) => h.orders > max.orders ? h : max, { orders: 0 }).hour || 'N/A'} 
          color="#FFBB28" 
          icon="🕐"
        />
        <SummaryCard 
          title="Categories" 
          value={categories.length} 
          color="#FF8042" 
          icon="🏷️"
        />
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: 20 }}>
        <DailyOrdersChart data={dailyOrders} />
        <TopItemsChart data={topItems} />
        <PeakHoursChart data={peakHours} />
        <CategoriesChart data={categories} />
      </div>
    </div>
  );
};

export default AdminDashboard;