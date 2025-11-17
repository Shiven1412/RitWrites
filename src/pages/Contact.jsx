import React, { useState, useEffect, useRef } from 'react';
import emailjs from '@emailjs/browser';
import './Contact.css';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null);
  const [sending, setSending] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    emailjs.init('SfzHKBr4l1WKNCkWf');
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setStatus(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus({ type: 'error', message: 'Please fill in all fields.' });
      setSending(false);
      return;
    }

    try {
      await emailjs.send(
        'service_3gwl2xw',
        'template_br8okt2',
        {
          to_email: 'ritwritesblog@gmail.com',
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
        }
      );

      setStatus({ type: 'success', message: 'Message sent successfully! I\'ll get back to you soon.' });
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus(null), 5000);
    } catch (error) {
      console.error('EmailJS error:', error);
      setStatus({ type: 'error', message: 'Failed to send message. Please try again.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="contact-container">
      <h1 className="contact-title">Contact</h1>
      <p className="contact-description">
        Get in touch! Fill out the form below and I'll respond as soon as possible.
      </p>
      <form ref={formRef} onSubmit={handleSubmit} className="contact-form">
        <input
          type="text"
          name="name"
          placeholder="Your name"
          value={formData.name}
          onChange={handleChange}
          disabled={sending}
          className="contact-input"
        />
        <input
          type="email"
          name="email"
          placeholder="Your email"
          value={formData.email}
          onChange={handleChange}
          disabled={sending}
          className="contact-input"
        />
        <textarea
          name="message"
          placeholder="Your message"
          value={formData.message}
          onChange={handleChange}
          disabled={sending}
          className="contact-textarea"
        />
        <button type="submit" disabled={sending} className="contact-button">
          {sending ? 'Sending...' : 'Send Message'}
        </button>
      </form>
      {status && <div className={`contact-message contact-message-${status.type}`}>{status.message}</div>}
    </div>
  );
}
