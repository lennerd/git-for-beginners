import React, { PureComponent } from 'react';

import FileObject from '../objects/File';
import Object3D from './Object3D';

class File extends PureComponent {
  constructor(props) {
    super();

    const { file } = props;

    this.file = new FileObject(file.status);
  }

  render() {
    return (
      <Object3D object3D={this.file} />
    );
  }
}

export default File;
