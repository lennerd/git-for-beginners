import React, { PureComponent } from 'react';
import { withTheme } from 'styled-components';

import Object3D from './Object3D';

@withTheme
class Commit extends PureComponent {
  static defaultProps = {
    column: 0,
  };

  state = {
    commitGroup: new THREE.Group(),
  };

  render() {
    const { children, column, theme } = this.props;
    const { commitGroup } = this.state;

    commitGroup.position.z = theme.vis.cellWidth * column;

    return (
      <Object3D object3D={commitGroup}>
        {children}
      </Object3D>
    );
  }
}

export default Commit;
