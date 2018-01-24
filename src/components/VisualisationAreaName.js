import React, { PureComponent } from 'react';
import { withTheme } from 'styled-components';
import { Transition } from 'react-transition-group';

import VisualisationObject3D from './VisualisationObject3D';
import { CELL_HEIGHT, CELL_WIDTH } from '../theme';
import { AREA_VERTICAL_PADDING, AREA_HORIZONTAL_PADDING } from './VisualisationArea';
import { tween, value, easing } from 'popmotion';

const SECTION_LABEL_SIZE = 0.12;

@withTheme
class VisualisationAreaName extends PureComponent {
  static defaultProps = {
    width: 1,
  };

  constructor(props) {
    super();

    const { theme } = props;

    this.areaNameObject = new THREE.Group();

    this.textGeometry = new THREE.BufferGeometry();

    this.textMesh = new THREE.Mesh(
      this.textGeometry,
      new THREE.MeshBasicMaterial({
        color: theme.color.highlight,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5,
      }),
    );

    this.textMesh.isAreaName = true;

    this.textMesh.position.x = (CELL_HEIGHT * -0.5) - SECTION_LABEL_SIZE - 0.2 + AREA_HORIZONTAL_PADDING / 2;
    this.textMesh.position.y = 0.001;
    this.textMesh.rotation.x = Math.PI / -2;
    this.textMesh.rotation.z = Math.PI / -2;

    this.areaNameObject.add(this.textMesh);

    this.opacity = value(1, opacity => {
      this.textMesh.material.opacity = opacity * 0.5;

      /*this.areaObject.traverse(object => {
        if (object.isAreaName) {
          object.material.opacity = opacity * 0.5;
        }
      });*/
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
    const { font, area, width, ...props } = this.props;

    const shapes = font.generateShapes(area.name.toUpperCase(), SECTION_LABEL_SIZE, 2);

    const geometry = new THREE.ShapeGeometry(shapes);

    //geometry.computeBoundingBox();
    //const xMid = (geometry.boundingBox.max.x - geometry.boundingBox.min.x) / -2;
    geometry.translate(((width * CELL_WIDTH) / -2) - (AREA_VERTICAL_PADDING / -2), 0, 0);

    this.textGeometry.fromGeometry(geometry);

    return (
      <Transition
        {...props}
        onEnter={this.handleEnter}
        onExit={this.handleExit}
        addEndListener={this.addEndListener}
      >
        <VisualisationObject3D object3D={this.areaNameObject} />
      </Transition>
    );
  }
}

export default VisualisationAreaName;
