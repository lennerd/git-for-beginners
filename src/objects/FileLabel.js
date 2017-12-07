import { FILE_DEPTH, FILE_WIDTH } from './File';
import createTextTexture from '../helpers/createTextTexture';

const FILE_LABEL_HEIGHT = 1.4;
const TEXTURE_WIDTH = 2048;
const TEXTURE_HEIGHT = 512;

class FileLabel extends THREE.Group {
  constructor() {
    super();

    this.planeMesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(FILE_DEPTH * 2, FILE_LABEL_HEIGHT),
      new THREE.MeshBasicMaterial({ depthWrite: false, transparent: true, }),
    );

    this.planeMesh.position.x = (FILE_WIDTH / -2) - FILE_LABEL_HEIGHT / 2 - 0.1;
    this.planeMesh.position.y = 0;
    this.planeMesh.rotation.x = Math.PI / -2;
    this.planeMesh.rotation.z = Math.PI / -2;

    this.add(this.planeMesh);
  }

  updateLabel(label) {
    const texture = createTextTexture(TEXTURE_WIDTH, TEXTURE_HEIGHT, [
      { font: `900 80px 'Source Code Pro'`, fillStyle: '#000000' },
      label,
    ], { horizontalAlignment: 'center' });

    this.planeMesh.material.map = texture;
    this.planeMesh.material.needsUpdate = true;

    console.log(label);
  }
}

export default FileLabel;
