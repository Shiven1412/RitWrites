import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './Navbar.css';

export default function Navbar({ user, profile, siteSettings }) {
  const [open, setOpen] = useState(false);
  const logoUrl = siteSettings?.logo_url || null;

  const menuVariants = {
    hidden: { scale: 0.8, opacity: 0, x: 50, y: -20 },
    visible: { scale: 1, opacity: 1, x: 0, y: 0 },
    exit: { scale: 0.5, opacity: 0, x: 50, y: -20 },
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo-container">
        {logoUrl && <img src={logoUrl} alt="Logo" className="logo-image" />}
        <span className="logo-text">RitWrites</span>
      </Link>

      {/* Desktop Links (Hidden on Mobile via CSS) */}
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

      {/* Mobile Menu Toggle (Bubble Button) */}
      <button 
        className="mobile-toggle" 
        onClick={() => setOpen(o => !o)}
        aria-label={open ? "Close Menu" : "Open Menu"}
      >
        {open ? 'CLOSE' : 'MENU'}
      </button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-menu-overlay"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={menuVariants}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <Link to="/blog" onClick={() => setOpen(false)}>Blog</Link>
            <Link to="/portfolio" onClick={() => setOpen(false)}>Portfolio</Link>
            <Link to="/contact" onClick={() => setOpen(false)}>Contact</Link>
            {profile?.is_admin && <Link to="/admin" onClick={() => setOpen(false)}>Admin</Link>}
            {user ? (
              <>
                <span className="text-sm opacity-70 mt-2">{profile?.full_name || user.email}</span>
                <Link to="/logout" onClick={() => setOpen(false)}>Log Out</Link>
              </>
            ) : (
              <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}