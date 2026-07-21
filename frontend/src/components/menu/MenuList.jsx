import { useState, useEffect } from 'react';
import API from '../../services/api';

const MenuList = () => {
  const [items, setItems] = useState([]); // مینو آئٹمز

  useEffect(() => {
    API.get('/menu').then(res => setItems(res.data.items));
  }, []);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, padding: 20 }}>
      {items.map(item => (
        <div key={item._id} style={{ border: '1px solid #ccc', padding: 10, width: 200 }}>
          <img src={item.image || 'https://via.placeholder.com/150'} alt={item.name} style={{ width: '100%' }} />
          <h3>{item.name}</h3>
          <p>{item.description}</p>
          <strong>Rs. {item.price}</strong>
          <p><small>کیٹیگری: {item.category}</small></p>
        </div>
      ))}
    </div>
  );
};

export default MenuList;