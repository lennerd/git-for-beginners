import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Route, Redirect } from 'react-router-dom';

import Navigation from './Navigation';
import Tutorial from './Tutorial';

class App extends Component {
  render() {
    const { className } = this.props;

    return (
      <div className={className}>
        <Helmet titleTemplate="%s — Learn Git" defaultTitle="Learn Git" />
        <Route exact path="/" render={() => (
          <Redirect to="/chapter/0"/>
        )} />
        <Navigation />
        <Route path="/chapter/:chapter" component={Tutorial} />
      </div>
    );
  }
}

export default styled(App)`
  height: 100%;
  background-image: linear-gradient(to bottom right, #FFF9F7, #B9C0E5);
  display: flex;
  flex-direction: column-reverse;
  color: ${props => props.theme.color.text};

  ${Navigation} {
    flex-shrink: 0;
  }
`;
