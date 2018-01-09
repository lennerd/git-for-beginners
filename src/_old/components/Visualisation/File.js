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
    statusType: null,
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

  render() {
    const { children, column, row, level, theme, statusType } = this.props;

    this.fileObject.position.x = theme.vis.cellHeight * row;
    this.fileObject.position.z = theme.vis.cellWidth * column;
    this.fileObject.position.y = theme.vis.levelHeight * level;

    this.fileObject.update(statusType);

    return (
      <Object3D object3D={this.fileObject}>
        {children}
      </Object3D>
    );
  }
}

export default File;
