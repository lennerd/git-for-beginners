import React, { PureComponent } from 'react';

import Object3D from './Object3D';
import FileLabelObject from '../objects/FileLabel';

class FileLabel extends PureComponent {
  static defaultProps = {
    column: 0,
    level: 0,
    appear: false,
  };

  state = {
    fileLabelObject: new FileLabelObject(),
  };

  componentDidMount() {
    const { fileLabelObject } = this.state;

    fileLabelObject.appear();
  }

  render() {
    const { label } = this.props;
    const { fileLabelObject } = this.state;

    fileLabelObject.updateLabel(label);

    return (
      <Object3D object3D={fileLabelObject} />
    );
  }
}

export default FileLabel;
