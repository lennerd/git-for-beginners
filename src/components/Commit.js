import React, { PureComponent } from 'react';

import Object3D from './Object3D';

class Commit extends PureComponent {
  constructor() {
    super();

    this.object3D = new THREE.Object3D();
  }

  render() {
    const { children } = this.props;

    return (
      <Object3D object3D={this.object3D}>
        {children}
      </Object3D>
    )
  }
}

export default Commit;
