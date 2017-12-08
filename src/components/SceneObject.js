import React, { Component } from 'react';
import { withTheme } from 'styled-components';
import { observer } from 'mobx-react';

import Object3D from './Object3D';

@withTheme
@observer
class SceneObject extends Component {
  static defaultProps = {
    column: 0,
    row: 0,
    level: 0,
  }

  constructor(props) {
    super();

    this.object3D = props.object3D || new THREE.Object3D();
  }

  render() {
    const { column, row, level, children, theme } = this.props;

    this.object3D.position.set(
      row * theme.vis.cellHeight,
      level * theme.vis.levelHeight,
      column * theme.vis.cellWidth,
    );

    return (
      <Object3D object3D={this.object3D}>
        {children}
      </Object3D>
    );
  }
}

export default SceneObject;
