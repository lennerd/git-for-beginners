import { TweenLite } from 'gsap';

import { FILE_DEPTH, FILE_WIDTH } from './File';
import theme from '../theme';

import SourceCodeProRegular from '../fonts/SourceCodeProRegular';

const fontLoader = new THREE.FontLoader();

const FILE_LABEL_SIZE = 0.13;

class FileLabel extends THREE.Group {
  constructor() {
    super();

    this.group = new THREE.Group();

    this.group.position.x = (FILE_WIDTH / -2) - FILE_LABEL_SIZE - 0.2;
    this.group.position.y = 0.001;
    this.group.rotation.x = Math.PI / -2;
    this.group.rotation.z = Math.PI / -2;

    this.add(this.group);
  }

  updateLabel(label) {
    fontLoader.load(
      SourceCodeProRegular,
      (font) => {
        const shapes = font.generateShapes(label, FILE_LABEL_SIZE, 2);
        const geometry = new THREE.ShapeGeometry(shapes);

        geometry.computeBoundingBox();
        const xMid = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
        geometry.translate( xMid, 0, 0 );

        const textMesh = new THREE.Mesh(
          geometry,
          new THREE.MeshBasicMaterial({ color: theme.color.highlight, side: THREE.DoubleSide }),
        );

        //textMesh.geometry.fromGeometry(geometry);
        this.group.add(textMesh);
      }
    );
  }

  appear() {
    //TweenLite.from(this.planeMesh.material, 0.8, { opacity: 0 });
  }
}

export default FileLabel;
