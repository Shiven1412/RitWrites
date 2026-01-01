import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import profilePhoto from '../assets/photo_2025-11-15_15-27-49.jpg';
import './Home.css';
import { Smile, Send, CheckCircle } from 'lucide-react';
import { CurvyText } from '../components/CurvyText';

export default function Home({ supabase }) {
  const navigate = useNavigate();
  const [latestProjects, setLatestProjects] = useState([]);
  const [latestPosts, setLatestPosts] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    // 1. Fetch Top 3 Portfolio Projects (Latest)
    const { data: projectsData } = await supabase
      .from('portfolio')
      .select('id, title, link, image_url')
      .order('created_at', { ascending: false })
      .limit(3);
    setLatestProjects(projectsData || []);

    // 2. Fetch Top 3 Blog Posts (Latest)
    const { data: postsData } = await supabase
      .from('posts')
      .select('id, title, slug, created_at')
      .order('created_at', { ascending: false })
      .limit(3);
    setLatestPosts(postsData || []);
  }

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Use a custom modal or message box for alerts/confirms if connecting to backend
    alert('Thank you for subscribing to the newsletter!');
  };

  return (
    <div className="home-container">
      {/* 1. Hero Section (Content Writer Persona) */}
      <section className="home-hero">
        <div className="hero-content">
          <div className="hero-secondary-line">[THOUGHT LEADERSHIP & CLARITY]</div>
          <h1 className="hero-title">I craft narratives that elevate your brand.</h1>
          <p className="hero-subtitle">[MA ENGLISH, RESEARCHER, AND STRATEGIC CONTENT WRITER]</p>
          <div className="hero-ctas">
            <a className="cta primary" href="/contact">
              Hire Me For Content 
              <span className="ml-2">↗</span>
            </a>
          </div>
        </div>
        
        <div className="hero-visuals">
          <div className="image-placeholder">
            <img src={profilePhoto} alt="Ritika Bisht" />
          </div>
          <div className="floating-element one"><Smile size={32} strokeWidth={1} color="var(--color-text-dark)" /></div>
          <div className="floating-element two"><Smile size={24} strokeWidth={1} color="var(--color-text-dark)" /></div>
          <div className="floating-element three">hi, i'm ritika!</div>
        </div>
      </section>

      {/* Curvy Marquee Separator 1 - Moving Text */}
      <CurvyText text="Research ☞ Proofreading ☞ Strategic Articles ☞ Journal Editing" color="var(--color-green-accent)" textColor="var(--color-text-dark)" reverse={false} />

      {/* 2. Creative Playground / Services Intro (CW Focus) */}
      <section className="services-intro-section">
        <div className="services-welcome">
          <h2 className="section-title-script">My Creative Space</h2>
          <h3 className="section-title-curvy">The Content Workshop</h3>
          {/* <div className="flower-icon">📝</div> */}
        </div>
        
        <p className="services-description">
          I provide dedicated writing services from conception to final edit. Whether you need deep technical research, compelling blog content, or detailed proofreading, I ensure your voice is clear, credible, and impactful.
        </p>

        <div className="service-tags">
          <div className="tag brand-design">Article Writing</div>
          <div className="tag website-design">Technical Research</div>
          <div className="tag brand-collateral">Detailed Proofreading</div>
        </div>
        
        <div className="pricing-guide-cta">
          <button className="cta primary">See My Full Service List <Send size={18} /></button>
        </div>
      </section>

      {/* Curvy Marquee Separator 2 - Moving Text */}
      <CurvyText text="Clarity ☞ Credibility ☞ Impact ☞ Research ☞ Clarity ☞ Credibility ☞" color="var(--color-pink-primary)" textColor="var(--background)" reverse={true} />

      {/* 3. Portfolio / Projects Section (Latest 3 Projects) */}
      <section className="projects-section">
        <h2 className="projects-title">Browse my Favorite Projects</h2>
        <div className="project-grid">
          {latestProjects.length > 0 ? (
            latestProjects.map(p => (
              <div key={p.id} className="project-card">
                <img src={p.image_url || 'https://placehold.co/400x300/ff48a6/fff?text=Project'} alt={p.title} className="project-image" />
                <p className="project-card-title">{p.title}</p>
                <div className="project-tags">
                  <span className="tag">Content Strategy</span>
                  <span className="tag">Editing</span>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">No favorite projects found yet.</p>
          )}
        </div>
        <Link to="/portfolio" className="cta secondary view-all-btn">
          View All Content <span className="ml-2">↗</span>
        </Link>
      </section>

      {/* Curvy Marquee Separator 3 - Moving Text */}
      <CurvyText text="Quality Content Builds Authority! Authority Builds Trust!" color="var(--color-orange-cta)" textColor="var(--background)" reverse={false} />

      {/* 4. Resources / Shop Section (Top 3 Blog Posts) */}
      <section className="resources-section">
        <h2 className="resources-title">Top 3 Insights from the Blog 👇</h2>
        <div className="resource-grid">
          {latestPosts.length > 0 ? (
            latestPosts.map(p => (
              <Link to={`/post/${p.slug}`} key={p.id} className="resource-card block">
                <div className="resource-visual">
                  <p className="text-xs text-gray-700 italic">Posted: {new Date(p.created_at).toLocaleDateString()}</p>
                </div>
                <p className="resource-title">{p.title}</p>
                <p className="resource-price">Read Post</p>
              </Link>
            ))
          ) : (
             <p className="col-span-full text-center text-gray-500">No blog posts found yet.</p>
          )}
        </div>
        <Link to="/blog" className="cta secondary shop-btn">Read All Articles</Link>
      </section>

      {/* 5. Large Footer (Fixed Layout) */}
      <footer className="footer-section">
        <div className="footer-links-group">
          {/* Column 1: For Clients (Content Writer Focus) */}
          <div className="footer-column">
            <h3>(For Clients)</h3>
            <Link to="/contact">Work with Me</Link>
            <a href="#">Article Samples</a>
            <a href="#">About Ritika</a>
            <a href="#">Project Inquiry</a>
            <a href="#">Article Writing</a>
            <a href="#">Proofreading</a>
            <a href="#">Content Strategy</a>
          </div>

          {/* Column 2: For Creatives (Relevant to Writing/Blogging) */}
          <div className="footer-column">
            <h3>(For Creatives)</h3>
            <a href="https://drive.google.com/drive/folders/1XWTmsGGwRrUnVOU7HHAfrYnXW9tw5TMq?usp=drive_link">Writing Templates</a>
            <a href="https://drive.google.com/drive/folders/1gbcmpfdZ2ejfF640ilDDwGNsuc0OEsQ2?usp=drive_link">Editing Guides</a>
            <Link to="/blog">Read the Blog</Link>
            <a href="https://drive.google.com/drive/folders/1X3ZNqreDInBNgvOI-AeG4uDie7U4Jl2w?usp=drive_link">Article Samples</a>
            <a href="/contact">Mentorship</a> 
          </div>

          {/* Column 3: Links */}
          <div className="footer-column">
            <h3>(Links)</h3>
            <a href="https://www.instagram.com/ritwrites">Instagram</a>
            <a href="https://x.com/Ritwritesx">Twitter</a>
            <a href="https://www.linkedin.com/in/ritika-bisht-8a9a79238/">LinkedIn</a>
            <a href="https://medium.com/@ritikabish05">Medium</a>
            <a href="/contact">Contact</a>
          </div>

          {/* Column 4: Newsletter & Contact (Re-ordered) */}
          <div className="footer-column contact-newsletter-group">
            <div className="contact-info">
              <p className="contact-email">Email us — <a href="Ritwritesblog@gmail.com">Ritwritesblog@gmail.com</a> <Smile size={16} /></p>
            </div>
            
            <div className="newsletter-box mt-4">
              <h3>Get the Newsletter <CheckCircle size={18} className="inline-block text-white" /></h3>
              <p className="newsletter-privacy">We respect your privacy.</p>
              <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
                <input type="email" placeholder="EMAIL ADDRESS" className="newsletter-input" required />
                <button type="submit" className="cta primary subscribe-button">Subscribe ↗</button>
              </form>
            </div>
          </div>
        </div>
        
        {/* Large Logo Graphic (Outline) */}
        <div className="footer-logo-graphic">
          <p>ritwrites</p>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <p className="copyright">COPYRIGHT RITWRITES 2025</p>
          <div className="footer-meta-links">
            <a href="#">PRIVACY POLICY</a>
            <a href="#">TERMS & CONDITIONS</a>
          </div>
        </div>
      </footer>
    </div>
  );
}