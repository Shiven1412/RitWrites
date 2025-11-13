import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
  background-color: #191970;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LogoContainer = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: opacity 0.3s ease;
  
  &:hover {
    opacity: 0.85;
  }
`;

const LogoImage = styled.img`
  height: 40px;
  width: auto;
  object-fit: contain;
`;

const LogoText = styled.span`
  font-size: 1.25rem;
  font-weight: 600;
  color: #f5f5dc;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
`;

const NavLink = styled(Link)`
  color: #f5f5dc;
  font-size: 1rem;
  transition: all 0.3s ease;
  font-weight: 500;
  
  &:hover {
    color: #d4af37;
  }
`;

const Button = styled(Link)`
  font-size: 0.95rem;
  padding: 0.65rem 1.25rem;
  background-color: #d4af37;
  border-radius: 0.375rem;
  color: #191970;
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-block;
  
  &:hover {
    background-color: #f5f5dc;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
  }
`;

const UserSpan = styled.span`
  margin-left: 0.5rem;
  color: #f5f5dc;
  font-weight: 500;
  font-size: 0.95rem;
`;

export default function Navbar({ user, profile, siteSettings }) {
  const logoUrl = siteSettings?.logo_url || null;

  return (
    <Nav>
      <LogoContainer to="/">
        {logoUrl && <LogoImage src={logoUrl} alt="Logo" />}
        <LogoText>RitWrites</LogoText>
      </LogoContainer>
      <NavLinks>
        <NavLink to="/">Blog</NavLink>
        <NavLink to="/portfolio">Portfolio</NavLink>
        <NavLink to="/contact">Contact</NavLink>
        {profile?.is_admin && <Button to="/admin">Admin</Button>}
        {user ? (
          <>
            <UserSpan>{profile?.full_name || user.email}</UserSpan>
            <Button to="/logout">Log Out</Button>
          </>
        ) : (
          <NavLink to="/login">Login</NavLink>
        )}
      </NavLinks>
    </Nav>
  );
}
