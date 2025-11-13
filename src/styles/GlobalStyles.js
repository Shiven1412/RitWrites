import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root{
    --color-bg: #fafafa;
    --color-text: #333333;
    --color-primary: #191970;
    --color-accent: #d4af37;
    --container-max: 72rem;
    --gap: 1rem;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body, #root {
    height: 100%;
    width: 100%;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: var(--color-bg);
    color: var(--color-text);
    font-size: 1rem;
    line-height: 1.6;
    font-weight: 400;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    cursor: pointer;
    border: none;
    font-family: inherit;
    font-size: 1rem;
    font-weight: 500;
  }

  input, textarea {
    font-family: inherit;
    font-size: 1rem;
  }

  h1, h2, h3, h4, h5, h6 {
    line-height: 1.3;
    font-weight: 600;
    color: var(--color-primary);
  }

  h1 {
    font-size: 2rem;
  }

  h2 {
    font-size: 1.5rem;
  }

  h3 {
    font-size: 1.25rem;
  }

  p {
    font-weight: 400;
  }

  /* Responsive tweaks */
  @media (max-width: 1024px) {
    :root { --container-max: 56rem; }
  }

  @media (max-width: 768px) {
    body { font-size: 0.95rem; }
    h1 { font-size: 1.5rem; }
    h2 { font-size: 1.125rem; }
    h3 { font-size: 1rem; }
  }
`;

export default GlobalStyles;
