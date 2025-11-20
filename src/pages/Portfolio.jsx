import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import './Portfolio.css';

export default function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    setLoading(true);
    try {
      // Ensure image_url is fetched
      const { data } = await supabase
        .from('portfolio')
        .select('id, title, description, link, image_url')
        .order('created_at', { ascending: false });
      setProjects(data || []);
    } catch (err) {
      console.error('Error fetching portfolio:', err);
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="portfolio-container">
        <h1 className="portfolio-title">Portfolio</h1>
        <div className="empty-state">Loading...</div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="portfolio-container">
        <h1 className="portfolio-title">Portfolio</h1>
        <div className="empty-state">
          <p>No projects yet. Check back soon!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="portfolio-container">
      <h1 className="portfolio-title">Portfolio</h1>
      <p className="portfolio-description">
        A showcase of my recent work and projects.
      </p>
      <ul className="project-list">
        {projects.map(p => (
          <li key={p.id} className="project-item">
            <div className="project-image">
              {p.image_url ? (
                <img src={p.image_url} alt={p.title} />
              ) : (
                <div className="no-image-placeholder">📝</div>
              )}
            </div>
            <div className="project-content">
              <div className="project-title">{p.title}</div>
              <div className="project-desc">{p.description}</div>
              {p.link && (
                <a href={p.link} target="_blank" rel="noopener noreferrer" className="project-link">
                  View Project →
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}