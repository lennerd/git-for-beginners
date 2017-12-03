import React, { PureComponent } from 'react';

import FloorObject from '../objects/Floor';
import Object3D from './Object3D';

class Floor extends PureComponent {
  constructor() {
    super();

    this.floor = new FloorObject();
  }

  render() {
    const { children } = this.props;

    return (
      <Object3D object3D={this.floor}>
        {children}
      </Object3D>
    )
  }
}

export default Floor;
