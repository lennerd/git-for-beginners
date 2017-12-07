import React, { PureComponent } from 'react';

import WorldObject from '../objects/World';
import Object3D from './Object3D';

class World extends PureComponent {
  state = {
    worldObject: new WorldObject(),
  };

  render() {
    const { children } = this.props;
    const { worldObject } = this.state;

    return (
      <Object3D object3D={worldObject}>
        {children}
      </Object3D>
    );
  }
}

export default World;
