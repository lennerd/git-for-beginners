import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

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
      <div>
        {children}
      </div>
    );
  }
}

export default Scene;
