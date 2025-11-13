import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
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
  font-size: 1rem;
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

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #191970;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  min-height: 120px;
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

const ImagePreview = styled.div`
  margin-top: 1rem;
  border: 2px dashed #191970;
  border-radius: 0.5rem;
  padding: 1rem;
  text-align: center;

  img {
    max-width: 100%;
    max-height: 300px;
    border-radius: 0.375rem;
    margin-top: 1rem;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const UploadButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #191970;
  color: #f5f5dc;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  border: 2px solid #191970;
  cursor: pointer;

  &:hover {
    background-color: #0a0a3a;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(25, 25, 112, 0.3);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const SaveButton = styled.button`
  flex: 1;
  padding: 0.75rem 1.5rem;
  background-color: #16a34a;
  color: #ffffff;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1.1rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #15803d;
    transform: translateY(-2px);
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 0.75rem 1.5rem;
  background-color: #666666;
  color: #ffffff;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1.1rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #555555;
    transform: translateY(-2px);
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
    <Container>
      <Title>{id ? 'Edit Project' : 'Create New Project'}</Title>

      <FormGroup>
        <Label>Project Title</Label>
        <Input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError('');
          }}
          placeholder="Enter project title..."
        />
      </FormGroup>

      <FormGroup>
        <Label>Description</Label>
        <TextArea
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            setError('');
          }}
          placeholder="Describe your project..."
        />
      </FormGroup>

      <FormGroup>
        <Label>Project Link (Optional)</Label>
        <Input
          type="url"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://example.com"
        />
      </FormGroup>

      <FormGroup>
        <Label>Project Image</Label>
        <ImagePreview>
          {imageUrl ? (
            <>
              <p>Current Image:</p>
              <img src={imageUrl} alt={title} />
            </>
          ) : (
            <p>No image yet</p>
          )}
        </ImagePreview>
        <UploadButton onClick={onClickUpload} style={{ marginTop: '1rem' }}>
          📤 Upload Image
        </UploadButton>
        <FileInput
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onImageChange}
        />
      </FormGroup>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {message && <SuccessMessage>{message}</SuccessMessage>}

      <ButtonGroup>
        <SaveButton onClick={save} disabled={saving}>
          {saving ? 'Saving...' : 'Save Project'}
        </SaveButton>
        <CancelButton onClick={() => navigate('/admin')}>
          Cancel
        </CancelButton>
      </ButtonGroup>
    </Container>
  );
}
