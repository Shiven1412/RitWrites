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
  const saveSettings = async () => {
    setSaving(true);
    setStatus(null);

    // Only update fields that should be managed by the main save button
    const dataToSave = {
      site_name: settings.site_name,
      site_description: settings.site_description,
      // Note: We don't include logo_url or hero_image_url here, as they are updated
      // immediately upon successful upload within handleImageChange, making the settings
      // object immediately ready for the final update/insert.
    };

    try {
      if (!settings.site_name.trim()) {
        throw new Error('Site name is required.');
      }

      if (settings.id) {
        // Update existing row
        const { error } = await supabase.from('site_settings').update(settings).eq('id', settings.id);
        if (error) throw error;
      } else {
        // Insert new row
        const { data, error } = await supabase.from('site_settings').insert([settings]).select('id').single();
        if (error) throw error;
        // Update local state with the new ID
        setSettings(prev => ({ ...prev, id: data.id }));
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
      // Ensure the file path is unique enough but deterministic for upsert
      const fileName = `${filePathPrefix}.${ext}`;
      const filePath = `${filePathPrefix}/${fileName}`;

      // 1. Upload/Upsert the file
      const { error: uploadError } = await supabase.storage
        .from(storageBucket)
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: publicUrlData } = supabase.storage
        .from(storageBucket)
        .getPublicUrl(filePath);

      if (!publicUrlData?.publicUrl) {
        throw new Error('Failed to get image URL');
      }

      // 3. Update local state with the new URL
      setSettings(prev => ({ ...prev, [settingsKey]: publicUrlData.publicUrl }));
      
      // 4. Immediately save the entire settings object to persist the URL change
      // Since the settings state is updated here, the URL is guaranteed to be in the database after this.
      await saveSettings(); 

      setStatus({ type: 'success', message: `${settingsKey} uploaded and saved successfully!` });
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
      </div>
    </div>
  );
}