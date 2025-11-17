import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar({ user, profile, siteSettings }) {
  const [open, setOpen] = useState(false);
  const logoUrl = siteSettings?.logo_url || null;

  return (
    <nav className="navbar">
      <Link to="/" className="logo-container">
        {logoUrl && <img src={logoUrl} alt="Logo" className="logo-image" />}
        <span className="logo-text">RitWrites</span>
      </Link>

      <div className="nav-links">
        <Link to="/blog" className="nav-link">Blog</Link>
        <Link to="/portfolio" className="nav-link">Portfolio</Link>
        <Link to="/contact" className="nav-link">Contact</Link>
        {profile?.is_admin && <Link to="/admin" className="nav-button">Admin</Link>}
        {user ? (
          <>
            <span className="user-span">{profile?.full_name || user.email}</span>
            <Link to="/logout" className="nav-button">Log Out</Link>
          </>
        ) : (
          <Link to="/login" className="nav-link">Login</Link>
        )}
      </div>

      <button 
        className="mobile-toggle" 
        onClick={() => setOpen(o => !o)}
        aria-label="Menu"
      >
        ☰
      </button>

      {open && (
        <div className="mobile-menu">
          <Link to="/blog" className="nav-link" onClick={() => setOpen(false)}>Blog</Link>
          <Link to="/portfolio" className="nav-link" onClick={() => setOpen(false)}>Portfolio</Link>
          <Link to="/contact" className="nav-link" onClick={() => setOpen(false)}>Contact</Link>
          {profile?.is_admin && <Link to="/admin" className="nav-button" onClick={() => setOpen(false)}>Admin</Link>}
          {user ? (
            <>
              <span className="user-span">{profile?.full_name || user.email}</span>
              <Link to="/logout" className="nav-button" onClick={() => setOpen(false)}>Log Out</Link>
            </>
          ) : (
            <Link to="/login" className="nav-link" onClick={() => setOpen(false)}>Login</Link>
          )}
        </div>
      )}
    </nav>
  );
}
