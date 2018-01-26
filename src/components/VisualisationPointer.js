import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { computed, comparer } from 'mobx';
import { withTheme } from 'styled-components';
import createLine from 'three-line-2d';
import createBasicShader from 'three-line-2d/shaders/basic';
import { reaction } from 'mobx';
import { tween, value, easing, parallel } from 'popmotion';
import { Transition } from 'react-transition-group';

import VisualisationObject3D from './VisualisationObject3D';
import { CELL_WIDTH, CELL_HEIGHT, LEVEL_HEIGHT } from '../theme';

const LineGeometry = createLine(THREE);
const basicShader = createBasicShader(THREE);
const BRANCH_LINE_WIDTH = 0.15;

@withTheme
@observer
class VisualisationPointer extends Component {
  constructor(props) {
    super(props);

    const { theme, visPointer } = props;

    this.pointerObject = new THREE.Group();

    this.lineGeometry = new LineGeometry();

    this.lineMaterial = new THREE.ShaderMaterial(
      basicShader({
        transparent: true,
        diffuse: theme.color.highlight,
        thickness: BRANCH_LINE_WIDTH,
      }),
    );

    this.lineObject = new THREE.Mesh(this.lineGeometry, this.lineMaterial);
    this.lineObject.rotation.x = Math.PI / 2;

    this.pointerObject.add(this.lineObject);

    this.position = value(visPointer.position, position => {
      this.pointerObject.position.set(
        CELL_HEIGHT * position.row,
        LEVEL_HEIGHT * position.level,
        CELL_WIDTH * position.column,
      );
    });

    this.opacityValue = value(this.opacity, opacity => {
      this.lineMaterial.uniforms.opacity.value = opacity;
    });

    this.linePathValue = value(this.linePath, linePath => {
      this.lineGeometry.update(linePath);
    });
  }

  componentDidMount() {
    this.disposePosition = reaction(
      () => {
        const { visPointer } = this.props;

        return visPointer.position;
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

    this.disposeLinePath = reaction(
      () => this.linePath,
      linePath => {
        const prevLinePath = this.linePathValue.get();

        parallel(
          ...linePath.map((lineSegment, index) =>
            tween({
              from: prevLinePath[index],
              to: lineSegment,
              duration: 1000,
              ease: easing.easeInOut,
            }),
          ),
        ).start(this.linePathValue);
      },
      { equals: comparer.structural },
    );

    this.disposeOpacity = reaction(
      () => this.opacity,
      opacity => {
        tween({
          from: this.opacityValue.get(),
          to: opacity,
          duration: 400,
        }).start(this.opacityValue);
      },
    );
  }

  componentWillUnmount() {
    this.disposePosition();
    this.disposeLinePath();
    this.disposeOpacity();
  }

  @computed
  get linePath() {
    const { visPointer } = this.props;
    const { row: rowRelative, column: columnRealtive } = visPointer.position;
    const { row, column } = visPointer.visCommit.position;
    const linePath = [
      [
        (row - rowRelative) * CELL_HEIGHT,
        (column - columnRealtive) * CELL_WIDTH,
      ],
    ];

    if (visPointer.visParentCommit != null) {
      const { row, column } = visPointer.visParentCommit.position;

      linePath.push([
        (row - rowRelative) * CELL_HEIGHT,
        (column - columnRealtive) * CELL_WIDTH,
      ]);
    }

    return linePath;
  }

  @computed
  get opacity() {
    const { visPointer } = this.props;

    return visPointer.checkedOut ? 0.6 : 0.2;
  }

  handleEnter = () => {
    const prevLinePath = this.linePathValue.get();

    parallel(
      ...this.linePath.map((lineSegment, index) =>
        tween({
          from: prevLinePath[1],
          to: lineSegment,
          duration: 1000,
          ease: easing.easeInOut,
        }),
      ),
    ).start(this.linePathValue);

    this.tweenValue = this.linePathValue;
  };

  handleExit = () => {
    // @TODO Exit animation
    console.log('Pointer exits. Should not happen. :/');
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
    const { children, ...props } = this.props;

    return (
      <Transition
        {...props}
        onEnter={this.handleEnter}
        onExit={this.handleExit}
        addEndListener={this.addEndListener}
      >
        <VisualisationObject3D object3D={this.pointerObject}>
          {children}
        </VisualisationObject3D>
      </Transition>
    );
  }
}

export default VisualisationPointer;
