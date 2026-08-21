import { useQuery } from '@tanstack/react-query';
import API from '../services/api';
import SummaryCard from '../components/dashboard/SummaryCard';
import LoadingSpinner from '../components/dashboard/LoadingSpinner';
import ErrorMessage from '../components/dashboard/ErrorMessage';
import DailyOrdersChart from '../components/dashboard/DailyOrdersChart';
import TopItemsChart from '../components/dashboard/TopItemsChart';
import PeakHoursChart from '../components/dashboard/PeakHoursChart';
import CategoriesChart from '../components/dashboard/CategoriesChart';
import PredictionChart from '../components/dashboard/PredictionChart';

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

const fetchPredictions = async () => {
  const res = await API.get('/predictions/next-7-days');
  return res.data;
};

const fetchTodaySummary = async () => {
  const res = await API.get('/analytics/summary');
  return res.data.summary;
};

const AdminDashboard = () => {
  const dailyOrdersQuery = useQuery({ queryKey: ['dailyOrders'], queryFn: fetchDailyOrders });
  const topItemsQuery = useQuery({ queryKey: ['topItems'], queryFn: fetchTopItems });
  const peakHoursQuery = useQuery({ queryKey: ['peakHours'], queryFn: fetchPeakHours });
  const categoriesQuery = useQuery({ queryKey: ['categories'], queryFn: fetchCategories });
  const predictionQuery = useQuery({ queryKey: ['predictions'], queryFn: fetchPredictions });
  const summaryQuery = useQuery({ queryKey: ['todaySummary'], queryFn: fetchTodaySummary });

  if (dailyOrdersQuery.isLoading || topItemsQuery.isLoading || 
      peakHoursQuery.isLoading || categoriesQuery.isLoading || 
      predictionQuery.isLoading || summaryQuery.isLoading) {
    return <LoadingSpinner message="Loading Dashboard..." />;
  }

  if (dailyOrdersQuery.isError || topItemsQuery.isError || 
      peakHoursQuery.isError || categoriesQuery.isError || 
      predictionQuery.isError || summaryQuery.isError) {
    return <ErrorMessage message="Failed to load dashboard. Please login as admin." />;
  }

  const dailyOrders = dailyOrdersQuery.data || [];
  const topItems = topItemsQuery.data || [];
  const peakHours = peakHoursQuery.data || [];
  const categories = categoriesQuery.data || [];
  const predictionData = predictionQuery.data || null;
  const summary = summaryQuery.data || {};

  return (
    <div style={{ padding: 30, background: '#f5f5f5', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', marginBottom: 30, color: '#333' }}>
        Admin Dashboard 📊
      </h1>

      {/* Today's Summary Cards */}
      <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginBottom: 30, flexWrap: 'wrap' }}>
        <SummaryCard title="Today's Orders" value={summary.today_orders || 0} color="#0088FE" icon="📦" />
        <SummaryCard title="Today's Revenue" value={`Rs. ${summary.today_revenue || 0}`} color="#00C49F" icon="💰" />
        <SummaryCard title="Pending Orders" value={summary.pending_orders || 0} color="#FFBB28" icon="⏳" />
        <SummaryCard title="Total Customers" value={summary.total_customers || 0} color="#FF8042" icon="👥" />
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: 20 }}>
        <DailyOrdersChart data={dailyOrders} />
        <TopItemsChart data={topItems} />
        <PeakHoursChart data={peakHours} />
        <CategoriesChart data={categories} />
        
        {predictionData && predictionData.predictions ? (
          <PredictionChart data={predictionData} />
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 30, background: '#fff', borderRadius: 10 }}>
            <p>No prediction data available. Train the model first.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;