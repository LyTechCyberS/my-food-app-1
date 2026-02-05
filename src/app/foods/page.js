'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '../categories/categories.css';

export default function Foods() {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: ''
  });
  const [editId, setEditId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/login');
    else {
      fetchFoods();
      fetchCategories();
    }
  }, []);

  const fetchFoods = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/foods', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    setFoods(data);
  };

  const fetchCategories = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/categories', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    setCategories(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const url = editId ? `/api/foods/${editId}` : '/api/foods';
    const method = editId ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });

    setFormData({ name: '', description: '', price: '', category_id: '' });
    setEditId(null);
    fetchFoods();
  };

  const handleEdit = (food) => {
    setEditId(food.id);
    setFormData({
      name: food.name,
      description: food.description,
      price: food.price,
      category_id: food.category_id
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this food?')) return;
    
    const token = localStorage.getItem('token');
    await fetch(`/api/foods/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchFoods();
  };

  return (
    <div className="page-container">
      <nav className="page-nav">
        <Link href="/dashboard">← Back to Dashboard</Link>
        <h2>🍕 Foods</h2>
      </nav>

      <div className="page-content">
        <div className="form-card">
          <h3>{editId ? 'Edit Food' : 'Add New Food'}</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Food Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows="3"
              style={{width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #ddd', marginBottom: '15px'}}
            />
            <input
              type="number"
              step="0.01"
              placeholder="Price"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              required
            />
            <select
              value={formData.category_id}
              onChange={(e) => setFormData({...formData, category_id: e.target.value})}
              required
              style={{width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #ddd', marginBottom: '15px'}}
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <div className="form-buttons">
              <button type="submit" className="btn-primary">
                {editId ? 'Update' : 'Add'}
              </button>
              {editId && (
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={() => {
                    setEditId(null);
                    setFormData({ name: '', description: '', price: '', category_id: '' });
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {foods.map((food) => (
                <tr key={food.id}>
                  <td>{food.id}</td>
                  <td>{food.name}</td>
                  <td>{food.description}</td>
                  <td>${food.price}</td>
                  <td>{food.category_name}</td>
                  <td>
                    <button onClick={() => handleEdit(food)} className="btn-edit">Edit</button>
                    <button onClick={() => handleDelete(food.id)} className="btn-delete">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
