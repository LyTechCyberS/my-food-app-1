'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import './categories.css';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ name: '' });
  const [editId, setEditId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/login');
    else fetchCategories();
  }, []);

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

    if (editId) {
      // Update
      await fetch(`/api/categories/${editId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      setEditId(null);
    } else {
      // Create
      await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
    }

    setFormData({ name: '' });
    fetchCategories();
  };

  const handleEdit = (category) => {
    setEditId(category.id);
    setFormData({ name: category.name });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return;
    
    const token = localStorage.getItem('token');
    await fetch(`/api/categories/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchCategories();
  };

  return (
    <div className="page-container">
      <nav className="page-nav">
        <Link href="/dashboard">← Back to Dashboard</Link>
        <h2>📁 Food Categories</h2>
      </nav>

      <div className="page-content">
        <div className="form-card">
          <h3>{editId ? 'Edit Category' : 'Add New Category'}</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Category Name"
              value={formData.name}
              onChange={(e) => setFormData({ name: e.target.value })}
              required
            />
            <div className="form-buttons">
              <button type="submit" className="btn-primary">
                {editId ? 'Update' : 'Add'}
              </button>
              {editId && (
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={() => { setEditId(null); setFormData({ name: '' }); }}
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td>{cat.id}</td>
                  <td>{cat.name}</td>
                  <td>
                    <button onClick={() => handleEdit(cat)} className="btn-edit">Edit</button>
                    <button onClick={() => handleDelete(cat.id)} className="btn-delete">Delete</button>
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
