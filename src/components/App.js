import React from 'react';
import { Helmet } from 'react-helmet';
import { Route } from 'react-router-dom';
import styled from 'styled-components';

import Tutorial from './Tutorial';

const AppWrapper = styled.div`
  height: 100%;
`;

function App() {
  return (
    <AppWrapper>
      <Helmet titleTemplate="%s — Learn Git" defaultTitle="Learn Git" />
      <Route component={Tutorial} />
    </AppWrapper>
  );
}

export default App;
