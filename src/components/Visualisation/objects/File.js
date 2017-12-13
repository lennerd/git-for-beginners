import { TweenLite } from 'gsap';

import theme from '../../../theme';
import { STATUS_ADDED, STATUS_DELETED } from '../models/FileStatus';

export const FILE_SIZE_RATIO = 1 / Math.sqrt(2);
export const FILE_HEIGHT = theme.vis.levelHeight / 2;
export const FILE_WIDTH = FILE_HEIGHT * 10;
export const FILE_DEPTH = FILE_WIDTH * FILE_SIZE_RATIO;

const CHANGE_SIGNS = 4;
const CHANGE_FONT_SIZE = 0.11;
const PLUS_FACES = 10;

class File extends THREE.Object3D {
  constructor(status) {
    super();

    this.fileMesh = new THREE.Mesh(
      new THREE.BoxBufferGeometry(FILE_WIDTH, FILE_HEIGHT, FILE_DEPTH),
      new THREE.MeshLambertMaterial(),
    );

    const outline = 0.015;

    this.hoverMesh = new THREE.Mesh(
      new THREE.BoxBufferGeometry(FILE_WIDTH + outline, FILE_HEIGHT + outline, FILE_DEPTH + outline),
      new THREE.MeshBasicMaterial({ opacity: 1, transparent: true, depthWrite: false, color: theme.color.highlight, side: THREE.BackSide }),
    );

    this.hoverMesh.material.visible = false;

    this.shadowMash = new THREE.Mesh(
      new THREE.BoxBufferGeometry(FILE_WIDTH, FILE_HEIGHT * 2, FILE_DEPTH),
      new THREE.ShadowMaterial({ depthWrite: false }),
    );

    this.textGeometry = new THREE.BufferGeometry();

    this.textMesh = new THREE.Mesh(
      this.textGeometry,
      new THREE.MeshBasicMaterial({ vertexColors: THREE.VertexColors }),
    );

    this.fileMesh.position.y = FILE_HEIGHT / 2;

    // Shift a little to the back by outline to have no border between moving clones.
    this.hoverMesh.position.y = FILE_HEIGHT / 2 - outline;
    this.hoverMesh.position.x = outline;
    this.hoverMesh.position.z = outline;

    this.shadowMash.castShadow = true;
    this.shadowMash.position.y = 0.1;

    this.textMesh.rotation.y = Math.PI;
    this.textMesh.position.x = FILE_WIDTH / 2;
    this.textMesh.position.z = FILE_DEPTH / -2 - 0.001;

    this.add(this.shadowMash);
    this.add(this.hoverMesh);
    this.add(this.fileMesh);
    this.add(this.textMesh);
  }

  update(font, status) {
    let color = theme.color.fileDefault;

    if (status.type === STATUS_ADDED) {
      color = theme.color.fileAdded;
    } else if (status.type === STATUS_DELETED) {
      color = theme.color.fileDeleted;
    }

    this.fileMesh.material.color = color;

    let geometry;

    if (status.type === STATUS_ADDED) {
      const shapes = font.generateShapes('+', CHANGE_FONT_SIZE, 0);
      geometry = new THREE.ShapeGeometry(shapes);

      for (let face of geometry.faces) {
        face.color = new THREE.Color(0xFFFFFFF);
      }
    } else if (status.type === STATUS_DELETED) {
      const shapes = font.generateShapes('-', CHANGE_FONT_SIZE, 0);
      geometry = new THREE.ShapeGeometry(shapes);

      for (let face of geometry.faces) {
        face.color = new THREE.Color(0xFFFFFFF);
      }
    } else {
      const plus = Math.floor((status.insertions / status.changes) * CHANGE_SIGNS);
      const minus = Math.floor((status.deletions / status.changes) * CHANGE_SIGNS);

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

  appear(duration = 0.8) {
    TweenLite.from(this.fileMesh.scale, duration, { y: 0 });
    TweenLite.from(this.hoverMesh.scale, duration, { y: 0 });
  }
}

export default File;
