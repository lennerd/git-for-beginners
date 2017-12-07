import React, { PureComponent } from 'react';
import { TweenLite } from 'gsap';

import Object3D from './Object3D';
import { CELL_WIDTH, LEVEL_HEIGHT } from '../constants';
import FileObject from '../objects/File';

class File extends PureComponent {
  static defaultProps = {
    column: 0,
    level: 0,
    appear: false,
  };

  state = {
    fileObject: new FileObject(),
  };

  componentDidMount() {
    const { fileObject } = this.state;
    const { appear } = this.props;

    if (appear) {
      TweenLite.from(fileObject.scale, 0.8, { y: 0 });
    }
  }

  componentDidUpdate(prevProps) {
    const { fileObject } = this.state;

    TweenLite.from(fileObject.position, 0.8, {
      z: CELL_WIDTH * prevProps.column,
      y: LEVEL_HEIGHT * prevProps.level,
    });
  }

  render() {
    const { children, column, level } = this.props;
    const { fileObject } = this.state;

    fileObject.position.z = CELL_WIDTH * column;
    fileObject.position.y = LEVEL_HEIGHT * level;

    return (
      <Object3D object3D={fileObject}>
        {children}
      </Object3D>
    );
  }
}

export default File;
