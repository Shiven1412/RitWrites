import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
  background-color: var(--color-primary, #191970);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
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
  color: var(--color-beige, #f5f5dc);
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileToggle = styled.button`
  display: none;
  background: transparent;
  border: 2px solid transparent;
  color: #f5f5dc;
  font-size: 1.25rem;
  padding: 0.35rem 0.5rem;
  border-radius: 0.35rem;

  @media (max-width: 768px) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
`;

const MobileMenu = styled.div`
  position: absolute;
  top: 64px;
  right: 12px;
  background: var(--color-primary, #191970);
  border: 2px solid var(--color-primary, #191970);
  border-radius: 8px;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 1200;

  a, button {
    color: var(--color-beige, #f5f5dc);
    text-decoration: none;
    background: transparent;
    border: none;
    text-align: left;
    padding: 0.5rem 0.75rem;
    font-weight: 600;
  }
`;

const NavLink = styled(Link)`
  color: var(--color-beige, #f5f5dc);
  font-size: 1rem;
  transition: all 0.3s ease;
  font-weight: 500;
  
  &:hover {
    color: var(--color-accent, #d4af37);
  }
`;

const Button = styled(Link)`
  font-size: 0.95rem;
  padding: 0.65rem 1.25rem;
  background-color: var(--color-accent, #d4af37);
  border-radius: 0.375rem;
  color: var(--color-primary, #191970);
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-block;
  
  &:hover {
    background-color: var(--color-beige, #f5f5dc);
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
  const [open, setOpen] = useState(false);
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

      <MobileToggle aria-label="Menu" onClick={() => setOpen(o => !o)}>
        ☰
      </MobileToggle>

      {open && (
        <MobileMenu>
          <NavLink to="/" onClick={() => setOpen(false)}>Blog</NavLink>
          <NavLink to="/portfolio" onClick={() => setOpen(false)}>Portfolio</NavLink>
          <NavLink to="/contact" onClick={() => setOpen(false)}>Contact</NavLink>
          {profile?.is_admin && <Button to="/admin" onClick={() => setOpen(false)}>Admin</Button>}
          {user ? (
            <>
              <UserSpan style={{ padding: '0.5rem 0.75rem' }}>{profile?.full_name || user.email}</UserSpan>
              <Button to="/logout" onClick={() => setOpen(false)}>Log Out</Button>
            </>
          ) : (
            <NavLink to="/login" onClick={() => setOpen(false)}>Login</NavLink>
          )}
        </MobileMenu>
      )}
    </Nav>
  );
}
