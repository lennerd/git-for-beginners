import { injectGlobal } from 'styled-components';
import theme from './theme';
import 'normalize.css';

injectGlobal`
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');
  @import url('https://fonts.googleapis.com/css?family=Source+Code+Pro:400,900');

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
    font-family: 'Source Sans Pro', sans-serif;
    line-height: ${theme.baseLineHeight};
    font-size: ${theme.baseFontSize}px;
    color: ${theme.color.text};
  }

  h1, p {
    margin: 0;
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
  }

  ul {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }
`;
