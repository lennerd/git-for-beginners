import React, { PureComponent } from 'react';

import FileObject from '../objects/File';
import Object3D from './Object3D';

class File extends PureComponent {
  constructor(props) {
    super();

    this.file = new FileObject();
  }

  render() {
    const { level } = this.props;

    if (level != null) {
      this.file.position.y = 0.2 * level;
    }

    return (
      <Object3D object3D={this.file} />
    );
  }
}

export default File;
