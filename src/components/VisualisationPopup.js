import React, { Component } from 'react';
import { withTheme } from 'styled-components';
import { value, tween } from 'popmotion';
import { computed, reaction } from 'mobx';
import { observer } from 'mobx-react';

import VisualisationObject3D from './VisualisationObject3D';
import { LEVEL_HEIGHT } from '../theme';

const FONT_SIZE = 0.1;
const PADDING = new THREE.Vector2(0.2, 0.125);
const ARROW_SIZE = 0.1;

@withTheme
@observer
class VisualisationPopup extends Component {
  static defaultProps = {
    level: 0,
    in: false,
    offset: 0,
    active: true,
  };

  constructor(props) {
    super(props);

    const { theme } = props;

    this.popupObject = new THREE.Group();

    this.textGeometry = new THREE.BufferGeometry();

    this.textMesh = new THREE.Mesh(
      this.textGeometry,
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
      }),
    );

    this.popupGeometry = new THREE.BufferGeometry();

    this.popupMesh = new THREE.Mesh(
      this.popupGeometry,
      new THREE.MeshBasicMaterial({
        color: theme.color.highlight,
        transparent: true,
      }),
    );

    // Look at camera
    this.popupMesh.lookAt(-1, 1, -1);
    this.textMesh.position.z = 0.01;

    this.popupMesh.add(this.textMesh);
    this.popupObject.add(this.popupMesh);

    this.appearance = value(
      {
        level: this.level,
        opacity: this.opacity,
        textOpacity: this.textOpacity,
        offset: this.offset,
      },
      ({ level, opacity, textOpacity, offset }) => {
        this.popupObject.position.y = LEVEL_HEIGHT * level;
        this.popupObject.position.x = offset;
        this.textMesh.material.opacity = textOpacity;
        this.popupMesh.material.opacity = opacity;
      },
    );
  }

  componentDidMount() {
    this.disposeAppearance = reaction(
      () => ({
        level: this.level,
        opacity: this.opacity,
        textOpacity: this.textOpacity,
        offset: this.offset,
      }),
      appearance => {
        tween({
          from: this.appearance.get(),
          to: appearance,
          duration: 400,
        }).start(this.appearance);
      },
    );
  }

  componentWillUnmount() {
    this.disposeAppearance();
  }

  @computed
  get level() {
    const { in: inProp, level } = this.props;

    return level + (inProp ? 0 : 1);
  }

  @computed
  get opacity() {
    const { in: inProp, active } = this.props;

    if (!inProp) {
      return 0;
    }

    return active ? 1 : 0.5;
  }

  @computed
  get textOpacity() {
    const { in: inProp } = this.props;

    return inProp ? 1 : 0;
  }

  @computed
  get offset() {
    return this.props.offset * 0.3;
  }

  render() {
    const { font, content } = this.props;

    const textGeometry = new THREE.Geometry();
    let lineHeight = 0.2;

    content.split('\n').forEach((line, index) => {
      const shapes = font.generateShapes(line, FONT_SIZE, 2);
      const lineGeometry = new THREE.ShapeGeometry(shapes);

      lineGeometry.computeBoundingBox();
      const xMidText =
        (lineGeometry.boundingBox.max.x - lineGeometry.boundingBox.min.x) / -2;
      lineGeometry.translate(xMidText, lineHeight * -index, 0);

      textGeometry.merge(lineGeometry);
    });

    this.textGeometry.fromGeometry(textGeometry);

    textGeometry.computeBoundingBox();

    let width = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
    let height =
      textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y;

    this.textMesh.position.y = height + PADDING.y;

    width += PADDING.x * 2;
    height += ARROW_SIZE + PADDING.y * 2;

    const shape = new THREE.Shape();
    shape.moveTo(0, height);
    shape.lineTo(width, height);
    shape.lineTo(width, ARROW_SIZE);
    shape.lineTo(width / 2 + ARROW_SIZE, ARROW_SIZE);
    shape.lineTo(width / 2, 0);
    shape.lineTo(width / 2 - ARROW_SIZE, ARROW_SIZE);
    shape.lineTo(0, ARROW_SIZE);
    shape.lineTo(0, height);

    const shapeGeometry = new THREE.ShapeGeometry(shape);
    shapeGeometry.computeBoundingBox();
    const xMidShape =
      (shapeGeometry.boundingBox.max.x - shapeGeometry.boundingBox.min.x) / -2;

    shapeGeometry.translate(xMidShape, 0, 0);

    this.popupGeometry.fromGeometry(shapeGeometry);

    return <VisualisationObject3D object3D={this.popupObject} />;
  }
}

export default VisualisationPopup;
