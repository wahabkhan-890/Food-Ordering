import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../services/api';

const fetchAllOrders = async () => {
  const res = await API.get('/orders/all');
  return res.data.orders;
};

const AdminOrdersPage = () => {
  const queryClient = useQueryClient();

  // Fetch all orders
  const { data: orders = [], isLoading, isError, error } = useQuery({
    queryKey: ['allOrders'],
    queryFn: fetchAllOrders,
  });

  // Mutation for status update
  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }) => API.put(`/orders/${orderId}/status`, { status }),
    onSuccess: () => {
      // Refresh orders list after successful update
      queryClient.invalidateQueries({ queryKey: ['allOrders'] });
    },
  });

  const handleStatusUpdate = (orderId, newStatus) => {
    updateStatusMutation.mutate({ orderId, status: newStatus });
  };

  if (isLoading) return <p style={{ padding: 40 }}>Loading orders...</p>;
  
  if (isError) return <p style={{ padding: 40, color: 'red' }}>Error: {error.message}</p>;

  return (
    <div style={{ padding: 30 }}>
      <h1>All Orders (Admin) 📊</h1>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20 }}>
        <thead>
          <tr style={{ background: '#333', color: 'white' }}>
            <th style={{ padding: 10 }}>Order ID</th>
            <th style={{ padding: 10 }}>Items</th>
            <th style={{ padding: 10 }}>Total</th>
            <th style={{ padding: 10 }}>Status</th>
            <th style={{ padding: 10 }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: 10 }}>#{order._id.slice(-6)}</td>
              <td style={{ padding: 10 }}>
                {order.items.map((item, idx) => (
                  <div key={idx}>{item.name} x{item.quantity}</div>
                ))}
              </td>
              <td style={{ padding: 10 }}>Rs. {order.total}</td>
              <td style={{ padding: 10 }}>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: 15,
                  background: getStatusColor(order.status),
                  color: 'white',
                  fontSize: 12
                }}>
                  {order.status}
                </span>
              </td>
              <td style={{ padding: 10 }}>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                  style={{ padding: 5 }}
                  disabled={updateStatusMutation.isLoading}
                >
                  <option>Pending</option>
                  <option>Accepted</option>
                  <option>Preparing</option>
                  <option>Ready</option>
                  <option>Delivered</option>
                  <option>Cancelled</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Helper function for status color
function getStatusColor(status) {
  const colors = {
    'Pending': '#ffc107',
    'Accepted': '#17a2b8',
    'Preparing': '#007bff',
    'Ready': '#28a745',
    'Delivered': '#28a745',
    'Cancelled': '#dc3545'
  };
  return colors[status] || '#6c757d';
}

export default AdminOrdersPage;