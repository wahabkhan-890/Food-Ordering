import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../services/api';
import useCartStore from '../store/cartStore';

const fetchFavorites = async () => {
  const res = await API.get('/favorites');
  return res.data.favorites;
};

const FavoritesPage = () => {
  const queryClient = useQueryClient();
  const addToCart = useCartStore(state => state.addToCart);

  const { data: favorites = [], isLoading, isError } = useQuery({
    queryKey: ['favorites'],
    queryFn: fetchFavorites,
  });

  const removeMutation = useMutation({
    mutationFn: (itemId) => API.delete(`/favorites/${itemId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favorites'] }),
  });

  if (isLoading) return <p style={{ padding: 40, textAlign: 'center' }}>Loading favorites...</p>;
  if (isError) return <p style={{ padding: 40, textAlign: 'center', color: 'red' }}>Error loading favorites</p>;

  if (favorites.length === 0) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h2>No Favorites Yet ❤️</h2>
        <p>Browse menu and tap the heart icon to add favorites.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 30 }}>
      <h1 style={{ textAlign: 'center' }}>My Favorites ❤️</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 20, marginTop: 20 }}>
        {favorites.map(item => (
          <div key={item._id} style={{
            background: 'white',
            borderRadius: 12,
            padding: 20,
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <img
              src={item.image || 'https://via.placeholder.com/250'}
              alt={item.name}
              style={{ width: '100%', height: 150, objectFit: 'cover', borderRadius: 8 }}
            />
            <h3 style={{ margin: '10px 0 5px 0' }}>{item.name}</h3>
            <p style={{ color: '#888', fontSize: 14 }}>{item.description}</p>
            <p style={{ fontSize: 12, color: '#999' }}>Category: {item.category}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
              <strong style={{ fontSize: 20, color: '#0088FE' }}>Rs. {item.price}</strong>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => addToCart(item)}
                  style={{ padding: '8px 12px', background: '#00C49F', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}
                >
                  🛒
                </button>
                <button
                  onClick={() => removeMutation.mutate(item._id)}
                  style={{ padding: '8px 12px', background: '#ff4444', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}
                >
                  ❌
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;