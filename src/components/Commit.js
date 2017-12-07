import React, { PureComponent } from 'react';

import Object3D from './Object3D';
import { CELL_WIDTH } from '../constants';

class Commit extends PureComponent {
  static defaultProps = {
    column: 0,
  };

  state = {
    commitGroup: new THREE.Group(),
  };

  render() {
    const { children, column } = this.props;
    const { commitGroup } = this.state;

    commitGroup.position.z = CELL_WIDTH * column;

    return (
      <Object3D object3D={commitGroup}>
        {children}
      </Object3D>
    );
  }
}

export default Commit;
