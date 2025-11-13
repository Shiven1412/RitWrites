import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 48rem;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #191970;
`;

const Content = styled.div`
  font-size: 1rem;
  line-height: 1.7;
  color: #333333;
  margin: 1.5rem 0;

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 1.5rem 0 0.75rem 0;
    color: #191970;
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 1rem 0 0.5rem 0;
    color: #191970;
  }

  p {
    margin-bottom: 1rem;
  }

  img {
    max-width: 100%;
    height: auto;
    margin: 1.5rem 0;
    border-radius: 0.5rem;
    border: 2px solid #191970;
  }

  pre {
    background-color: #f5f5dc;
    border: 2px solid #191970;
    padding: 1.5rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    margin: 1.5rem 0;
  }

  code {
    font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
    font-size: 1rem;
    color: #191970;
  }
`;

const ActionBar = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
`;

const LikeButton = styled.button`
  padding: 0.75rem 1.5rem;
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

const Section = styled.section`
  margin-top: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  color: #191970;
  margin-bottom: 1.5rem;
`;

const CommentForm = styled.form`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #191970;
  border-radius: 0.5rem;
  font-size: 1.1rem;
  font-family: inherit;
  resize: vertical;
  min-height: 120px;
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

const PostCommentButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #191970;
  color: #f5f5dc;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  align-self: flex-start;
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

const LoginPrompt = styled.div`
  font-size: 1rem;
  color: #666666;
  margin-top: 1rem;
  line-height: 1.6;

  a {
    color: #191970;
    text-decoration: underline;
    font-weight: 600;
    transition: color 0.3s ease;

    &:hover {
      color: #d4af37;
    }
  }
`;

const CommentList = styled.ul`
  list-style: none;
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CommentItem = styled.li`
  padding: 1rem;
  border: 2px solid #191970;
  border-radius: 0.5rem;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(25, 25, 112, 0.1);
`;

const CommentContent = styled.div`
  font-size: 1rem;
  color: #333333;
  line-height: 1.6;
`;

const CommentDate = styled.div`
  font-size: 0.9rem;
  color: #999999;
  margin-top: 0.5rem;
  font-style: italic;
`;

const Loading = styled.div`
  padding: 2rem;
  color: #666666;
  font-size: 1.1rem;
  text-align: center;
`;

export default function PostPage({ supabase, user }) {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  useEffect(() => { if (slug) load(); }, [slug]);

  async function load() {
    const { data } = await supabase.from('posts').select('*').eq('slug', slug).single();
    setPost(data);
    if (data?.id) loadComments(data.id);
  }

  async function loadComments(postId) {
    const { data } = await supabase.from('comments').select('*').eq('post_id', postId).order('created_at', { ascending: true });
    setComments(data || []);
  }

  async function like() {
    if (!post) return;
    const { data } = await supabase.from('posts').update({ likes: (post.likes || 0) + 1 }).eq('id', post.id).select().single();
    setPost(data);
  }

  async function addComment(e) {
    e.preventDefault();
    if (!user) return alert('Please log in to comment');
    if (!commentText.trim()) return;
    const { error } = await supabase.from('comments').insert([{ post_id: post.id, user_id: user.id, content: commentText }]);
    if (error) console.error(error); else { setCommentText(''); loadComments(post.id); }
  }

  if (!post) return <Loading>Loading...</Loading>;

  return (
    <Container>
      <Title>{post.title}</Title>
      <Content dangerouslySetInnerHTML={{ __html: post.content }} />
      <ActionBar>
        <LikeButton onClick={like}>Like ({post.likes || 0})</LikeButton>
      </ActionBar>

      <Section>
        <SectionTitle>Discussion</SectionTitle>
        {user ? (
          <CommentForm onSubmit={addComment}>
            <TextArea value={commentText} onChange={e => setCommentText(e.target.value)} rows={3} placeholder="Write a thoughtful comment..."></TextArea>
            <PostCommentButton type="submit">Post comment</PostCommentButton>
          </CommentForm>
        ) : (
          <LoginPrompt>Please <Link to="/login">login</Link> to join the discussion.</LoginPrompt>
        )}

        <CommentList>
          {comments.map(c => (
            <CommentItem key={c.id}>
              <CommentContent>{c.content}</CommentContent>
              <CommentDate>{new Date(c.created_at).toLocaleString()}</CommentDate>
            </CommentItem>
          ))}
        </CommentList>
      </Section>
    </Container>
  );
}
