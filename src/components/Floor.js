import React, { PureComponent } from 'react';

import Object3D from './Object3D';
import FloorObject from '../objects/Floor';

class Floor extends PureComponent {
  state = {
    floorObject: new FloorObject(),
    floorBody: new CANNON.Body({
      mass: 0,
      shape: new CANNON.Plane(),
    }),
  };

  render() {
    const { children } = this.props;
    const { floorObject, floorBody } = this.state;

    return (
      <Object3D object3D={floorObject} cannonBody={floorBody}>
        {children}
      </Object3D>
    );
  }
}

export default Floor;
