import React, { PureComponent } from 'react';

import FileObject from '../objects/File';
import Object3D from './Object3D';
import { place } from '../constants';

class File extends PureComponent {
  static defaultProps = {
    column: 0,
    row: 0,
  };

  constructor(props) {
    super();

    this.file = new FileObject();
  }

  render() {
    const { level, column, row } = this.props;

    if (level != null) {
      place(this.file, column, row, level);
    }

    return (
      <Object3D object3D={this.file} />
    );
  }
}

export default File;
