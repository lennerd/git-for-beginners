import React, { PureComponent } from 'react';
import { withTheme } from 'styled-components';

import Object3D from './Object3D';
import SectionObject from './objects/Section';

@withTheme
class Section extends PureComponent {
  static defaultProps = {
    column: 0,
    level: 0,
    row: 0,
    height: 1,
    width: 1,
    appear: false,
  };

  sectionObject = new SectionObject();

  componentDidMount() {
    const { appear } = this.props;

    if (appear) {
      this.sectionObject.appear();
    }
  }

  render() {
    const { children, column, row, level, width, height, theme } = this.props;

    this.sectionObject.update(theme.vis, width, height);

    this.sectionObject.position.set(
      theme.vis.cellHeight * row,
      theme.vis.levelHeight * level,
      theme.vis.cellWidth * column,
    );

    return (
      <Object3D object3D={this.sectionObject}>
        {children}
      </Object3D>
    );
  }
}

export default Section;
