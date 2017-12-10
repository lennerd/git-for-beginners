import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Route, Redirect } from 'react-router-dom';
import FontFaceObserver from 'fontfaceobserver';

import Tutorial from './Tutorial';

class App extends Component {

  render() {
    const { className } = this.props;

    return (
      <div className={className}>
        <Helmet titleTemplate="%s — Learn Git" defaultTitle="Learn Git" />
        <Route exact path="/" render={() => (
          <Redirect to="/chapter/1"/>
        )} />
        <Route path="/chapter/:id" component={Tutorial} />
      </div>
    );
  }
}

// Preload Source Code Pro font for usage in textures etc.
new FontFaceObserver('Source Code Pro', { weight: 400 }).load();
new FontFaceObserver('Source Code Pro', { weight: 900 }).load();

export default styled(App)`
  height: 100%;
  color: ${props => props.theme.color.text};
`;
