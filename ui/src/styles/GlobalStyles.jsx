import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html {
    min-width: 320px;
    background: #f3f6fb;
    scroll-behavior: smooth;
  }

  body {
    min-width: 320px;
    margin: 0;
    color: #172b4d;
    font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }

  button,
  input,
  select,
  textarea {
    font: inherit;
  }

  a {
    color: #0067b1;
  }

  a:focus-visible,
  button:focus-visible,
  input:focus-visible,
  select:focus-visible,
  textarea:focus-visible {
    outline: 3px solid rgba(0, 103, 177, 0.3);
    outline-offset: 2px;
  }

  .landing {
    width: min(1120px, 100%);
    margin: 0 auto;
    padding: 48px 24px 64px;
  }

  .landing__hero {
    position: relative;
    overflow: hidden;
    padding: clamp(32px, 6vw, 72px);
    border-radius: 20px;
    color: #fff;
    background: linear-gradient(118deg, #003a8c 0%, #005eb8 58%, #0879c9 100%);
    box-shadow: 0 20px 48px rgba(0, 49, 112, 0.2);
  }

  .landing__hero::after {
    position: absolute;
    right: -90px;
    bottom: -240px;
    width: 440px;
    height: 440px;
    border: 72px solid rgba(104, 190, 0, 0.8);
    border-radius: 50%;
    content: "";
    pointer-events: none;
  }

  .landing__hero > * {
    position: relative;
    z-index: 1;
  }

  .landing__hero > img {
    width: 140px;
    height: 78px;
    margin-bottom: 28px;
    object-fit: contain;
    object-position: left center;
    filter: brightness(0) invert(1);
  }

  .landing__hero h1 {
    max-width: 760px;
    margin: 0 0 16px;
    font-size: clamp(32px, 5vw, 52px);
    line-height: 1.12;
    letter-spacing: -0.035em;
  }

  .landing__hero p {
    max-width: 620px;
    margin: 0;
    color: rgba(255, 255, 255, 0.88);
    font-size: 18px;
  }

  .landing__cta {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 30px;
  }

  .landing__cta button {
    min-width: 142px;
  }

  .landing__cta button.landing__primary {
    color: #004b97;
    border-color: #fff;
    background: #fff;
    font-weight: 700;
  }

  .landing__cta button.landing__secondary {
    color: #fff;
    border-color: rgba(255, 255, 255, 0.65);
  }

  .landing__features {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 18px;
    margin-top: 24px;
  }

  .landing__feature {
    padding: 24px;
    border: 1px solid #e1e8f0;
    border-radius: 14px;
    background: #fff;
    box-shadow: 0 6px 20px rgba(21, 43, 77, 0.045);
  }

  .landing__feature h2 {
    margin: 0 0 8px;
    color: #123766;
    font-size: 18px;
  }

  .landing__feature p {
    margin: 0;
    color: #586b82;
    font-size: 14px;
  }

  .login,
  .register,
  .forgot-password,
  .reset-password {
    display: flex;
    min-height: calc(100vh - 104px);
    align-items: flex-start;
    justify-content: center;
    padding: clamp(32px, 6vh, 68px) 20px;
    background:
      radial-gradient(ellipse at 92% 18%, rgba(3, 117, 204, 0.78), transparent 36%),
      linear-gradient(125deg, #003a8c 0%, #0056ad 55%, #0074bd 100%);
  }

  .login {
    align-items: center;
  }

  .login > div,
  .register > div,
  .forgot-password > div,
  .reset-password > div {
    width: min(100%, 560px);
    padding: clamp(28px, 5vw, 48px);
    border: 0;
    border-top: 4px solid #78be20;
    border-radius: 16px;
    background: #fff;
    box-shadow: 0 24px 64px rgba(0, 25, 68, 0.28);
  }

  .register > div {
    width: min(100%, 620px);
    padding: 32px;
  }

  .login h1,
  .register h1,
  .forgot-password h1,
  .reset-password h1 {
    margin: 0 0 20px;
    color: #123766;
    font-size: clamp(25px, 3vw, 32px);
    font-weight: 500;
    text-align: center;
  }

  .login label,
  .register label,
  .forgot-password label,
  .reset-password label {
    color: #244467;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.045em;
    text-transform: uppercase;
  }

  .login input,
  .register input,
  .forgot-password input,
  .reset-password input,
  .register select {
    min-height: 42px;
    border-color: #aab8ca;
    border-radius: 4px;
    background: #fff;
  }

  .login form > button,
  .register form > button,
  .forgot-password form > button,
  .reset-password form > button {
    width: 100%;
    min-height: 56px;
    margin-top: 8px;
    border-radius: 3px;
    background: #0067b1;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .login__links {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 20px;
    font-size: 14px;
  }

  .register__footnote {
    margin: 22px 0 0;
    color: #586b82;
    font-size: 14px;
    text-align: center;
  }

  .register .grid-2 {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  .register .grid-2 > div {
    min-width: 0;
    margin-bottom: 10px;
  }

  .register__intro {
    margin: -8px 0 20px;
    color: #64758b;
    font-size: 15px;
    text-align: center;
  }

  .register label input[type="checkbox"] {
    width: 18px;
    min-height: 18px;
    margin-top: 2px;
  }

  .register form > div {
    margin-bottom: 10px;
  }

  .register label input[type="checkbox"] + span {
    color: #41566f;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0;
    text-transform: none;
  }

  @media (max-width: 680px) {
    .landing {
      padding: 24px 16px 40px;
    }

    .landing__hero {
      border-radius: 14px;
    }

    .landing__hero > img {
      width: 120px;
      height: 68px;
      margin-bottom: 20px;
    }

    .register > div {
      padding: 24px 20px;
    }

    .landing__features {
      grid-template-columns: 1fr;
    }

    .register .grid-2 {
      grid-template-columns: 1fr;
      gap: 0;
    }

    .login,
    .register,
    .forgot-password,
    .reset-password {
      align-items: flex-start;
      min-height: calc(100vh - 96px);
      padding: 24px 14px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    html {
      scroll-behavior: auto;
    }
  }
`;
