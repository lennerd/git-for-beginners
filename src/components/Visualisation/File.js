import React, { PureComponent } from 'react';
import { TweenLite } from 'gsap';
import { withTheme } from 'styled-components';

import Object3D from './Object3D';
import FileObject from './objects/File';

@withTheme
class File extends PureComponent {
  static defaultProps = {
    column: 0,
    level: 0,
    row: 0,
    appear: false,
  };

  fileObject = new FileObject();

  componentDidMount() {
    const { appear } = this.props;

    if (appear) {
      this.fileObject.appear();
    }
  }

  componentDidUpdate(prevProps) {
    const { theme } = this.props;

    TweenLite.from(this.fileObject.position, 0.8, {
      z: theme.vis.cellWidth * prevProps.column,
      x: theme.vis.cellHeight * prevProps.row,
      y: theme.vis.levelHeight * prevProps.level,
    });
  }

  handleRaycastEnter = () => {
    console.log('enter');
  };

  handleRaycastLeave = () => {
    console.log('leave');
  };

  render() {
    const { children, column, row, level, theme } = this.props;

    this.fileObject.position.x = theme.vis.cellHeight * row;
    this.fileObject.position.z = theme.vis.cellWidth * column;
    this.fileObject.position.y = theme.vis.levelHeight * level;

    return (
      <Object3D
        object3D={this.fileObject}
        onRaycastEnter={this.handleRaycastEnter}
        onRaycastLeave={this.handleRaycastLeave}
      >
        {children}
      </Object3D>
    );
  }
}

export default File;
