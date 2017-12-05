import React, { PureComponent } from 'react';

import WorldObject from '../objects/World';
import Object3D from './Object3D';

class World extends PureComponent {
  constructor() {
    super();

    this.world = new WorldObject();
  }

  render() {
    const { children } = this.props;

    return (
      <Object3D object3D={this.world}>
        {children}
      </Object3D>
    );
  }
}

export default World;
