import { injectGlobal } from 'styled-components';
import theme from './theme';
import 'normalize.css';

injectGlobal`
  @import url("https://use.typekit.net/ldn8onu.css");

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
  }

  html,
  body,
  #root {
    height: 100%;
  }

  html {
    font-family: 'source-sans-pro', sans-serif;
    line-height: ${theme.baseLineHeight};
    font-size: ${theme.baseFontSize}px;
    color: ${theme.color.text};
  }

  h1, p {
    margin: 0;
  }

  textarea,
  input {
    font: inherit;
    line-height: inherit;
    border: 0;
    outline: 0;
    padding: 0;
  }

  textarea {
    display: block;
    resize: none;
  }

  button {
    appearance: none;
    border: 0;
    background: none;
    padding: 0;
    font-family: inherit;
    color: inherit;
    cursor: pointer;
    text-align: inherit;
    cursor: pointer;
    line-height: inherit;
  }

  ul {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }
`;
