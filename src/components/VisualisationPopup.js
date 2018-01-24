import React, { PureComponent } from 'react';
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
class VisualisationPopup extends PureComponent {
  static defaultProps = {
    level: 0,
    in: false,
  };

  constructor(props) {
    super(props);

    const { theme, level } = props;

    this.popupObject = new THREE.Group();

    this.textGeometry = new THREE.BufferGeometry();

    this.textMesh = new THREE.Mesh(
      this.textGeometry,
      new THREE.MeshBasicMaterial({
        color: 0xFFFFFF,
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

    this.in = value({ position: LEVEL_HEIGHT * level + 0.2, opacity: 0 }, ({ position, opacity }) => {
      this.popupObject.position.y = position;
      this.textMesh.material.opacity = opacity;
      this.popupMesh.material.opacity = opacity;
    });
  }

  componentDidMount() {
    this.disposeIn = reaction(() => ({
      position: this.position,
      opacity: this.opacity
    }), (inProp) => {
      tween({
        from: this.in.get(),
        to: inProp,
        duration: 400
      }).start(this.in);
    }, true);
  }

  componentWillUnmount() {
    this.disposeIn();
  }

  @computed get position() {
    const { in: inProp, level } = this.props;

    return LEVEL_HEIGHT * level + (inProp ? 0 : 0.2);
  }

  @computed get opacity() {
    const { in: inProp } = this.props;

    return inProp ? 1 : 0;
  }

  render() {
    const { font, level, content } = this.props;

    const shapes = font.generateShapes(content, FONT_SIZE, 2);
    const textGeometry = new THREE.ShapeGeometry(shapes);

    textGeometry.computeBoundingBox();
    let width = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
    let height = textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y;
    const xMidText = width / -2;
    textGeometry.translate(xMidText, height + PADDING.y, 0);

    this.textGeometry.fromGeometry(textGeometry);

    width += PADDING.x * 2;
    height += ARROW_SIZE + PADDING.y * 2;

    const shape = new THREE.Shape();
    shape.moveTo(0, height);
    shape.lineTo(width, height);
    shape.lineTo(width, ARROW_SIZE);
    shape.lineTo((width / 2) + ARROW_SIZE, ARROW_SIZE);
    shape.lineTo(width / 2, 0);
    shape.lineTo((width / 2) - ARROW_SIZE, ARROW_SIZE);
    shape.lineTo(0, ARROW_SIZE);
    shape.lineTo(0, height);

    const shapeGeometry = new THREE.ShapeGeometry(shape);
    shapeGeometry.computeBoundingBox();
    const xMidShape = (shapeGeometry.boundingBox.max.x - shapeGeometry.boundingBox.min.x) / -2;

    shapeGeometry.translate(xMidShape, 0, 0);

    this.popupGeometry.fromGeometry(shapeGeometry);

    return (
      <VisualisationObject3D object3D={this.popupObject} />
    );
  }
}

export default VisualisationPopup;
