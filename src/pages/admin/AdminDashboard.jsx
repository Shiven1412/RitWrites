import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { supabase } from '../../lib/supabaseClient';

const Container = styled.div`
  max-width: 72rem;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 600;
  color: #191970;
  margin-bottom: 1.5rem;
`;

const TabContainer = styled.div`
  margin-bottom: 2rem;
`;

const TabButtons = styled.div`
  display: flex;
  gap: 1rem;
  border-bottom: 3px solid #191970;
  margin-bottom: 1.5rem;
`;

const TabButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.active ? '#191970' : '#f5f5dc'};
  color: ${props => props.active ? '#f5f5dc' : '#191970'};
  border: 2px solid #191970;
  border-bottom: none;
  border-radius: 0.5rem 0.5rem 0 0;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #191970;
    color: #f5f5dc;
  }
`;

const ActionBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const NewButton = styled(Link)`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #191970;
  color: #f5f5dc;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    background-color: #0a0a3a;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(25, 25, 112, 0.3);
  }
`;

const ItemList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ItemCard = styled.li`
  padding: 1.5rem;
  border: 2px solid #191970;
  border-radius: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(25, 25, 112, 0.1);

  &:hover {
    box-shadow: 0 8px 16px rgba(25, 25, 112, 0.2);
    transform: translateY(-4px);
  }
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemTitle = styled.div`
  font-weight: 600;
  color: #191970;
  font-size: 1.25rem;
`;

const ItemDate = styled.div`
  font-size: 0.95rem;
  color: #999999;
  margin-top: 0.5rem;
`;

const ItemActions = styled.div`
  display: flex;
  gap: 1rem;
`;

const ActionLink = styled(Link)`
  text-decoration: underline;
  color: #191970;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:hover {
    color: #d4af37;
  }
`;

const DeleteButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #dc2626;
  color: #ffffff;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #b91c1c;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const EditButton = styled(Link)`
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: #ffffff;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    background-color: #2563eb;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #999999;
  font-size: 1.1rem;
`;

const SettingsLink = styled(Link)`
  display: block;
  text-align: center;
  padding: 2rem;
  background-color: #ffffff;
  border: 2px solid #191970;
  border-radius: 0.5rem;
  color: #191970;
  font-weight: 600;
  font-size: 1.1rem;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    background-color: #191970;
    color: #f5f5dc;
    transform: translateY(-2px);
  }
`;

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
    fetchPortfolio();
  }, []);

  async function fetchPosts() {
    const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    setPosts(data || []);
  }

  async function fetchPortfolio() {
    const { data } = await supabase.from('portfolio').select('*').order('created_at', { ascending: false });
    setPortfolio(data || []);
  }

  async function deletePost(id) {
    if (!confirm('Delete this post?')) return;
    await supabase.from('posts').delete().eq('id', id);
    fetchPosts();
  }

  async function deletePortfolio(id) {
    if (!confirm('Delete this portfolio item?')) return;
    await supabase.from('portfolio').delete().eq('id', id);
    fetchPortfolio();
  }

  return (
    <Container>
      <Title>Admin Dashboard</Title>

      <TabContainer>
        <TabButtons>
          <TabButton active={activeTab === 'posts'} onClick={() => setActiveTab('posts')}>
            📝 Blog Posts
          </TabButton>
          <TabButton active={activeTab === 'portfolio'} onClick={() => setActiveTab('portfolio')}>
            🎨 Portfolio
          </TabButton>
          <TabButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')}>
            ⚙️ Settings
          </TabButton>
        </TabButtons>

        {activeTab === 'posts' && (
          <>
            <ActionBar>
              <NewButton to="/admin/new">+ New Post</NewButton>
            </ActionBar>
            {posts.length === 0 ? (
              <EmptyState>No blog posts yet. Create your first post!</EmptyState>
            ) : (
              <ItemList>
                {posts.map(p => (
                  <ItemCard key={p.id}>
                    <ItemInfo>
                      <ItemTitle>{p.title}</ItemTitle>
                      <ItemDate>{new Date(p.created_at).toLocaleString()}</ItemDate>
                    </ItemInfo>
                    <ItemActions>
                      <ActionLink to={`/post/${p.slug}`}>View</ActionLink>
                      <DeleteButton onClick={() => deletePost(p.id)}>Delete</DeleteButton>
                    </ItemActions>
                  </ItemCard>
                ))}
              </ItemList>
            )}
          </>
        )}

        {activeTab === 'portfolio' && (
          <>
            <ActionBar>
              <NewButton to="/admin/portfolio/new">+ New Project</NewButton>
            </ActionBar>
            {portfolio.length === 0 ? (
              <EmptyState>No portfolio items yet. Showcase your work!</EmptyState>
            ) : (
              <ItemList>
                {portfolio.map(p => (
                  <ItemCard key={p.id}>
                    <ItemInfo>
                      <ItemTitle>{p.title}</ItemTitle>
                      <ItemDate>{new Date(p.created_at).toLocaleString()}</ItemDate>
                    </ItemInfo>
                    <ItemActions>
                      <EditButton to={`/admin/portfolio/${p.id}`}>Edit</EditButton>
                      <DeleteButton onClick={() => deletePortfolio(p.id)}>Delete</DeleteButton>
                    </ItemActions>
                  </ItemCard>
                ))}
              </ItemList>
            )}
          </>
        )}

        {activeTab === 'settings' && (
          <SettingsLink to="/admin/settings">
            Go to Settings →
          </SettingsLink>
        )}
      </TabContainer>
    </Container>
  );
}
