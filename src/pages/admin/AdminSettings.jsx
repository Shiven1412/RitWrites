import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import './AdminSettings.css';

export default function AdminSettings({ profile, onSettingsUpdate }) {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({ 
    site_name: '', 
    site_description: '', 
    logo_url: '',
    hero_image_url: '',
    id: null, // We'll store the settings ID here for updates
  });
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);
  const logoFileInputRef = useRef(null);
  const heroFileInputRef = useRef(null); 

  useEffect(() => {
    if (!profile?.is_admin) navigate('/');
    loadSettings();
  }, [profile, navigate]);

  async function loadSettings() {
    try {
      // Fetch settings, including the ID
      const { data, error } = await supabase.from('site_settings').select('*').single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116: No rows found
        throw error;
      }

      if (data) {
        // Store the existing ID if found
        setSettings({ ...data, id: data.id });
      }

    } catch (err) {
      console.error('Load settings error:', err);
      setStatus({ type: 'error', message: `Failed to load settings: ${err.message}` });
    }
  }

  // Unified function to save all fields in the 'settings' state
  const saveSettings = async (settingsToSave = settings) => {
    setSaving(true);
    setStatus(null);

    // Only require `site_name` when creating a new settings row.
    // If the row already exists (has an id), allow saving partial updates
    // such as updating `hero_image_url` without a `site_name` present.
    if (!settingsToSave.site_name?.trim() && !settingsToSave.id) {
      setStatus({ type: 'error', message: 'Site name is required.' });
      setSaving(false);
      return;
    }

    try {
      if (settingsToSave.id) {
        const { error } = await supabase.from('site_settings').update(settingsToSave).eq('id', settingsToSave.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from('site_settings').insert([settingsToSave]).select('id').single();
        if (error) throw error;
        setSettings(prev => ({ ...prev, id: data.id }));
      }

      setStatus({ type: 'success', message: 'Settings saved successfully!' });
      onSettingsUpdate?.();
      setTimeout(() => setStatus(null), 3000);
    } catch (err) {
      console.error('Save error:', err);
      setStatus({ type: 'error', message: `Failed to save: ${err.message}` });
    } finally {
      setSaving(false);
    }
  };

  const handleUploadClick = (ref) => {
    ref.current?.click();
  };

  // Dedicated upload handler: Uploads file, gets URL, updates settings state immediately
  const handleImageChange = (fileRef, storageBucket, settingsKey, filePathPrefix) => async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) { 
      setStatus({ type: 'error', message: `${settingsKey} too big (>4MB).` });
      return;
    }

    if (!file.type.startsWith('image/')) {
      setStatus({ type: 'error', message: 'Please select a valid image file.' });
      return;
    }

    // Set saving state only for the upload component, not the whole form
    setSaving(true); 
    setStatus(null);

    try {
      const ext = file.name.split('.').pop();
      const uniqueSuffix = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const filePath = `${filePathPrefix}/${uniqueSuffix}.${ext}`;

      // 1. Upload the file with a unique path so repeated uploads don't all use the same name
      const { error: uploadError } = await supabase.storage
        .from(storageBucket)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: publicUrlData } = supabase.storage
        .from(storageBucket)
        .getPublicUrl(filePath);

      if (!publicUrlData?.publicUrl) {
        throw new Error('Failed to get image URL');
      }

      const updatedSettings = { ...settings, [settingsKey]: publicUrlData.publicUrl };
      setSettings(updatedSettings);

      // 4. Immediately save the new state object, not the old stale state.
      await saveSettings(updatedSettings);

      setStatus({ type: 'success', message: `${settingsKey} uploaded and saved successfully!` });
      onSettingsUpdate?.();
      setTimeout(() => setStatus(null), 3000);

    } catch (err) {
      console.error('Upload error:', err);
      setStatus({ type: 'error', message: `Upload failed: ${err.message}` });
    } finally {
      setSaving(false);
      // Clear the file input after use
      fileRef.current.value = null; 
    }
  };


  if (!profile?.is_admin) return null;

  return (
    <div className="admin-settings-container">
      <h1 className="admin-settings-title">Site Settings</h1>

      {status && <div className={`admin-settings-message admin-settings-message-${status.type}`}>{status.message}</div>}

      {/* --- Basic Information --- */}
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
        <button 
          className="admin-settings-save-button" 
          onClick={saveSettings} 
          disabled={saving || !settings.site_name}
          style={{ width: 'auto', padding: '0.75rem 2rem' }}
        >
          {saving ? 'Saving...' : 'Save Text Settings'}
        </button>
      </div>
      
      {/* --- Logo Section --- */}
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
          <button className="admin-settings-upload-button" onClick={() => handleUploadClick(logoFileInputRef)} disabled={saving}>
            📤 {settings.logo_url ? 'Change Logo' : 'Upload Logo'}
          </button>
          <input
            className="admin-settings-file-input"
            ref={logoFileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange(logoFileInputRef, 'ritwrites-images', 'logo_url', 'logos/ritwrites-logo')}
          />
        </div>
      </div>

      {/* --- Hero Image Section --- */}
      <div className="admin-settings-section">
        <h2 className="admin-settings-section-title">👩‍💻 Hero Profile Image (Home Page)</h2>
        <div className="admin-settings-form-group">
          <label className="admin-settings-label">Profile Image</label>
          <div className="admin-settings-logo-preview admin-settings-hero-preview">
            {settings.hero_image_url ? (
              <img src={settings.hero_image_url} alt="Hero Profile" style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '50%' }} />
            ) : (
              <p className="admin-settings-logo-placeholder">No hero image uploaded yet</p>
            )}
          </div>
          <button className="admin-settings-upload-button" onClick={() => handleUploadClick(heroFileInputRef)} disabled={saving}>
            📤 {settings.hero_image_url ? 'Change Profile Image' : 'Upload Profile Image'}
          </button>
          <input
            className="admin-settings-file-input"
            ref={heroFileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange(heroFileInputRef, 'ritwrites-images', 'hero_image_url', 'profiles/ritika')}
          />
        </div>

        {/* --- Debug / Verification --- */}
        <div className="admin-settings-section" style={{ marginTop: '1rem' }}>
          <h3 className="admin-settings-section-title">🔎 Debug</h3>
          <div className="admin-settings-form-group">
            <label className="admin-settings-label">Current hero_image_url</label>
            <input
              className="admin-settings-input"
              value={settings.hero_image_url || ''}
              readOnly
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button
              className="admin-settings-upload-button"
              onClick={() => onSettingsUpdate?.()}
            >
              Refresh Home Settings
            </button>
            <button
              className="admin-settings-upload-button"
              onClick={() => navigator.clipboard?.writeText(settings.hero_image_url || '')}
              disabled={!settings.hero_image_url}
            >
              Copy URL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
