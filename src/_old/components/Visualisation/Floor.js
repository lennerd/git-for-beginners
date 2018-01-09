import React, { PureComponent } from 'react';

import Object3D from './Object3D';
import FloorObject from './objects/Floor';

class Floor extends PureComponent {
  floorObject = new FloorObject();

  render() {
    const { children } = this.props;

    return (
      <Object3D object3D={this.floorObject}>
        {children}
      </Object3D>
    );
  }
}

export default Floor;
