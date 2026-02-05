'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import './dashboard.css';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token) {
      router.push('/login');
    } else {
      setUser(JSON.parse(userData));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <h2>🍔 Food Manager</h2>
        <div className="nav-links">
          <span>Welcome, {user.name}!</span>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <h1>Dashboard</h1>
        
        <div className="card-grid">
          <Link href="/categories" className="dashboard-card">
            <div className="card-icon">📁</div>
            <h3>Food Categories</h3>
            <p>Manage your food categories</p>
          </Link>

          <Link href="/foods" className="dashboard-card">
            <div className="card-icon">🍕</div>
            <h3>Foods</h3>
            <p>Add and edit food items</p>
          </Link>

          <Link href="/products" className="dashboard-card">
            <div className="card-icon">📋</div>
            <h3>Product List</h3>
            <p>View all products with filters</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
