import React, { PureComponent } from 'react';

import Object3D from './Object3D';
import FloorObject from './objects/Floor';

class Floor extends PureComponent {
  state = {
    floorObject: new FloorObject(),
  };

  render() {
    const { children } = this.props;
    const { floorObject } = this.state;

    return (
      <Object3D object3D={floorObject}>
        {children}
      </Object3D>
    );
  }
}

export default Floor;
