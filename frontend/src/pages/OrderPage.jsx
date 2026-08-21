import { useQuery } from '@tanstack/react-query';
import API from '../services/api';

// Fetch function — TanStack ke liye
const fetchMyOrders = async () => {
  const res = await API.get('/orders/my');
  return res.data.orders;
};

const OrdersPage = () => {
  const { data: orders = [], isLoading, isError, error } = useQuery({
    queryKey: ['myOrders'],
    queryFn: fetchMyOrders,
  });

  if (isLoading) return <p style={{ padding: 40 }}>Loading orders...</p>;
  
  if (isError) return <p style={{ padding: 40, color: 'red' }}>Error: {error.message}</p>;

  if (orders.length === 0) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h2>No Orders Yet 📦</h2>
        <p>Start ordering from the menu!</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 30, maxWidth: 900, margin: 'auto' }}>
      <h1>My Orders 📋</h1>
      
      {orders.map(order => (
        <div key={order._id} style={{
          border: '1px solid #ddd',
          padding: 20,
          marginBottom: 15,
          borderRadius: 8,
          background: '#f9f9f9'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h3>Order #{order._id.slice(-6)}</h3>
            <span style={{
              padding: '5px 15px',
              borderRadius: 20,
              background: order.status === 'Delivered' ? '#d4edda' : '#fff3cd',
              color: order.status === 'Delivered' ? '#155724' : '#856404',
              fontWeight: 'bold'
            }}>
              {order.status}
            </span>
          </div>
          {order.status === 'Cancelled' && order.cancellation_reason && (
  <p style={{ color: 'red', marginTop: 10 }}>
    Cancellation Reason: {order.cancellation_reason}
  </p>
)}
          
          <div style={{ marginTop: 10 }}>
            {order.items.map((item, idx) => (
              <p key={idx}>{item.name} x {item.quantity} = Rs. {item.price * item.quantity}</p>
            ))}
          </div>
          
          <h3 style={{ marginTop: 10 }}>Total: Rs. {order.total}</h3>
          <small>Ordered on: {new Date(order.created_at).toLocaleDateString()}</small>
        </div>
      ))}
    </div>
  );
};

export default OrdersPage;