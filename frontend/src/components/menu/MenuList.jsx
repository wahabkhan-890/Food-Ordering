import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import API from '../../services/api';
import useCartStore from '../../store/cartStore';

const MenuList = () => {
  const [searchParams] = useSearchParams();
  const restaurantId = searchParams.get('restaurant_id') || '';
  
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const queryClient = useQueryClient();
  const addToCart = useCartStore(state => state.addToCart);

  // Debounce search
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      setDebouncedSearch(e.target.value);
    }, 300);
  };

  // Fetch menu with filters
  const fetchMenu = async () => {
    const params = new URLSearchParams();
    if (restaurantId) params.append('restaurant_id', restaurantId);
    if (debouncedSearch) params.append('search', debouncedSearch);
    if (selectedCategory) params.append('category', selectedCategory);
    const res = await API.get(`/menu?${params.toString()}`);
    return res.data.items;
  };

  // Fetch categories
  const fetchCategories = async () => {
    const params = new URLSearchParams();
    if (restaurantId) params.append('restaurant_id', restaurantId);
    const res = await API.get(`/menu/categories?${params.toString()}`);
    return res.data.categories;
  };

  // Fetch favorites
  const favoritesQuery = useQuery({
    queryKey: ['myFavorites'],
    queryFn: async () => {
      const res = await API.get('/favorites');
      return res.data.favorites.map(f => f._id);
    },
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: ({ itemId, isFav }) => {
      if (isFav) return API.delete(`/favorites/${itemId}`);
      return API.post('/favorites', { item_id: itemId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myFavorites'] });
    },
  });

  const menuQuery = useQuery({
    queryKey: ['menu', restaurantId, debouncedSearch, selectedCategory],
    queryFn: fetchMenu,
  });

  const categoriesQuery = useQuery({
    queryKey: ['categories', restaurantId],
    queryFn: fetchCategories,
  });

  const items = menuQuery.data || [];
  const categories = categoriesQuery.data || [];
  const favoriteIds = new Set(favoritesQuery.data || []);

  return (
    <div style={{ padding: 30 }}>
      <h1 style={{ textAlign: 'center' }}>Menu 🍔</h1>

      {/* Search Bar */}
      <div style={{ maxWidth: 500, margin: '20px auto' }}>
        <input
          type="text"
          placeholder="Search for food..."
          value={search}
          onChange={handleSearchChange}
          style={{
            width: '100%',
            padding: '12px 20px',
            borderRadius: 25,
            border: '2px solid #ddd',
            fontSize: 16,
          }}
        />
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 30 }}>
        <button
          onClick={() => setSelectedCategory('')}
          style={{
            padding: '8px 20px',
            borderRadius: 20,
            border: selectedCategory === '' ? '2px solid #0088FE' : '1px solid #ddd',
            background: selectedCategory === '' ? '#0088FE' : 'white',
            color: selectedCategory === '' ? 'white' : '#333',
            cursor: 'pointer',
          }}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '8px 20px',
              borderRadius: 20,
              border: selectedCategory === cat ? '2px solid #0088FE' : '1px solid #ddd',
              background: selectedCategory === cat ? '#0088FE' : 'white',
              color: selectedCategory === cat ? 'white' : '#333',
              cursor: 'pointer',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {menuQuery.isLoading && <p style={{ textAlign: 'center' }}>Loading menu...</p>}

      {/* Error State */}
      {menuQuery.isError && <p style={{ textAlign: 'center', color: 'red' }}>Error loading menu</p>}

      {/* Empty State */}
      {!menuQuery.isLoading && !menuQuery.isError && items.length === 0 && (
        <p style={{ textAlign: 'center', fontSize: 18, color: '#888' }}>No items found</p>
      )}

      {/* Menu Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 20 }}>
        {items.map(item => {
          const isFav = favoriteIds.has(item._id);
          return (
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
                style={{ width: '100%', height: 150, objectFit: 'cover', borderRadius: 8, marginBottom: 10 }}
              />
              <h3 style={{ margin: '10px 0 5px 0' }}>{item.name}</h3>
              <p style={{ color: '#888', fontSize: 14, flex: 1 }}>{item.description}</p>
              <p style={{ fontSize: 12, color: '#999', margin: '5px 0' }}>
                Category: {item.category}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                <strong style={{ fontSize: 20, color: '#0088FE' }}>Rs. {item.price}</strong>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  {/* Heart Button — INSIDE card */}
                  <button
                    onClick={() => toggleFavoriteMutation.mutate({ itemId: item._id, isFav })}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: 22,
                      cursor: 'pointer',
                      color: isFav ? '#ff4444' : '#ccc',
                    }}
                  >
                    {isFav ? '❤️' : '🤍'}
                  </button>
                  {/* Add to Cart */}
                  <button
                    onClick={() => addToCart(item)}
                    style={{
                      padding: '8px 15px',
                      background: '#00C49F',
                      color: 'white',
                      border: 'none',
                      borderRadius: 6,
                      cursor: 'pointer',
                      fontWeight: 'bold',
                    }}
                  >
                    Add to Cart 🛒
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MenuList;