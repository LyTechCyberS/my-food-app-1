'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import './products.css';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: ''
  });
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/login');
    else {
      fetchProducts();
      fetchCategories();
    }
  }, []);

  const fetchProducts = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/foods', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    setProducts(data);
  };

  const fetchCategories = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/categories', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    setCategories(data);
  };

  const filteredProducts = products.filter(product => {
    const matchSearch = product.name.toLowerCase().includes(filter.search.toLowerCase());
    const matchCategory = !filter.category || product.category_id == filter.category;
    const matchMinPrice = !filter.minPrice || product.price >= parseFloat(filter.minPrice);
    const matchMaxPrice = !filter.maxPrice || product.price <= parseFloat(filter.maxPrice);
    return matchSearch && matchCategory && matchMinPrice && matchMaxPrice;
  });

  return (
    <div className="page-container">
      <nav className="page-nav">
        <Link href="/dashboard">← Back to Dashboard</Link>
        <h2>📋 Product List</h2>
      </nav>

      <div className="page-content">
        <div className="filter-card">
          <h3>🔍 Filters</h3>
          <div className="filter-grid">
            <input
              type="text"
              placeholder="Search by name..."
              value={filter.search}
              onChange={(e) => setFilter({...filter, search: e.target.value})}
            />
            
            <select
              value={filter.category}
              onChange={(e) => setFilter({...filter, category: e.target.value})}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Min Price"
              value={filter.minPrice}
              onChange={(e) => setFilter({...filter, minPrice: e.target.value})}
            />

            <input
              type="number"
              placeholder="Max Price"
              value={filter.maxPrice}
              onChange={(e) => setFilter({...filter, maxPrice: e.target.value})}
            />
          </div>

          <button 
            className="btn-reset"
            onClick={() => setFilter({ search: '', category: '', minPrice: '', maxPrice: '' })}
          >
            Reset Filters
          </button>
        </div>

        <div className="products-grid">
          {filteredProducts.length === 0 ? (
            <div className="no-results">
              <p>😕 No products found</p>
            </div>
          ) : (
            filteredProducts.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-header">
                  <h3>{product.name}</h3>
                  <span className="product-price">${product.price}</span>
                </div>
                <p className="product-description">{product.description}</p>
                <div className="product-footer">
                  <span className="product-category">📁 {product.category_name}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
