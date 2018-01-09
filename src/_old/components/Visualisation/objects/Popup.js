import { TweenLite } from 'gsap';

import theme from '../../../theme';

const FONT_SIZE = 0.1;
const PADDING = new THREE.Vector2(0.2, 0.125);

class Popup extends THREE.Group {
  constructor() {
    super();

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
        opacity: 1,
      }),
    );

    // Look at camera
    this.popupMesh.lookAt(-1, 1, -1);
    this.textMesh.position.z = 0.01;

    this.popupMesh.add(this.textMesh);
    this.add(this.popupMesh);
  }

  update(font, label, arrowSize = 0.1) {
    const shapes = font.generateShapes(label, FONT_SIZE, 2);
    const textGeometry = new THREE.ShapeGeometry(shapes);

    textGeometry.computeBoundingBox();
    let width = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
    let height = textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y;
    const xMidText = width / -2;
    textGeometry.translate(xMidText, height + PADDING.y, 0);

    this.textGeometry.fromGeometry(textGeometry);

    width += PADDING.x * 2;
    height += arrowSize + PADDING.y * 2;

    const shape = new THREE.Shape();
    shape.moveTo(0, height);
    shape.lineTo(width, height);
    shape.lineTo(width, arrowSize);
    shape.lineTo((width / 2) + arrowSize, arrowSize);
    shape.lineTo(width / 2, 0);
    shape.lineTo((width / 2) - arrowSize, arrowSize);
    shape.lineTo(0, arrowSize);
    shape.lineTo(0, height);

    const shapeGeometry = new THREE.ShapeGeometry(shape);
    shapeGeometry.computeBoundingBox();
    const xMidShape = (shapeGeometry.boundingBox.max.x - shapeGeometry.boundingBox.min.x) / -2;

    shapeGeometry.translate(xMidShape, 0, 0);

    this.popupGeometry.fromGeometry(shapeGeometry);
  }

  appear() {
    TweenLite.from(this.textMesh.material, 0.8, { opacity: 0 });
    TweenLite.from(this.popupMesh.material, 0.8, { opacity: 0 });
  }
}

export default Popup;
