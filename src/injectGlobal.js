import { injectGlobal } from 'styled-components';
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

  body {
    font-family: 'Source Sans Pro', sans-serif;
    line-height: 1.7857;
  }

  h1, p {
    margin: 0;
  }
`;
