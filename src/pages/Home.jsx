import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RotatingCube } from '../components/RotatingCube';
import profilePhoto from '../assets/photo_2025-11-15_15-27-49.jpg';
import './Home.css';

export default function Home({ supabase }) {
  // Home now only shows the hero + rotating cube per Figma.
  // Add touch handlers to navigate to Blog on mobile swipe up/down.
  const [touchStartY, setTouchStartY] = useState(null);
  const [touchEndY, setTouchEndY] = useState(null);
  const navigateTo = '/blog';
  const navigate = useNavigate();
  const threshold = 60; // px

  const handleTouchStart = (e) => {
    setTouchEndY(null);
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e) => {
    setTouchEndY(e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (!touchStartY || !touchEndY) return;
    const delta = touchStartY - touchEndY;
    // swipe up (positive delta) should navigate to blog
    if (delta > threshold) {
      // use router navigate for smooth client-side navigation
      navigate(navigateTo);
    }
  };

  return (
    <div className="home-container">
      {/* Hero Section with Rotating Cube */}
      <div className="home-hero" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
        <div className="hero-content">
          <h1 className="hero-title">Crafting Compelling Content</h1>
          <p className="hero-subtitle">MA English | Content Writer | Storyteller. I transform ideas into engaging narratives that resonate with audiences.</p>
          <div className="hero-ctas">
            <a className="cta primary" href="/blog">Read My Blog</a>
            <a className="cta secondary" href="/contact">Work With Me</a>
          </div>
          <div className="hero-stats">
            <div className="stat"><div className="stat-num">100+</div><div className="stat-label">Articles</div></div>
            <div className="stat"><div className="stat-num">10k+</div><div className="stat-label">Readers</div></div>
            <div className="stat"><div className="stat-num">5+</div><div className="stat-label">Years Exp</div></div>
          </div>
        </div>
        <div className="hero-cube">
          <div className="hero-visuals">
            <div className="hero-gradient-surface" />
            <div className="hero-cube-wrap">
              <RotatingCube profileImage={profilePhoto} />
            </div>
          </div>
        </div>

        <div className="scroll-hint">
          <div className="scroll-text">Scroll down to navigate to Blog</div>
          <div className="scroll-dot" />
        </div>
      </div>
    </div>
  );
}
