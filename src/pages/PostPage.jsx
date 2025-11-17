import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './PostPage.css';

export default function PostPage({ supabase, user }) {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  useEffect(() => { if (slug) load(); }, [slug]);

  async function load() {
    const { data } = await supabase.from('posts').select('*').eq('slug', slug).single();
    setPost(data);
    if (data?.id) loadComments(data.id);
  }

  async function loadComments(postId) {
    const { data } = await supabase.from('comments').select('*').eq('post_id', postId).order('created_at', { ascending: true });
    setComments(data || []);
  }

  async function like() {
    if (!post) return;
    const { data } = await supabase.from('posts').update({ likes: (post.likes || 0) + 1 }).eq('id', post.id).select().single();
    setPost(data);
  }

  async function addComment(e) {
    e.preventDefault();
    if (!user) return alert('Please log in to comment');
    if (!commentText.trim()) return;
    const { error } = await supabase.from('comments').insert([{ post_id: post.id, user_id: user.id, content: commentText }]);
    if (error) console.error(error); else { setCommentText(''); loadComments(post.id); }
  }

  if (!post) return <div className="loading">Loading...</div>;

  return (
    <div className="post-page-container">
      <h1 className="post-page-title">{post.title}</h1>
      <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content }} />
      <div className="action-bar">
        <button className="like-button" onClick={like}>Like ({post.likes || 0})</button>
      </div>

      <section className="discussion-section">
        <h2 className="section-title">Discussion</h2>
        {user ? (
          <form className="comment-form" onSubmit={addComment}>
            <textarea 
              className="comment-textarea"
              value={commentText} 
              onChange={e => setCommentText(e.target.value)} 
              rows={3} 
              placeholder="Write a thoughtful comment..."
            ></textarea>
            <button type="submit" className="post-comment-button">Post comment</button>
          </form>
        ) : (
          <div className="login-prompt">Please <Link to="/login">login</Link> to join the discussion.</div>
        )}

        <ul className="comment-list">
          {comments.map(c => (
            <li key={c.id} className="comment-item">
              <div className="comment-content">{c.content}</div>
              <div className="comment-date">{new Date(c.created_at).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
