import React, { PureComponent } from 'react';

import FileObject from '../objects/File';
import Object3D from './Object3D';

class File extends PureComponent {
  static defaultProps = {
    column: 0,
    row: 0,
    level: 0,
  };

  constructor(props) {
    super();

    const { file } = props;

    this.file = new FileObject(file.status);
  }

  render() {
    const { level, column, row } = this.props;

    this.file.place(column, row, level);

    return (
      <Object3D object3D={this.file} />
    );
  }
}

export default File;
