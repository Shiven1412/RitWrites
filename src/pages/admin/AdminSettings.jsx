import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { supabase } from '../../lib/supabaseClient';

const Container = styled.div`
  max-width: 56rem;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  color: #191970;
  margin-bottom: 1.5rem;
`;

const SettingsSection = styled.div`
  background-color: #ffffff;
  border: 2px solid #191970;
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #191970;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #f5f5dc;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.95rem;
  font-weight: 500;
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

const LogoPreview = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  border: 2px dashed #191970;
  border-radius: 0.5rem;
  text-align: center;
  background-color: #f9f9f9;
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    max-width: 150px;
    max-height: 80px;
    object-fit: contain;
  }
`;

const UploadButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #191970;
  color: #f5f5dc;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  border: 2px solid #191970;
  cursor: pointer;

  &:hover {
    background-color: #0a0a3a;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(25, 25, 112, 0.3);
  }
`;

const FileInput = styled.input`
  display: none;
`;

const SaveButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #16a34a;
  color: #ffffff;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
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

const Message = styled.div`
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
  background-color: ${props => props.type === 'success' ? '#dcfce7' : '#fee2e2'};
  color: ${props => props.type === 'success' ? '#16a34a' : '#dc2626'};
  border: 2px solid ${props => props.type === 'success' ? '#16a34a' : '#dc2626'};
`;

export default function AdminSettings({ profile }) {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({ site_name: '', site_description: '', logo_url: '' });
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!profile?.is_admin) navigate('/');
    loadSettings();
  }, [profile, navigate]);

  async function loadSettings() {
    const { data } = await supabase.from('site_settings').select('*').single();
    if (data) {
      setSettings(data);
    }
  }

  const onClickUpload = () => {
    fileInputRef.current?.click();
  };

  const onImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setStatus({ type: 'error', message: 'Logo too big (>2MB).' });
      return;
    }

    if (!file.type.startsWith('image/')) {
      setStatus({ type: 'error', message: 'Please select a valid image file.' });
      return;
    }

    try {
      const ext = file.name.split('.').pop();
      const fileName = `logo.${ext}`;
      const filePath = `logos/${fileName}`;

      // Delete old logo if it exists
      const oldLogoPath = settings.logo_url?.split('/').pop();
      if (oldLogoPath && oldLogoPath !== 'logo.png') {
        await supabase.storage
          .from('ritwrites-images')
          .remove([`logos/${oldLogoPath}`])
          .catch(() => {}); // Ignore errors
      }

      const { error: uploadError } = await supabase.storage
        .from('ritwrites-images')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('ritwrites-images')
        .getPublicUrl(filePath);

      setSettings(prev => ({ ...prev, logo_url: publicUrlData.publicUrl }));
      setStatus({ type: 'success', message: 'Logo uploaded successfully!' });
      setTimeout(() => setStatus(null), 3000);
    } catch (err) {
      console.error('Upload error:', err);
      setStatus({ type: 'error', message: `Upload failed: ${err.message}` });
    }
  };

  const save = async () => {
    if (!settings.site_name.trim()) {
      setStatus({ type: 'error', message: 'Site name is required.' });
      return;
    }

    setSaving(true);
    setStatus(null);

    try {
      const { data: existing } = await supabase.from('site_settings').select('id').single().catch(() => ({ data: null }));

      if (existing) {
        await supabase.from('site_settings').update(settings).eq('id', existing.id);
      } else {
        await supabase.from('site_settings').insert([settings]);
      }

      setStatus({ type: 'success', message: 'Settings saved successfully!' });
      setTimeout(() => setStatus(null), 3000);
    } catch (err) {
      console.error('Save error:', err);
      setStatus({ type: 'error', message: `Failed to save: ${err.message}` });
    } finally {
      setSaving(false);
    }
  };

  if (!profile?.is_admin) return null;

  return (
    <Container>
      <Title>Site Settings</Title>

      {status && <Message type={status.type}>{status.message}</Message>}

      <SettingsSection>
        <SectionTitle>📋 Basic Information</SectionTitle>

        <FormGroup>
          <Label>Site Name</Label>
          <Input
            value={settings.site_name}
            onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
            placeholder="Enter site name..."
          />
        </FormGroup>

        <FormGroup>
          <Label>Site Description</Label>
          <Input
            value={settings.site_description}
            onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
            placeholder="Enter site description..."
          />
        </FormGroup>
      </SettingsSection>

      <SettingsSection>
        <SectionTitle>🎨 Logo</SectionTitle>

        <FormGroup>
          <Label>Logo Image</Label>
          <LogoPreview>
            {settings.logo_url ? (
              <img src={settings.logo_url} alt="Logo" />
            ) : (
              <p style={{ color: '#999999' }}>No logo uploaded yet</p>
            )}
          </LogoPreview>
          <UploadButton onClick={onClickUpload} style={{ marginTop: '1rem' }}>
            📤 Upload Logo
          </UploadButton>
          <FileInput
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onImageChange}
          />
        </FormGroup>
      </SettingsSection>

      <SaveButton onClick={save} disabled={saving}>
        {saving ? 'Saving...' : 'Save Settings'}
      </SaveButton>
    </Container>
  );
}
