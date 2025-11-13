import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { supabase } from '../lib/supabaseClient';

const Container = styled.div`
  max-width: 72rem;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #191970;
  text-align: center;
`;

const Description = styled.p`
  font-size: 1rem;
  color: #666666;
  text-align: center;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const ProjectList = styled.ul`
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(26rem, 1fr));
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProjectItem = styled.li`
  border: 3px solid #191970;
  border-radius: 0.75rem;
  background-color: #ffffff;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(25, 25, 112, 0.12);
  display: flex;
  flex-direction: column;
  height: 100%;

  &:hover {
    box-shadow: 0 16px 32px rgba(25, 25, 112, 0.25);
    transform: translateY(-8px);
    border-color: #d4af37;
  }
`;

const ProjectImage = styled.div`
  width: 100%;
  height: 12rem;
  background: linear-gradient(135deg, #191970 0%, #f5f5dc 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }

  ${ProjectItem}:hover & img {
    transform: scale(1.08);
  }
`;

const NoImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #191970 0%, #d4af37 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
`;

const ProjectContent = styled.div`
  padding: 1.75rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ProjectTitle = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: #191970;
  margin-bottom: 0.75rem;
  line-height: 1.4;
`;

const ProjectDesc = styled.div`
  font-size: 0.95rem;
  color: #666666;
  line-height: 1.6;
  margin-bottom: 1rem;
  flex: 1;
`;

const ProjectLink = styled.a`
  display: inline-block;
  padding: 0.65rem 1.25rem;
  background-color: #191970;
  color: #f5f5dc;
  border-radius: 0.375rem;
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  transition: all 0.3s ease;
  width: fit-content;

  &:hover {
    background-color: #0a0a3a;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(25, 25, 112, 0.3);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #666666;

  p {
    font-size: 1.1rem;
    margin-top: 1rem;
  }
`;

export default function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('portfolio')
        .select('*')
        .order('created_at', { ascending: false });
      setProjects(data || []);
    } catch (err) {
      console.error('Error fetching portfolio:', err);
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <Container>
        <Title>Portfolio</Title>
        <EmptyState>Loading...</EmptyState>
      </Container>
    );
  }

  if (projects.length === 0) {
    return (
      <Container>
        <Title>Portfolio</Title>
        <EmptyState>
          <p>No projects yet. Check back soon!</p>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Portfolio</Title>
      <Description>
        A showcase of my recent work and projects.
      </Description>
      <ProjectList>
        {projects.map(p => (
          <ProjectItem key={p.id}>
            <ProjectImage>
              {p.image_url ? (
                <img src={p.image_url} alt={p.title} />
              ) : (
                <NoImagePlaceholder>🎨</NoImagePlaceholder>
              )}
            </ProjectImage>
            <ProjectContent>
              <ProjectTitle>{p.title}</ProjectTitle>
              <ProjectDesc>{p.description}</ProjectDesc>
              {p.link && (
                <ProjectLink href={p.link} target="_blank" rel="noopener noreferrer">
                  View Project →
                </ProjectLink>
              )}
            </ProjectContent>
          </ProjectItem>
        ))}
      </ProjectList>
    </Container>
  );
}
