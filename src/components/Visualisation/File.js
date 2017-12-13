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
    status: null,
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
    const { font, status, children, column, row, level, theme } = this.props;

    this.fileObject.position.x = theme.vis.cellHeight * row;
    this.fileObject.position.z = theme.vis.cellWidth * column;
    this.fileObject.position.y = theme.vis.levelHeight * level;

    if (status != null) {
      this.fileObject.update(font, status);
    }

    return (
      <Object3D object3D={this.fileObject}>
        {children}
      </Object3D>
    );
  }
}

export default File;
