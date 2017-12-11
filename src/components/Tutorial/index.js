import React, { PureComponent } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { Provider } from 'mobx-react';

import TutorialStore from './TutorialStore';
import TutorialChapter from './TutorialChapter';
import chapters from './chapters';

class Tutorial extends PureComponent {
  constructor() {
    super();

    this.tutorial = new TutorialStore(chapters);
  }

  render() {
    return (
      <Provider tutorial={this.tutorial}>
        <Switch>
          <Redirect exact from="/" to="/chapter/1" />
          <Route
            path="/chapter/:chapterId"
            component={TutorialChapter}
          />
        </Switch>
      </Provider>
    );
  }
}

export default Tutorial;
