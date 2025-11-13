import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import styled from 'styled-components';
import makeSlug from '../../utils/slugify';
import { supabase } from '../../lib/supabaseClient';

const Container = styled.div`
  max-width: 56rem;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  color: #191970;
  margin-bottom: 1.5rem;
`;

const FormGroup = styled.div`
  margin-top: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 1.1rem;
  font-weight: 600;
  color: #191970;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #191970;
  border-radius: 0.5rem;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  background-color: #ffffff;
  color: #191970;

  &::placeholder {
    color: #cccccc;
  }

  &:focus {
    outline: none;
    border-color: #d4af37;
    box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.1);
  }
`;

const EditorContainer = styled.div`
  margin-top: 1.5rem;
  border: 2px solid #191970;
  border-radius: 0.5rem;
  background-color: #ffffff;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(25, 25, 112, 0.1);
`;

const ToolBar = styled.div`
  padding: 1rem;
  border-bottom: 2px solid #191970;
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  background-color: #f5f5dc;
`;

const ToolButton = styled.button`
  padding: 0.6rem 1rem;
  border: 2px solid #191970;
  border-radius: 0.375rem;
  background-color: #ffffff;
  color: #191970;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:hover {
    background-color: #191970;
    color: #f5f5dc;
    transform: translateY(-2px);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const EditorContentArea = styled.div`
  padding: 1.5rem;
  min-height: 24rem;
  background-color: #ffffff;

  .tiptap {
    outline: none;
    font-size: 1.1rem;
    color: #191970;
    line-height: 1.8;
  }

  .tiptap p {
    margin: 1rem 0;
  }

  .tiptap p.is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    float: left;
    color: #cccccc;
    pointer-events: none;
    height: 0;
    font-size: 1.1rem;
  }

  .tiptap h1 {
    font-size: 2rem;
    font-weight: bold;
    margin: 1.5rem 0 0.75rem 0;
  }

  .tiptap h2 {
    font-size: 1.75rem;
    font-weight: bold;
    margin: 1.5rem 0 0.75rem 0;
  }

  .tiptap h3 {
    font-size: 1.5rem;
    font-weight: bold;
    margin: 1.25rem 0 0.5rem 0;
  }

  .tiptap ul {
    list-style: disc;
    margin: 1rem 0 1rem 2rem;
  }

  .tiptap li {
    margin: 0.5rem 0;
  }

  .tiptap img {
    max-width: 100%;
    height: auto;
    margin: 1.5rem 0;
    border-radius: 0.5rem;
    border: 2px solid #191970;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const ActionGroup = styled.div`
  margin-top: 2rem;
`;

const SaveButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #191970;
  color: #f5f5dc;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  border: 2px solid #191970;

  &:hover:not(:disabled) {
    background-color: #0a0a3a;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(25, 25, 112, 0.3);
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  background-color: #fee2e2;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-top: 1rem;
  border: 1px solid #dc2626;
  font-size: 1rem;
`;

const SuccessMessage = styled.div`
  color: #16a34a;
  background-color: #dcfce7;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-top: 1rem;
  border: 1px solid #16a34a;
  font-size: 1rem;
`;

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
    <Container>
      <Title>Create New Post</Title>

      <FormGroup>
        <Label>Post Title</Label>
        <Input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError('');
          }}
          placeholder="Enter post title..."
        />
      </FormGroup>

      <FormGroup>
        <Label>Post Content</Label>
        <EditorContainer>
          <ToolBar>
            <ToolButton
              type="button"
              onClick={() => editor?.chain().focus().toggleBold().run()}
              title="Bold (Ctrl+B)"
            >
              <strong>B</strong>
            </ToolButton>
            <ToolButton
              type="button"
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              title="Italic (Ctrl+I)"
            >
              <em>I</em>
            </ToolButton>
            <ToolButton
              type="button"
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              title="Bullet List"
            >
              • List
            </ToolButton>
            <ToolButton
              type="button"
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 2 }).run()
              }
              title="Heading 2"
            >
              H2
            </ToolButton>
            <ToolButton type="button" onClick={onClickImage} title="Insert Image">
              🖼️ Image
            </ToolButton>
            <HiddenInput
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onImageChange}
            />
          </ToolBar>

          <EditorContentArea>
            <EditorContent editor={editor} />
          </EditorContentArea>
        </EditorContainer>
      </FormGroup>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {message && <SuccessMessage>{message}</SuccessMessage>}

      <ActionGroup>
        <SaveButton onClick={savePost} disabled={saving}>
          {saving ? '💾 Saving...' : '✓ Save Post'}
        </SaveButton>
      </ActionGroup>
    </Container>
  );
}
