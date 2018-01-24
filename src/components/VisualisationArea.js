import React, { PureComponent, Children, cloneElement } from 'react';
import { withTheme } from 'styled-components';
import { value, tween, easing } from 'popmotion';
import { Transition } from 'react-transition-group';
import { reaction, comparer } from 'mobx';

import VisualisationObject3D from './VisualisationObject3D';
import { CELL_HEIGHT, CELL_WIDTH, LEVEL_HEIGHT } from '../theme';

export const AREA_VERTICAL_PADDING = CELL_WIDTH * 0.1;
export const AREA_HORIZONTAL_PADDING = CELL_HEIGHT * 0.1;

@withTheme
class VisualisationArea extends PureComponent {
  constructor(props) {
    super();

    const { area, theme } = props;

    this.areaObject = new THREE.Group();

    this.planeMesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(1, 1),
      new THREE.MeshBasicMaterial({
        color: theme.color.highlight,
        opacity: 0.1,
        transparent: true,
        depthWrite: false,
      }),
    );

    this.planeMesh.rotation.x = Math.PI / -2;

    this.areaObject.add(this.planeMesh);

    this.opacity = value(1, opacity => {
      this.planeMesh.material.opacity = opacity * 0.1;
    });

    this.size = value(
      { width: area.width, height: area.height },
      ({ width, height }) => {
        this.planeMesh.scale.y = CELL_WIDTH * width - AREA_VERTICAL_PADDING;
        this.planeMesh.scale.x = CELL_HEIGHT * height - AREA_HORIZONTAL_PADDING;

        this.planeMesh.position.z = CELL_WIDTH * (width / 2 - 0.5);
        this.planeMesh.position.x = CELL_HEIGHT * (height / 2 - 0.5);
      },
    );

    this.position = value(area.position, position => {
      this.areaObject.position.set(
        CELL_HEIGHT * position.row,
        LEVEL_HEIGHT * position.level,
        CELL_WIDTH * position.column,
      );
    });
  }

  componentDidMount() {
    this.disposeSize = reaction(
      () => {
        const { area } = this.props;

        return { width: area.width, height: area.height };
      },
      size => {
        tween({
          from: this.size.get(),
          to: size,
          duration: 1000,
          ease: easing.easeInOut,
        }).start(this.size);
      },
      { equals: comparer.structural },
    );

    this.disposePosition = reaction(
      () => this.props.area.position,
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
    this.disposeSize();
    this.disposePosition();
  }

  handleEnter = () => {
    tween({
      from: 0,
      to: this.opacity.get(),
      duration: 700,
      ease: easing.easeInOut,
    }).start(this.opacity);

    this.tweenValue = this.opacity;
  };

  handleExit = () => {
    tween({
      from: this.opacity.get(),
      to: 0,
      duration: 700,
      ease: easing.easeInOut,
    }).start(this.opacity);

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
    const { children, in: inProp, ...props } = this.props;

    return (
      <Transition
        {...props}
        in={inProp}
        onEnter={this.handleEnter}
        onExit={this.handleExit}
        addEndListener={this.addEndListener}
      >
        <VisualisationObject3D object3D={this.areaObject}>
          {Children.map(children, child => cloneElement(child, { in: inProp }))}
        </VisualisationObject3D>
      </Transition>
    );
  }
}

export default VisualisationArea;
