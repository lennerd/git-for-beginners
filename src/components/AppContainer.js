import React from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';

import Tutorial from './Tutorial';
import Header from './Header';
import NavigationContainer from './NavigationContainer';
import Main from './Main';

const AppWrapper = styled.div`
  height: 100%;
`;

function AppContainer() {
  return (
    <AppWrapper>
      <Helmet titleTemplate="%s — Git for Beginners" defaultTitle="Git for Beginners" />
      <Tutorial>
        <Header pageTitle="Test" />
        <NavigationContainer progress={0} chapters={[{ title: 'Introduction' }, {}, {}, {}, {}, {}, {}, {}, {}, {}]} />
        <Main>Main</Main>
      </Tutorial>
    </AppWrapper>
  );
}

export default AppContainer;
