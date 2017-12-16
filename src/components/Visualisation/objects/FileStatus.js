import theme from '../../../theme';
import { STATUS_ADDED, STATUS_DELETED } from '../models/FileStatus';
import { FILE_WIDTH, FILE_DEPTH, FILE_HEIGHT } from './File';

const CHANGE_SIGNS = 4;
const CHANGE_FONT_SIZE = 0.11;
const PLUS_FACES = 10;

class FileStatus extends THREE.Object3D {
  constructor(status) {
    super();

    this.textGeometry = new THREE.BufferGeometry();

    this.textMesh = new THREE.Mesh(
      this.textGeometry,
      new THREE.MeshBasicMaterial({ vertexColors: THREE.VertexColors }),
    );

    this.textMesh.rotation.y = Math.PI;
    this.textMesh.position.x = FILE_WIDTH / 2;
    this.textMesh.position.z = FILE_DEPTH / -2 - 0.001;

    this.add(this.textMesh);
  }

  update(font, type, insertions, deletions, maxChanges) {
    let geometry;

    if (type === STATUS_ADDED) {
      const shapes = font.generateShapes('+', CHANGE_FONT_SIZE, 0);
      geometry = new THREE.ShapeGeometry(shapes);

      for (let face of geometry.faces) {
        face.color = new THREE.Color(0xFFFFFFF);
      }
    } else if (type === STATUS_DELETED) {
      const shapes = font.generateShapes('-', CHANGE_FONT_SIZE, 0);
      geometry = new THREE.ShapeGeometry(shapes);

      for (let face of geometry.faces) {
        face.color = new THREE.Color(0xFFFFFFF);
      }
    } else {
      maxChanges = Math.max(maxChanges, 100);

      let plus = Math.round((insertions / maxChanges) * CHANGE_SIGNS);
      let minus = Math.round((deletions / maxChanges) * CHANGE_SIGNS);

      if (plus === 0 && insertions > 0) {
        plus = 1;
      }

      if (minus === 0 && deletions > 0) {
        minus = 1;
      }

      const shapes = font.generateShapes(
        `${'+'.repeat(plus)}${'-'.repeat(minus)}`,
        CHANGE_FONT_SIZE,
        0
      );

      geometry = new THREE.ShapeGeometry(shapes);
      const plusFaces = plus * PLUS_FACES;

      for (let i = 0; i < geometry.faces.length; i++) {
        const face = geometry.faces[i];

        if (i < plusFaces) {
          face.color = theme.color.added;
        } else {
          face.color = theme.color.deleted;
        }
      }
    }

    geometry.translate(0.05, (FILE_HEIGHT - CHANGE_FONT_SIZE) / 2, 0);
    this.textGeometry.fromGeometry(geometry);
  }
}

export default FileStatus;
