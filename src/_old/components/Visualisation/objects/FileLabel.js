import { TweenLite } from 'gsap';

import { FILE_WIDTH } from './File';
import theme from '../../../theme';

const FILE_LABEL_SIZE = 0.13;

class FileLabel extends THREE.Group {
  constructor() {
    super();

    this.textGeometry = new THREE.BufferGeometry();

    this.textMesh = new THREE.Mesh(
      this.textGeometry,
      new THREE.MeshBasicMaterial({
        color: theme.color.highlight,
      }),
    );

    this.textMesh.position.x = (FILE_WIDTH / -2) - FILE_LABEL_SIZE - 0.2;
    this.textMesh.position.y = 0.001;
    this.textMesh.rotation.x = Math.PI / -2;
    this.textMesh.rotation.z = Math.PI / -2;

    this.add(this.textMesh);
  }

  update(font, label) {
    const shapes = font.generateShapes(label, FILE_LABEL_SIZE, 2);
    const geometry = new THREE.ShapeGeometry(shapes);

    geometry.computeBoundingBox();
    const xMid = (geometry.boundingBox.max.x - geometry.boundingBox.min.x) / -2;
    geometry.translate(xMid, 0, 0);

    this.textGeometry.fromGeometry(geometry);
  }

  appear() {
    TweenLite.from(this.textMesh.material, 0.8, { opacity: 0 });
  }
}

export default FileLabel;
