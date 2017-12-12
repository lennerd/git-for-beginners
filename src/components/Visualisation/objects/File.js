import theme from '../../../theme';
/*import createChangesTexture from '../helpers/createChangesTexture';
import createAddTexture from '../helpers/createAddTexture';
import { STATUS_MODIFIED, STATUS_ADDED, STATUS_DELETED } from '../models/FileStatus';
import createDeleteTexture from '../helpers/createDeleteTexture';*/

export const FILE_SIZE_RATIO = 1 / Math.sqrt(2);
export const FILE_HEIGHT = theme.vis.levelHeight / 2;
export const FILE_WIDTH = FILE_HEIGHT * 10;
export const FILE_DEPTH = FILE_WIDTH * FILE_SIZE_RATIO;
//const TEXTURE_WIDTH = 4096;
//const TEXTURE_HEIGHT = 512;
//const TEXTURE_HORIZONTAL_SCALE = (FILE_WIDTH / FILE_HEIGHT) / (TEXTURE_WIDTH / TEXTURE_HEIGHT);

class File extends THREE.Object3D {
  constructor(status) {
    super();

    this.fileMesh = new THREE.Mesh(
      new THREE.BoxBufferGeometry(FILE_WIDTH, FILE_HEIGHT, FILE_DEPTH),
      new THREE.MeshLambertMaterial({ color: theme.color.fileDefault }),
    );

    this.hoverMesh = new THREE.Mesh(
      new THREE.BoxBufferGeometry(FILE_WIDTH + 0.015, FILE_HEIGHT + 0.015, FILE_DEPTH + 0.015),
      new THREE.MeshBasicMaterial({ opacity: 1, transparent: true, depthWrite: false, color: theme.color.highlight, side: THREE.BackSide }),
    );

    this.shadowMash = new THREE.Mesh(
      new THREE.BoxBufferGeometry(FILE_WIDTH, FILE_HEIGHT * 2, FILE_DEPTH),
      new THREE.ShadowMaterial({ depthWrite: false }),
    );

    this.fileMesh.position.y = FILE_HEIGHT / 2;
    this.hoverMesh.position.y = FILE_HEIGHT / 2;

    this.shadowMash.castShadow = true;
    this.shadowMash.position.y = 0.1;

    this.add(this.shadowMash);
    this.add(this.hoverMesh);
    this.add(this.fileMesh);
  }
}

export default File;
