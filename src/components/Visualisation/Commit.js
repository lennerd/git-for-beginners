import React, { PureComponent } from 'react';
import { TweenLite } from 'gsap';
import { withTheme } from 'styled-components';

import Object3D from './Object3D';

@withTheme
class Commit extends PureComponent {
  static defaultProps = {
    row: 0,
    level: 0,
    column: 0,
  };

  commitGroup = new THREE.Group();

  componentDidUpdate(prevProps) {
    const { theme } = this.props;

    TweenLite.from(this.commitGroup.position, 0.8, {
      z: theme.vis.cellWidth * prevProps.column,
      x: theme.vis.cellHeight * prevProps.row,
      y: theme.vis.levelHeight * prevProps.level,
    });
  }

  render() {
    const { children, row, column, level, theme } = this.props;

    this.commitGroup.position.x = theme.vis.cellHeight * row;
    this.commitGroup.position.z = theme.vis.cellWidth * column;
    this.commitGroup.position.y = theme.vis.levelHeight * level;

    return (
      <Object3D object3D={this.commitGroup}>
        {children}
      </Object3D>
    );
  }
}

export default Commit;
