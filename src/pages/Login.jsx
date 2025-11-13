import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 28rem;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #ffffff;
  border: 2px solid #191970;
  border-radius: 0.75rem;
  box-shadow: 0 4px 12px rgba(25, 25, 112, 0.15);
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: #191970;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  font-size: 1.1rem;
  color: #666666;
  margin-top: 1rem;
  line-height: 1.6;
`;

const FormGroup = styled.div`
  margin-top: 1.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #191970;
  border-radius: 0.5rem;
  font-size: 1.1rem;
  transition: all 0.3s ease;
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

const ButtonGroup = styled.div`
  margin-top: 1rem;
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: #191970;
  color: #f5f5dc;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  border: 2px solid #191970;

  &:hover {
    background-color: #0a0a3a;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(25, 25, 112, 0.3);
  }

  &:active {
    transform: scale(0.98);
  }
`;

export default function Login() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  async function signIn() {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) alert(error.message);
    else { alert('Check your email for a magic link.'); navigate('/'); }
  }

  return (
    <Container>
      <Title>Login / Sign up</Title>
      <Description>Enter your email to receive a magic link.</Description>
      <FormGroup>
        <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
        <ButtonGroup>
          <Button onClick={signIn}>Send magic link</Button>
        </ButtonGroup>
      </FormGroup>
    </Container>
  );
}
