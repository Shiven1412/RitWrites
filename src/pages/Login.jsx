import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  async function signIn() {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) alert(error.message);
    else { alert('Check your email for a magic link.'); navigate('/'); }
  }

  return (
    <div className="login-container">
      <h1 className="login-title">Login / Sign up</h1>
      <p className="login-description">Enter your email to receive a magic link.</p>
      <div className="login-form-group">
        <input 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          placeholder="you@example.com"
          className="login-input"
        />
        <div className="login-button-group">
          <button onClick={signIn} className="login-button">Send magic link</button>
        </div>
      </div>
    </div>
  );
}
