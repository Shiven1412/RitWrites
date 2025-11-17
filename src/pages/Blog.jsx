import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Blog.css';

export default function Blog({ supabase }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => { fetchPosts(); }, []);

  async function fetchPosts() {
    const { data } = await supabase.from('posts').select('id,title,slug,created_at,likes,content').order('created_at', { ascending: false });
    setPosts(data || []);
  }

  const extractFirstImage = (html) => {
    if (!html) return null;
    const imgMatch = html.match(/<img[^>]+src="([^">]+)"/);
    return imgMatch ? imgMatch[1] : null;
  };

  const extractExcerpt = (html) => {
    if (!html) return '';
    const plainText = html.replace(/<[^>]*>/g, '').trim();
    return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;
  };

  return (
    <div className="blog-page">
      <div className="blog-hero">
        <h1>Blog</h1>
        <p className="blog-sub">Latest articles and tutorials</p>
      </div>

      <div className="blog-posts">
        <ul className="post-list">
          {posts.map(p => {
            const firstImage = extractFirstImage(p.content);
            const excerpt = extractExcerpt(p.content);
            return (
              <li key={p.id}>
                <Link to={`/post/${p.slug}`} className="post-item">
                  <div className="featured-image">
                    {firstImage ? <img src={firstImage} alt={p.title} /> : <div className="no-image-placeholder">📝</div>}
                  </div>
                  <div className="post-content">
                    <div className="post-title">{p.title}</div>
                    {excerpt && <div className="post-excerpt">{excerpt}</div>}
                    <div className="post-footer">
                      <div className="post-date">{new Date(p.created_at).toLocaleDateString()}</div>
                      <div className="likes-count">❤️ {p.likes || 0}</div>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
