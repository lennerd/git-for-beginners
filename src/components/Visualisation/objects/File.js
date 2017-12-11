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

class File extends THREE.Group {
  constructor(status) {
    super();

    this.fileMesh = new THREE.Mesh(
      new THREE.BoxBufferGeometry(FILE_WIDTH, FILE_HEIGHT, FILE_DEPTH),
      new THREE.MeshLambertMaterial({ color: theme.color.fileDefault }),
    );

    this.shadowMash = new THREE.Mesh(
      new THREE.BoxBufferGeometry(FILE_WIDTH, FILE_HEIGHT * 2, FILE_DEPTH),
      new THREE.ShadowMaterial({ depthWrite: false }),
    );

    this.textureMesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(FILE_WIDTH, FILE_HEIGHT),
      new THREE.MeshBasicMaterial({ opacity: 0, transparent: true, depthWrite: false, blending: THREE.CustomBlending }),
    );

    this.fileMesh.position.y = FILE_HEIGHT / 2;

    this.shadowMash.castShadow = true;
    this.shadowMash.position.y = 0.1;

    this.textureMesh.rotation.y = Math.PI;
    this.textureMesh.position.y = FILE_HEIGHT / 2 - 0.01;
    this.textureMesh.position.z = FILE_DEPTH / -2 - 0.001;

    this.add(this.shadowMash);
    this.add(this.fileMesh);
    this.add(this.textureMesh);
  }
}

export default File;
