import React, { PureComponent } from 'react';

import Object3D from './Object3D';
import FileLabelObject from '../../objects/FileLabel';

class FileLabel extends PureComponent {
  static defaultProps = {
    column: 0,
    level: 0,
    appear: false,
  };

  fileLabelObject = new FileLabelObject();

  componentDidMount() {
    this.fileLabelObject.appear();
  }

  render() {
    const { font, label } = this.props;

    this.fileLabelObject.update(font, label);

    return (
      <Object3D object3D={this.fileLabelObject} />
    );
  }
}

export default FileLabel;
