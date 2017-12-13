import React, { PureComponent } from 'react';
import { TimelineLite } from 'gsap';

import Object3D from './Object3D';
import FileStatusObject from './objects/FileStatus';

class FileStatus extends PureComponent {
  fileStatusObject = new FileStatusObject();

  componentDidUpdate() {
    const timeline = new TimelineLite();

    timeline.to(this.fileStatusObject.scale, 0.2, {
      z: 1.2,
    });
    timeline.to(this.fileStatusObject.scale, 0.2, {
      z: 1,
    });
  }

  render() {
    const { font, type, insertions, deletions } = this.props;

    this.fileStatusObject.update(font, type, insertions, deletions);

    return (
      <Object3D object3D={this.fileStatusObject} />
    );
  }
}

export default FileStatus;
