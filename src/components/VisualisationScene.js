import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import VisualisationWorld from './VisualisationWorld';
import VisualisationFloor from './VisualisationFloor';

class VisualisationScene extends PureComponent {
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
      <VisualisationWorld>
        <VisualisationFloor>
          {children}
        </VisualisationFloor>
      </VisualisationWorld>
    );
  }
}

export default VisualisationScene;
