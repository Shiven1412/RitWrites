import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
    fetchPortfolio();
  }, []);

  async function fetchPosts() {
    const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    setPosts(data || []);
  }

  async function fetchPortfolio() {
    const { data } = await supabase.from('portfolio').select('*').order('created_at', { ascending: false });
    setPortfolio(data || []);
  }

  async function deletePost(id) {
    if (!confirm('Delete this post?')) return;
    await supabase.from('posts').delete().eq('id', id);
    fetchPosts();
  }

  async function deletePortfolio(id) {
    if (!confirm('Delete this portfolio item?')) return;
    await supabase.from('portfolio').delete().eq('id', id);
    fetchPortfolio();
  }

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Dashboard</h1>

      <div className="admin-tab-container">
        <div className="admin-tab-buttons">
          <button className={`admin-tab-button ${activeTab === 'posts' ? 'active' : ''}`} onClick={() => setActiveTab('posts')}>
            📝 Blog Posts
          </button>
          <button className={`admin-tab-button ${activeTab === 'portfolio' ? 'active' : ''}`} onClick={() => setActiveTab('portfolio')}>
            🎨 Portfolio
          </button>
          <button className={`admin-tab-button ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
            ⚙️ Settings
          </button>
        </div>

        {activeTab === 'posts' && (
          <>
            <div className="admin-action-bar">
              <Link to="/admin/new" className="admin-new-button">+ New Post</Link>
            </div>
            {posts.length === 0 ? (
              <div className="admin-empty-state">No blog posts yet. Create your first post!</div>
            ) : (
              <ul className="admin-item-list">
                {posts.map(p => (
                  <li key={p.id} className="admin-item-card">
                    <div className="admin-item-info">
                      <div className="admin-item-title">{p.title}</div>
                      <div className="admin-item-date">{new Date(p.created_at).toLocaleString()}</div>
                    </div>
                    <div className="admin-item-actions">
                      <Link to={`/post/${p.slug}`} className="admin-action-link">View</Link>
                      <button className="admin-delete-button" onClick={() => deletePost(p.id)}>Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {activeTab === 'portfolio' && (
          <>
            <div className="admin-action-bar">
              <Link to="/admin/portfolio/new" className="admin-new-button">+ New Project</Link>
            </div>
            {portfolio.length === 0 ? (
              <div className="admin-empty-state">No portfolio items yet. Showcase your work!</div>
            ) : (
              <ul className="admin-item-list">
                {portfolio.map(p => (
                  <li key={p.id} className="admin-item-card">
                    <div className="admin-item-info">
                      <div className="admin-item-title">{p.title}</div>
                      <div className="admin-item-date">{new Date(p.created_at).toLocaleString()}</div>
                    </div>
                    <div className="admin-item-actions">
                      <Link to={`/admin/portfolio/${p.id}`} className="admin-edit-button">Edit</Link>
                      <button className="admin-delete-button" onClick={() => deletePortfolio(p.id)}>Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {activeTab === 'settings' && (
          <Link to="/admin/settings" className="admin-settings-link">
            Go to Settings →
          </Link>
        )}
      </div>
    </div>
  );
}
