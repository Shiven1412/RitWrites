import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 28rem;
  margin: 0 auto;
  padding: 1.5rem;
  text-align: center;
`;

const Message = styled.p`
  font-size: 1rem;
  color: #374151;
  margin-top: 1rem;
`;

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
    <Container>
      <Message>Logging out...</Message>
    </Container>
  );
}
