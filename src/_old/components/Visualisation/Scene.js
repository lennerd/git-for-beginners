import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import World from './World';
import Floor from './Floor';

class Scene extends PureComponent {
  static childContextTypes = {
    parentObject3D: PropTypes.object,
  };

  getChildContext() {
    const { scene } = this.props;

    return {
      parentObject3D: scene,
    };
  }

  render() {
    const { children } = this.props;

    return (
      <World>
        <Floor>
          {children}
        </Floor>
      </World>
    );
  }
}

export default Scene;
