import React, { useState, useEffect, useRef } from 'react';
import emailjs from '@emailjs/browser';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 42rem;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  color: #191970;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  margin-top: 1rem;
  color: #666666;
  font-size: 1.1rem;
  line-height: 1.6;
`;

const Form = styled.form`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #191970;
  border-radius: 0.5rem;
  font-size: 1.1rem;
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

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #191970;
  border-radius: 0.5rem;
  font-size: 1.1rem;
  font-family: inherit;
  resize: vertical;
  transition: all 0.3s ease;
  background-color: #ffffff;
  color: #191970;
  min-height: 150px;

  &::placeholder {
    color: #cccccc;
  }

  &:focus {
    outline: none;
    border-color: #d4af37;
    box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.1);
  }
`;

const Button = styled.button`
  padding: 0.75rem 1rem;
  background-color: #191970;
  color: #f5f5dc;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  border: 2px solid #191970;
  align-self: flex-start;
  cursor: pointer;

  &:hover:not(:disabled) {
    background-color: #0a0a3a;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(25, 25, 112, 0.3);
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const Message = styled.div`
  padding: 1rem;
  border-radius: 0.5rem;
  margin-top: 1rem;
  font-size: 1rem;
  font-weight: 600;
  background-color: ${props => props.type === 'success' ? '#dcfce7' : '#fee2e2'};
  color: ${props => props.type === 'success' ? '#16a34a' : '#dc2626'};
  border: 2px solid ${props => props.type === 'success' ? '#16a34a' : '#dc2626'};
`;

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null);
  const [sending, setSending] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    // Initialize EmailJS with your public key
    // Get this from https://dashboard.emailjs.com/admin/account
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
      // Send email using EmailJS
      await emailjs.send(
        'service_3gwl2xw', // Replace with your EmailJS service ID
        'template_br8okt2', // Replace with your EmailJS template ID
        {
          to_email: 'ritwritesblog@gmail.com', // Your email address
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
    <Container>
      <Title>Contact</Title>
      <Description>
        Get in touch! Fill out the form below and I'll respond as soon as possible.
      </Description>
      <Form ref={formRef} onSubmit={handleSubmit}>
        <Input
          type="text"
          name="name"
          placeholder="Your name"
          value={formData.name}
          onChange={handleChange}
          disabled={sending}
        />
        <Input
          type="email"
          name="email"
          placeholder="Your email"
          value={formData.email}
          onChange={handleChange}
          disabled={sending}
        />
        <TextArea
          name="message"
          placeholder="Your message"
          value={formData.message}
          onChange={handleChange}
          disabled={sending}
        />
        <Button type="submit" disabled={sending}>
          {sending ? 'Sending...' : 'Send Message'}
        </Button>
      </Form>
      {status && <Message type={status.type}>{status.message}</Message>}
    </Container>
  );
}
