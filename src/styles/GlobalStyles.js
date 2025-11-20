import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  /* Overrides to harmonize with index.css playful theme */
  :root{
    --color-bg: var(--background);
    --color-text: var(--foreground);
    --color-primary: var(--primary);
    --color-accent: var(--accent);
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
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: var(--background); 
    color: var(--foreground);
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
    color: var(--primary);
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
    background-color: var(--input-background);
    color: var(--foreground);
    border: 1px solid var(--border);
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading); /* Using DM Serif Display */
    font-style: italic;
    line-height: 1.3;
    font-weight: 400;
    color: var(--foreground); /* Dark text color */
  }

  h1 {
    font-size: 3.5rem;
  }

  h2 {
    font-size: 2.5rem;
  }

  h3 {
    font-size: 1.8rem;
  }

  p {
    font-weight: 400;
    color: var(--foreground);
  }

  /* Responsive tweaks */
  @media (max-width: 1024px) {
    :root { --container-max: 56rem; }
  }

  @media (max-width: 768px) {
    body { font-size: 0.95rem; }
    h1 { font-size: 2.5rem; }
    h2 { font-size: 1.8rem; }
    h3 { font-size: 1.4rem; }
  }
`;

export default GlobalStyles;