import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import './Logout.css';

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        await supabase.auth.signOut();
        navigate('/', { replace: true });
      } catch (error) {
        console.error('Logout error:', error);
        navigate('/', { replace: true });
      }
    };
    logout();
  }, [navigate]);

  return (
    <div className="logout-container">
      <p className="logout-message">Logging out...</p>
    </div>
  );
}
