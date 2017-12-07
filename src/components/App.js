import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { Route, Redirect, Switch } from 'react-router-dom';

import ChapterOne from './chapters/ChapterOne';

class App extends PureComponent {
  render() {
    const { className } = this.props;

    return (
      <div className={className}>
        <Switch>
          <Route path="/chapter-1" component={ChapterOne} />
          <Redirect from="/" to="/chapter-1" />
        </Switch>
      </div>
    );
  }
}

export default styled(App)`
  height: 100%;
  background-image: linear-gradient(to bottom right, #ffffff, #B9C0E5);
`;
