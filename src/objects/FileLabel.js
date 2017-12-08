import { TweenLite } from 'gsap';

import { FILE_DEPTH, FILE_WIDTH } from './File';
import { createTextTextureV2 } from '../helpers/createTextTexture';

const FILE_LABEL_WIDTH = FILE_DEPTH * 4;
const FILE_LABEL_HEIGHT = 0.5;
const TEXTURE_WIDTH = FILE_LABEL_WIDTH * 200;
const TEXTURE_HEIGHT = FILE_LABEL_HEIGHT * 200;

class FileLabel extends THREE.Group {
  constructor() {
    super();

    this.planeMesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(FILE_LABEL_WIDTH, FILE_LABEL_HEIGHT),
      new THREE.MeshBasicMaterial({ depthWrite: false, transparent: true }),
    );

    this.planeMesh.position.x = (FILE_WIDTH / -2) - FILE_LABEL_HEIGHT / 2 - 0.1;
    this.planeMesh.position.y = 0;
    this.planeMesh.rotation.x = Math.PI / -2;
    this.planeMesh.rotation.z = Math.PI / -2;

    this.add(this.planeMesh);
  }

  updateLabel(label) {
    const texture = createTextTextureV2(TEXTURE_WIDTH, TEXTURE_HEIGHT, [
      { font: `400 50px 'Source Code Pro'`, fillStyle: '#1126B4' },
      label,
    ], { horizontalAlignment: 'center' });

    this.planeMesh.material.map = texture;
    this.planeMesh.material.needsUpdate = true;
  }

  appear() {
    TweenLite.from(this.planeMesh.material, 0.8, { opacity: 0 });
  }
}

export default FileLabel;
