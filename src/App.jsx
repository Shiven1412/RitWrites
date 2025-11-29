import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';
import { PageTransition } from './components/PageTransition';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Blog from './pages/Blog';
import PostPage from './pages/PostPage';
import Portfolio from './pages/Portfolio';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Logout from './pages/Logout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminEditor from './pages/admin/AdminEditor';
import PortfolioEditor from './pages/admin/PortfolioEditor';
import AdminSettings from './pages/admin/AdminSettings';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

export default function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [siteSettings, setSiteSettings] = useState(null);

  useEffect(() => {
    fetchSiteSettings();
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session?.user || null);
      if (data.session?.user) fetchProfile(data.session.user.id);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((event, sess) => {
      setSession(sess?.user || null);
      if (sess?.user) fetchProfile(sess.user.id);
      else setProfile(null);
      // Re-fetch site settings on auth change (in case settings were saved)
      fetchSiteSettings();
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function fetchSiteSettings() {
    const { data } = await supabase.from('site_settings').select('*').single().catch(() => ({ data: null }));
    // siteSettings now contains hero_image_url
    setSiteSettings(data);
  }

  async function fetchProfile(userId) {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (data) {
      setProfile(data);
    } else {
      // Create basic profile row
      // Make the first user an admin by checking if any admin exists
      const { data: adminExists } = await supabase
        .from('profiles')
        .select('id')
        .eq('is_admin', true)
        .limit(1);
      
      const isFirstAdmin = !adminExists || adminExists.length === 0;
      
      const { data: ins } = await supabase
        .from('profiles')
        .insert([{ id: userId, is_admin: isFirstAdmin }])
        .select()
        .single();
      setProfile(ins || null);
    }
  }

  return (
    <Router>
      <div className="app-container">
        <Navbar user={session} profile={profile} siteSettings={siteSettings} />
        {/* Pass siteSettings to RouteWrapper so Home can access it */}
        <RouteWrapper supabase={supabase} session={session} profile={profile} siteSettings={siteSettings} />
      </div>
    </Router>
  );
}

function RouteWrapper({ supabase, session, profile, siteSettings }) {
  const location = useLocation();

  return (
    <PageTransition pageKey={location.pathname} transitionType="flip">
      <Routes>
        {/* Pass siteSettings to Home */}
        <Route path="/" element={<Home supabase={supabase} siteSettings={siteSettings} />} />
        <Route path="/blog" element={<Blog supabase={supabase} />} />
        <Route path="/post/:slug" element={<PostPage supabase={supabase} user={session} />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />

        <Route path="/admin" element={<ProtectedRoute profile={profile}><AdminDashboard supabase={supabase} /></ProtectedRoute>} />
        <Route path="/admin/new" element={<ProtectedRoute profile={profile}><AdminEditor user={session} profile={profile} /></ProtectedRoute>} />
        <Route path="/admin/portfolio/new" element={<ProtectedRoute profile={profile}><PortfolioEditor profile={profile} /></ProtectedRoute>} />
        <Route path="/admin/portfolio/:id" element={<ProtectedRoute profile={profile}><PortfolioEditor profile={profile} /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute profile={profile}><AdminSettings profile={profile} /></ProtectedRoute>} />
      </Routes>
    </PageTransition>
  );
}