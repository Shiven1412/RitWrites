import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import './AdminSettings.css';

export default function AdminSettings({ profile }) {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({ 
    site_name: '', 
    site_description: '', 
    logo_url: '',
    hero_image_url: '', // New state field for the hero image
  });
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);
  const logoFileInputRef = useRef(null);
  const heroFileInputRef = useRef(null); // Ref for the new hero image input

  useEffect(() => {
    if (!profile?.is_admin) navigate('/');
    loadSettings();
  }, [profile, navigate]);

  async function loadSettings() {
    // Fetch the new hero_image_url field
    const { data } = await supabase.from('site_settings').select('*').single().catch(() => ({ data: null }));
    if (data) {
      setSettings(data);
    }
  }

  const handleUploadClick = (ref) => {
    ref.current?.click();
  };

  const handleImageChange = (fileRef, storageBucket, settingsKey, filePathPrefix) => async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) { // Max 4MB for hero image
      setStatus({ type: 'error', message: `${settingsKey} too big (>4MB).` });
      return;
    }

    if (!file.type.startsWith('image/')) {
      setStatus({ type: 'error', message: 'Please select a valid image file.' });
      return;
    }

    try {
      const ext = file.name.split('.').pop();
      const fileName = `${filePathPrefix}.${ext}`;
      const filePath = `${filePathPrefix}/${fileName}`;

      // Upload the new file, upserting if it exists
      const { error: uploadError } = await supabase.storage
        .from(storageBucket)
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from(storageBucket)
        .getPublicUrl(filePath);

      if (!publicUrlData?.publicUrl) {
        setStatus({ type: 'error', message: 'Failed to get image URL' });
        return;
      }

      setSettings(prev => ({ ...prev, [settingsKey]: publicUrlData.publicUrl }));
      setStatus({ type: 'success', message: `${settingsKey} uploaded successfully!` });
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
        // Update existing row
        await supabase.from('site_settings').update(settings).eq('id', existing.id);
      } else {
        // Insert new row
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
          <button className="admin-settings-upload-button" onClick={() => handleUploadClick(logoFileInputRef)}>
            📤 Upload Logo
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

      {/* --- Hero Image Section (NEW) --- */}
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
          <button className="admin-settings-upload-button" onClick={() => handleUploadClick(heroFileInputRef)}>
            📤 Upload Profile Image
          </button>
          <input
            className="admin-settings-file-input"
            ref={heroFileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange(heroFileInputRef, 'ritwrites-images', 'hero_image_url', 'profiles/ritika')}
          />
        </div>
      </div>


      <button className="admin-settings-save-button" onClick={save} disabled={saving}>
        {saving ? 'Saving...' : 'Save Settings'}
      </button>
    </div>
  );
}