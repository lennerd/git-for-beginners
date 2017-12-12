import { TweenLite } from 'gsap';

import theme from '../../../theme';

const SECTION_LABEL_SIZE = 0.13;

class SectionLabel extends THREE.Group {
  constructor() {
    super();

    this.textGeometry = new THREE.BufferGeometry();

    this.textMesh = new THREE.Mesh(
      this.textGeometry,
      new THREE.MeshBasicMaterial({
        color: 0x000000,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.3,
      }),
    );

    this.textMesh.position.x = (theme.vis.cellHeight * -0.5) - SECTION_LABEL_SIZE - 0.2;
    this.textMesh.position.y = 0.001;
    this.textMesh.rotation.x = Math.PI / -2;
    this.textMesh.rotation.z = Math.PI / -2;

    this.add(this.textMesh);
  }

  update(font, label) {
    const shapes = font.generateShapes(label, SECTION_LABEL_SIZE, 2);

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

export default SectionLabel;
