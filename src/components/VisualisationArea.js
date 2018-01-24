import React, { PureComponent, Children, cloneElement } from 'react';
import { withTheme } from 'styled-components';
import { value, tween, easing } from 'popmotion';
import { Transition } from 'react-transition-group';

import VisualisationObject3D from './VisualisationObject3D';
import { CELL_HEIGHT, CELL_WIDTH, LEVEL_HEIGHT } from '../theme';

export const AREA_VERTICAL_PADDING = CELL_WIDTH * 0.1;
export const AREA_HORIZONTAL_PADDING = CELL_HEIGHT * 0.1;

@withTheme
class VisualisationArea extends PureComponent {
  constructor(props) {
    super();

    const { theme } = props;

    this.areaObject = new THREE.Group();

    this.planeMesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(1, 1),
      new THREE.MeshBasicMaterial({ color: theme.color.highlight, opacity: 0.1, transparent: true, depthWrite: false }),
    );

    this.planeMesh.rotation.x = Math.PI / -2;

    this.areaObject.add(this.planeMesh);

    this.opacity = value(1, opacity => {
      this.planeMesh.material.opacity = opacity * 0.1;
    });
  }

  handleEnter = () => {
    tween({ from: 0, to: this.opacity.get(), duration: 700, ease: easing.easeInOut }).start(this.opacity);

    this.tweenValue = this.opacity;
  };

  handleExit = () => {
    tween({ from: this.opacity.get(), to: 1, duration: 700, ease: easing.easeInOut }).start(this.opacity);

    this.tweenValue = this.opacity;
  };

  addEndListener = (node, complete) => {
    if (this.tweenValue == null) {
      return complete();
    }

    this.tweenValue.subscribe({
      complete,
    });

    this.tweenValue = null;
  };

  render() {
    const { children, area, in: inProp, ...props } = this.props;

    this.planeMesh.scale.set(
      CELL_HEIGHT * area.height - AREA_HORIZONTAL_PADDING,
      CELL_WIDTH * area.width - AREA_VERTICAL_PADDING,
      1
    );

    this.planeMesh.position.z = CELL_WIDTH * ((area.width / 2) - 0.5);
    this.planeMesh.position.x = CELL_HEIGHT * ((area.height / 2) - 0.5);

    this.areaObject.position.set(
      CELL_HEIGHT * area.position.row,
      LEVEL_HEIGHT * area.position.level,
      CELL_WIDTH * area.position.column,
    );

    return (
      <Transition
        {...props}
        in={inProp}
        onEnter={this.handleEnter}
        onExit={this.handleExit}
        addEndListener={this.addEndListener}
      >
        <VisualisationObject3D object3D={this.areaObject}>
          {Children.map(children, child => (
            cloneElement(child, { in: inProp })
          ))}
        </VisualisationObject3D>
      </Transition>
    );
  }
}

export default VisualisationArea;
