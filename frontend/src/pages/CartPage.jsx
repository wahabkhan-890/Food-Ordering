import useCartStore from '../store/cartStore';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  // Get cart state and actions from Zustand store
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity, getTotal, clearCart } = useCartStore();
  const navigate = useNavigate();

  // Place order function
  const handlePlaceOrder = async () => {
    try {
      const items = cart.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }));
      
      const total = getTotal();
      
      const res = await API.post('/orders', { items, total });
      alert(res.data.message);
      clearCart(); // Empty cart after successful order
      navigate('/orders'); // Redirect to order history
    } catch (err) {
      alert(err.response?.data?.message || 'Order failed');
    }
  };

  // If cart is empty
  if (cart.length === 0) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h2>Cart is Empty 🛒</h2>
        <p>Go to menu and add some items!</p>
        <button onClick={() => navigate('/menu')} style={{ padding: '10px 20px', marginTop: 10 }}>
          Browse Menu
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 30, maxWidth: 800, margin: 'auto' }}>
      <h1>My Cart 🛒</h1>
      
      {/* Cart Items List */}
      <div style={{ marginTop: 20 }}>
        {cart.map(item => (
          <div key={item._id} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            border: '1px solid #ddd',
            padding: 15,
            marginBottom: 10,
            borderRadius: 8
          }}>
            <div>
              <h3>{item.name}</h3>
              <p>Rs. {item.price} x {item.quantity} = Rs. {item.price * item.quantity}</p>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <button onClick={() => decreaseQuantity(item._id)} style={{ padding: '5px 10px' }}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => increaseQuantity(item._id)} style={{ padding: '5px 10px' }}>+</button>
              <button onClick={() => removeFromCart(item._id)} style={{ padding: '5px 10px', background: 'red', color: 'white', border: 'none', borderRadius: 4 }}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Total + Place Order */}
      <div style={{ marginTop: 30, borderTop: '2px solid #333', paddingTop: 20 }}>
        <h2>Total: Rs. {getTotal()}</h2>
        <button onClick={handlePlaceOrder} style={{
          padding: '12px 40px',
          background: 'green',
          color: 'white',
          border: 'none',
          borderRadius: 8,
          fontSize: 18,
          marginTop: 10,
          cursor: 'pointer'
        }}>
          Place Order 
        </button>
      </div>
    </div>
  );
};

export default CartPage;