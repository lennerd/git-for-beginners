import React, { PureComponent } from 'react';
import { Helmet } from 'react-helmet';
import { Route } from 'react-router-dom';
import styled from 'styled-components';

import AppStore from './AppStore';
import Tutorial from '../Tutorial';

const AppWrapper = styled.div`
  height: 100%;
  color: ${props => props.theme.color.text};
`;

class App extends PureComponent {
  render() {
    return (
      <AppWrapper>
        <Helmet titleTemplate="%s — Learn Git" defaultTitle="Learn Git" />
        <Route component={Tutorial} />
      </AppWrapper>
    );
  }
}

export default App;

export {
  AppStore
};
