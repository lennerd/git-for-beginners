import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withTheme } from 'styled-components';
import { value, tween, easing } from 'popmotion';
import { reaction, comparer } from 'mobx';

import VisualisationObject3D from './VisualisationObject3D';
import { CELL_WIDTH, CELL_HEIGHT, LEVEL_HEIGHT } from '../theme';

@withTheme
@observer
class VisualisationBranch extends Component {
  constructor(props) {
    super(props);

    const { branch } = this.props;

    this.branchObject = new THREE.Group();

    this.position = value(branch.lastVisCommit.position, position => {
      this.branchObject.position.set(
        CELL_HEIGHT * position.row,
        LEVEL_HEIGHT * position.level,
        CELL_WIDTH * position.column,
      );
    });
  }

  componentDidMount() {
    this.disposePosition = reaction(
      () => {
        const { branch } = this.props;

        return branch.lastVisCommit.position;
      },
      position => {
        tween({
          from: this.position.get(),
          to: position,
          duration: 1000,
          ease: easing.easeInOut,
        }).start(this.position);
      },
      { equals: comparer.structural },
    );
  }

  componentWillUnmount() {
    this.disposePosition();
  }

  render() {
    const { children } = this.props;

    return (
      <VisualisationObject3D object3D={this.branchObject}>
        {children}
      </VisualisationObject3D>
    );
  }
}

export default VisualisationBranch;
