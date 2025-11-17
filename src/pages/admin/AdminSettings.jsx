import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import './AdminSettings.css';

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
    <div className="admin-settings-container">
      <h1 className="admin-settings-title">Site Settings</h1>

      {status && <div className={`admin-settings-message admin-settings-message-${status.type}`}>{status.message}</div>}

      <div className="admin-settings-section">
        <h2 className="admin-settings-section-title">📋 Basic Information</h2>

        <div className="admin-settings-form-group">
          <label className="admin-settings-label">Site Name</label>
          <input
            className="admin-settings-input"
            value={settings.site_name}
            onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
            placeholder="Enter site name..."
          />
        </div>

        <div className="admin-settings-form-group">
          <label className="admin-settings-label">Site Description</label>
          <input
            className="admin-settings-input"
            value={settings.site_description}
            onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
            placeholder="Enter site description..."
          />
        </div>
      </div>

      <div className="admin-settings-section">
        <h2 className="admin-settings-section-title">🎨 Logo</h2>

        <div className="admin-settings-form-group">
          <label className="admin-settings-label">Logo Image</label>
          <div className="admin-settings-logo-preview">
            {settings.logo_url ? (
              <img src={settings.logo_url} alt="Logo" />
            ) : (
              <p className="admin-settings-logo-placeholder">No logo uploaded yet</p>
            )}
          </div>
          <button className="admin-settings-upload-button" onClick={onClickUpload}>
            📤 Upload Logo
          </button>
          <input
            className="admin-settings-file-input"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onImageChange}
          />
        </div>
      </div>

      <button className="admin-settings-save-button" onClick={save} disabled={saving}>
        {saving ? 'Saving...' : 'Save Settings'}
      </button>
    </div>
  );
}
