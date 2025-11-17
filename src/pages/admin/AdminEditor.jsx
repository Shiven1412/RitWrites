import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import makeSlug from '../../utils/slugify';
import { supabase } from '../../lib/supabaseClient';
import './AdminEditor.css';

export default function AdminEditor({ user, profile }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!profile?.is_admin) navigate('/');
  }, [profile, navigate]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: { openOnClick: true },
      }),
      Image,
      Placeholder.configure({ placeholder: 'Write the body of the post...' }),
    ],
    content: '<p></p>',
  });

  const onClickImage = () => {
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
      const filePath = `images/${fileName}`;

      const { data, error: uploadError } = await supabase.storage
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

      editor?.chain().focus().setImage({ src: publicUrlData.publicUrl }).run();
      setMessage('Image uploaded successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Unexpected error:', err);
      setError(`Error: ${err.message}`);
    }
  };

  const savePost = async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    const html = editor?.getHTML();
    if (!html || html === '<p></p>') {
      setError('Content is required');
      return;
    }

    const slug = makeSlug(title);
    setSaving(true);
    setError('');
    setMessage('');

    try {
      const { error } = await supabase.from('posts').insert([
        {
          title,
          slug,
          content: html,
          author_id: user.id,
        },
      ]);

      if (error) {
        throw error;
      }

      setMessage('Post saved successfully!');
      setTimeout(() => {
        navigate(`/post/${slug}`);
      }, 1000);
    } catch (err) {
      console.error('Save error:', err);
      setError(`Failed to save post: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (!profile?.is_admin) return null;

  return (
    <div className="admin-editor-container">
      <h1 className="admin-editor-title">Create New Post</h1>

      <div className="admin-editor-form-group">
        <label className="admin-editor-label">Post Title</label>
        <input
          className="admin-editor-input"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError('');
          }}
          placeholder="Enter post title..."
        />
      </div>

      <div className="admin-editor-form-group">
        <label className="admin-editor-label">Post Content</label>
        <div className="admin-editor-container-box">
          <div className="admin-editor-toolbar">
            <button
              className="admin-editor-tool-button"
              type="button"
              onClick={() => editor?.chain().focus().toggleBold().run()}
              title="Bold (Ctrl+B)"
            >
              <strong>B</strong>
            </button>
            <button
              className="admin-editor-tool-button"
              type="button"
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              title="Italic (Ctrl+I)"
            >
              <em>I</em>
            </button>
            <button
              className="admin-editor-tool-button"
              type="button"
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              title="Bullet List"
            >
              • List
            </button>
            <button
              className="admin-editor-tool-button"
              type="button"
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 2 }).run()
              }
              title="Heading 2"
            >
              H2
            </button>
            <button className="admin-editor-tool-button" type="button" onClick={onClickImage} title="Insert Image">
              🖼️ Image
            </button>
            <input
              className="admin-editor-hidden-input"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onImageChange}
            />
          </div>

          <div className="admin-editor-content-area">
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>

      {error && <div className="admin-editor-error-message">{error}</div>}
      {message && <div className="admin-editor-success-message">{message}</div>}

      <div className="admin-editor-action-group">
        <button className="admin-editor-save-button" onClick={savePost} disabled={saving}>
          {saving ? '💾 Saving...' : '✓ Save Post'}
        </button>
      </div>
    </div>
  );
}
