import React, { PureComponent } from 'react';
import { TimelineLite } from 'gsap';

import Object3D from './Object3D';
import FileStatusObject from './objects/FileStatus';
import { STATUS_MODIFIED } from './models/FileStatus';

class FileStatus extends PureComponent {
  fileStatusObject = new FileStatusObject();

  componentDidUpdate(prevProps) {
    const { type, insertions, deletions } = this.props;

    if (type === STATUS_MODIFIED && (prevProps.insertions !== insertions || prevProps.deletions !== deletions)) {
      const timeline = new TimelineLite();

      timeline.to(this.fileStatusObject.scale, 0.2, {
        z: 1.2,
      });
      timeline.to(this.fileStatusObject.scale, 0.2, {
        z: 1,
      });
    }
  }

  render() {
    const { font, type, insertions, deletions, maxChanges } = this.props;

    this.fileStatusObject.update(font, type, insertions, deletions, maxChanges);

    return (
      <Object3D object3D={this.fileStatusObject} />
    );
  }
}

export default FileStatus;
