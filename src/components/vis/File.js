import React, { PureComponent } from 'react';
import { TweenLite } from 'gsap';
import { withTheme } from 'styled-components';

import Object3D from './Object3D';
import FileObject/*, { FILE_DEPTH, FILE_HEIGHT, FILE_WIDTH }*/ from '../../objects/File';

@withTheme
class File extends PureComponent {
  static defaultProps = {
    column: 0,
    level: 0,
    appear: false,
  };

  constructor() {
    super();

    const fileObject = new FileObject();
    const group = new THREE.Group();

    group.add(fileObject);

    this.state = {
      fileObject,
      group,
    }
  }

  componentDidMount() {
    const { group } = this.state;
    const { appear } = this.props;

    if (appear) {
      TweenLite.from(group.scale, 0.8, { y: 0 });
    }
  }

  componentDidUpdate(prevProps) {
    const { theme } = this.props;
    const { group } = this.state;

    TweenLite.from(group.position, 0.8, {
      z: theme.vis.cellWidth * prevProps.column,
      y: theme.vis.levelHeight * prevProps.level,
    });
  }

  render() {
    const { children, column, level, theme } = this.props;
    const { group } = this.state;

    group.position.z = theme.vis.cellWidth * column;
    group.position.y = theme.vis.levelHeight * level;

    return (
      <Object3D object3D={group}>
        {children}
      </Object3D>
    );
  }
}

export default File;
