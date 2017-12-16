import React, { PureComponent } from 'react';
import { TweenLite } from 'gsap';
import { withTheme } from 'styled-components';

import Object3D from './Object3D';

@withTheme
class Commit extends PureComponent {
  static defaultProps = {
    row: 0,
    column: 0,
  };

  commitGroup = new THREE.Group();

  componentDidMount() {
    const { theme, prevColumn, prevRow } = this.props;

    if (prevColumn != null && prevRow != null) {
      TweenLite.from(this.commitGroup.position, 0.8, {
        z: theme.vis.cellWidth * prevColumn,
        x: theme.vis.cellHeight * prevRow,
      });
    }
  }

  componentDidUpdate(prevProps) {
    const { theme } = this.props;

    TweenLite.from(this.commitGroup.position, 0.8, {
      z: theme.vis.cellWidth * prevProps.column,
      x: theme.vis.cellHeight * prevProps.row,
    });
  }

  render() {
    const { children, row, column, theme } = this.props;

    this.commitGroup.position.x = theme.vis.cellHeight * row;
    this.commitGroup.position.z = theme.vis.cellWidth * column;

    return (
      <Object3D object3D={this.commitGroup}>
        {children}
      </Object3D>
    );
  }
}

export default Commit;
