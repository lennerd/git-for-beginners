import React, { PureComponent } from 'react';

import Object3D from './Object3D';
import World from './World';
import Floor from './Floor';

class Scene extends PureComponent {
  constructor() {
    super();

    this.object3D = new THREE.Object3D();
  }

  render() {
    const { children } = this.props;

    return (
      <Object3D object3D={this.object3D}>
        <World />
        <Floor>
          {children}
        </Floor>
      </Object3D>
    )
  }
}

export default Scene;
