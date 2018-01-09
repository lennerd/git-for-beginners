import { injectGlobal } from 'styled-components';
import theme from './theme';
import 'normalize.css';

injectGlobal`
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');
  @import url('https://fonts.googleapis.com/css?family=Source+Code+Pro:400,900');

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
    font-family: inherit;
    color: inherit;
    cursor: pointer;
  }
`;
