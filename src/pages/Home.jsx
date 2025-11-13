import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 72rem;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 2rem;
  color: #191970;
  text-align: center;
`;

const PostList = styled.ul`
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(28rem, 1fr));
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PostItem = styled(Link)`
  text-decoration: none;
  color: inherit;
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

const FeaturedImage = styled.div`
  width: 100%;
  height: 14rem;
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

  ${PostItem}:hover & img {
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

const PostContent = styled.div`
  padding: 1.75rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const PostTitle = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: #191970;
  margin-bottom: 0.75rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PostExcerpt = styled.div`
  font-size: 0.9rem;
  color: #666666;
  margin-bottom: 1rem;
  line-height: 1.6;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PostFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 2px solid #f5f5dc;
  padding-top: 1rem;
  margin-top: auto;
`;

const PostDate = styled.div`
  font-size: 0.9rem;
  color: #999999;
  font-style: italic;
`;

const LikesCount = styled.div`
  font-size: 1rem;
  color: #191970;
  font-weight: 700;
`;

export default function Home({ supabase }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => { fetchPosts(); }, []);

  async function fetchPosts() {
    const { data } = await supabase.from('posts').select('id,title,slug,created_at,likes,content').order('created_at', { ascending: false });
    setPosts(data || []);
  }

  const extractFirstImage = (html) => {
    if (!html) return null;
    const imgMatch = html.match(/<img[^>]+src="([^">]+)"/);
    return imgMatch ? imgMatch[1] : null;
  };

  const extractExcerpt = (html) => {
    if (!html) return '';
    // Remove HTML tags and get plain text
    const plainText = html.replace(/<[^>]*>/g, '').trim();
    // Limit to first 150 characters
    return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;
  };

  return (
    <Container>
      <Title>Latest Posts</Title>
      <PostList>
        {posts.map(p => {
          const firstImage = extractFirstImage(p.content);
          const excerpt = extractExcerpt(p.content);

          return (
            <PostItem key={p.id} as={Link} to={`/post/${p.slug}`}>
              <FeaturedImage>
                {firstImage ? (
                  <img src={firstImage} alt={p.title} />
                ) : (
                  <NoImagePlaceholder>📝</NoImagePlaceholder>
                )}
              </FeaturedImage>
              <PostContent>
                <PostTitle>{p.title}</PostTitle>
                {excerpt && <PostExcerpt>{excerpt}</PostExcerpt>}
                <PostFooter>
                  <PostDate>{new Date(p.created_at).toLocaleDateString()}</PostDate>
                  <LikesCount>❤️ {p.likes || 0}</LikesCount>
                </PostFooter>
              </PostContent>
            </PostItem>
          );
        })}
      </PostList>
    </Container>
  );
}
