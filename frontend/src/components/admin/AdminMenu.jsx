import { useState, useEffect } from 'react';
import API from '../../services/api';

const AdminMenu = () => {
  const [items, setItems] = useState([]); // مینو آئٹمز کی لسٹ
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '', image: '' }); // نئی آئٹم کا ڈیٹا

  // سارے مینو آئٹمز لانے کا فنکشن
  const fetchItems = async () => {
    const res = await API.get('/menu');
    setItems(res.data.items);
  };

  useEffect(() => { fetchItems(); }, []); // صفحہ لوڈ ہوتے ہی منیو لوڈ کرو

  // فارم جمع کرانے کا ہینڈلر
  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post('/menu', form); // ایڈمن ٹوکن خودکار لگے گا (api.js میں انٹرسیپٹر ہے)
    setForm({ name: '', description: '', price: '', category: '', image: '' }); // فارم خالی کرو
    fetchItems(); // نئی لسٹ دکھاؤ
  };

  // آئٹم ڈیلیٹ کرنے کا فنکشن
  const handleDelete = async (id) => {
    await API.delete(`/menu/${id}`);
    fetchItems();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>مینو مینجمنٹ</h2>
      {/* نیا آئٹم شامل کرنے کا فارم */}
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input placeholder="نام" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
        <input placeholder="تفصیل" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
        <input type="number" placeholder="قیمت" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
        <input placeholder="کیٹیگری" value={form.category} onChange={e => setForm({...form, category: e.target.value})} />
        <input placeholder="تصویر کا URL" value={form.image} onChange={e => setForm({...form, image: e.target.value})} />
        <button type="submit">شامل کریں</button>
      </form>

      {/* مینو آئٹمز کی لسٹ */}
      <ul>
        {items.map(item => (
          <li key={item._id}>
            <strong>{item.name}</strong> - Rs. {item.price}
            <button onClick={() => handleDelete(item._id)}>ڈیلیٹ</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminMenu;