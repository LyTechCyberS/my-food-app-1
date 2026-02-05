import Link from 'next/link';
import './home.css';

export default function Home() {
  return (
    <div className="home-container">
      <div className="hero">
        <h1>🍔 Food Management System</h1>
        <p>Manage your food categories and products easily</p>
        <div className="cta-buttons">
          <Link href="/login" className="btn btn-primary">Login</Link>
          <Link href="/register" className="btn btn-secondary">Register</Link>
        </div>
      </div>
    </div>
  );
}
