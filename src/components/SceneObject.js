import React, { Component } from 'react';
import { observer } from 'mobx-react';

import Object3D from './Object3D';
import { CELL_WIDTH, CELL_HEIGHT, LEVEL_HEIGHT } from '../constants';

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
    const { column, row, level, children } = this.props;

    this.object3D.position.set(
      row * CELL_HEIGHT,
      level * LEVEL_HEIGHT,
      column * CELL_WIDTH,
    );

    return (
      <Object3D object3D={this.object3D}>
        {children}
      </Object3D>
    );
  }
}

export default SceneObject;
