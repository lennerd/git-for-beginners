import React, { PureComponent } from 'react';
import { TweenLite } from 'gsap';

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

    TweenLite.from(fileLabelObject.planeMesh.material, 0.8, { opacity: 0 });
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
