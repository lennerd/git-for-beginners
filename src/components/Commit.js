import React, { PureComponent } from 'react';

import Object3D from './Object3D';
import File from './File';
import { place } from '../constants';

class Commit extends PureComponent {
  static defaultProps = {
    column: 0,
    row: 0,
  };

  constructor() {
    super();

    this.object3D = new THREE.Object3D();
  }

  render() {
    const { commit, column, row } = this.props;

    place(this.object3D, column, row);

    return (
      <Object3D object3D={this.object3D}>
        {commit.map((file, index) => <File key={index} level={index} />)}
      </Object3D>
    )
  }
}

export default Commit;
