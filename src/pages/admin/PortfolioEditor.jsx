import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import './PortfolioEditor.css';

export default function PortfolioEditor({ profile }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!profile?.is_admin) navigate('/');
    if (id) loadProject();
  }, [profile, navigate, id]);

  async function loadProject() {
    const { data } = await supabase.from('portfolio').select('*').eq('id', id).single();
    if (data) {
      setTitle(data.title);
      setDescription(data.description);
      setLink(data.link || '');
      setImageUrl(data.image_url || '');
    }
  }

  const onClickUpload = () => {
    fileInputRef.current?.click();
  };

  const onImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 6 * 1024 * 1024) {
      setError('Image too big (>6MB).');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }

    try {
      const ext = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${ext}`;
      const filePath = `portfolio/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('ritwrites-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        setError(`Upload failed: ${uploadError.message}`);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('ritwrites-images')
        .getPublicUrl(filePath);

      if (!publicUrlData?.publicUrl) {
        setError('Failed to get image URL');
        return;
      }

      setImageUrl(publicUrlData.publicUrl);
      setMessage('Image uploaded successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Unexpected error:', err);
      setError(`Error: ${err.message}`);
    }
  };

  const save = async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (!description.trim()) {
      setError('Description is required');
      return;
    }

    setSaving(true);
    setError('');
    setMessage('');

    try {
      if (id) {
        // Update existing
        const { error } = await supabase.from('portfolio').update({
          title,
          description,
          link,
          image_url: imageUrl,
        }).eq('id', id);

        if (error) throw error;
        setMessage('Project updated successfully!');
      } else {
        // Create new
        const { error } = await supabase.from('portfolio').insert([{
          title,
          description,
          link,
          image_url: imageUrl,
        }]);

        if (error) throw error;
        setMessage('Project created successfully!');
      }

      setTimeout(() => {
        navigate('/admin');
      }, 1000);
    } catch (err) {
      console.error('Save error:', err);
      setError(`Failed to save: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (!profile?.is_admin) return null;

  return (
    <div className="portfolio-editor-container">
      <h1 className="portfolio-editor-title">{id ? 'Edit Project' : 'Create New Project'}</h1>

      <div className="portfolio-editor-form-group">
        <label className="portfolio-editor-label">Project Title</label>
        <input
          className="portfolio-editor-input"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError('');
          }}
          placeholder="Enter project title..."
        />
      </div>

      <div className="portfolio-editor-form-group">
        <label className="portfolio-editor-label">Description</label>
        <textarea
          className="portfolio-editor-textarea"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            setError('');
          }}
          placeholder="Describe your project..."
        />
      </div>

      <div className="portfolio-editor-form-group">
        <label className="portfolio-editor-label">Project Link (Optional)</label>
        <input
          className="portfolio-editor-input"
          type="url"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://example.com"
        />
      </div>

      <div className="portfolio-editor-form-group">
        <label className="portfolio-editor-label">Project Image</label>
        <div className="portfolio-editor-image-preview">
          {imageUrl ? (
            <>
              <p>Current Image:</p>
              <img src={imageUrl} alt={title} />
            </>
          ) : (
            <p>No image yet</p>
          )}
        </div>
        <button className="portfolio-editor-upload-button" onClick={onClickUpload}>
          📤 Upload Image
        </button>
        <input
          className="portfolio-editor-file-input"
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onImageChange}
        />
      </div>

      {error && <div className="portfolio-editor-error-message">{error}</div>}
      {message && <div className="portfolio-editor-success-message">{message}</div>}

      <div className="portfolio-editor-button-group">
        <button className="portfolio-editor-save-button" onClick={save} disabled={saving}>
          {saving ? 'Saving...' : 'Save Project'}
        </button>
        <button className="portfolio-editor-cancel-button" onClick={() => navigate('/admin')}>
          Cancel
        </button>
      </div>
    </div>
  );
}
