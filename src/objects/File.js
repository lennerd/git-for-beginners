import { TweenMax } from 'gsap';

import { place, LEVEL_HEIGHT, COLOR_FILE_DEFAULT, COLOR_ADDED, COLOR_DELETED } from '../constants';
import createChangesTexture from '../helpers/createChangesTexture';
import createAddTexture from '../helpers/createAddTexture';
import { STATUS_MODIFIED, STATUS_ADDED, STATUS_DELETED } from '../models/FileStatus';
import createDeleteTexture from '../helpers/createDeleteTexture';

const FILE_SIZE_RATIO = 1 / Math.sqrt(2);
const FILE_HEIGHT = LEVEL_HEIGHT / 2;
const FILE_WIDTH = FILE_HEIGHT * 10;
const FILE_DEPTH = FILE_WIDTH * FILE_SIZE_RATIO;
const TEXTURE_WIDTH = 4096;
const TEXTURE_HEIGHT = 512;
const TEXTURE_HORIZONTAL_SCALE = (FILE_WIDTH / FILE_HEIGHT) / (TEXTURE_WIDTH / TEXTURE_HEIGHT);

class File extends THREE.Mesh {
  constructor(status) {
    super();

    /*const insertions = Math.round(Math.random() * 10);
    const deletions = Math.round(Math.random() * 10);
    const changes = insertions + deletions;*/

    let texture;
    let color = COLOR_FILE_DEFAULT; // 0xFFFCFA;

    if (status.type === STATUS_MODIFIED) {
      texture = createChangesTexture(
        TEXTURE_WIDTH,
        TEXTURE_HEIGHT,
        status.insertions,
        status.deletions,
        status.changes,
      );
    } else if (status.type === STATUS_ADDED) {
      texture = createAddTexture(
        TEXTURE_WIDTH,
        TEXTURE_HEIGHT,
      );
      color = COLOR_ADDED;
    } else if (status.type === STATUS_DELETED) {
      texture = createDeleteTexture(
        TEXTURE_WIDTH,
        TEXTURE_HEIGHT,
      );
      color = COLOR_DELETED;
    }

    texture.repeat.set(TEXTURE_HORIZONTAL_SCALE * 0.9, 0.9);
    texture.offset.set(-0.05, 0.05);

    this.fileMesh = new THREE.Mesh(
      new THREE.BoxBufferGeometry(FILE_WIDTH, FILE_HEIGHT, FILE_DEPTH),
      new THREE.MeshLambertMaterial({ color }),
    );

    this.shadowMash = new THREE.Mesh(
      new THREE.BoxBufferGeometry(FILE_WIDTH, FILE_HEIGHT * 2, FILE_DEPTH),
      new THREE.ShadowMaterial({ depthWrite: false }),
    );

    this.fileMesh.position.y = FILE_HEIGHT / 2;
    this.shadowMash.castShadow = true;
    this.shadowMash.position.y = 0.1;

    this.textureMesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(FILE_WIDTH, FILE_HEIGHT),
      new THREE.MeshBasicMaterial({ map: texture, transparent: true, blending: THREE.CustomBlending }),
    );

    this.textureMesh.rotation.y = Math.PI;
    this.textureMesh.position.y = FILE_HEIGHT / 2 - 0.01;
    this.textureMesh.position.z = FILE_DEPTH / -2 - 0.001;

    this.add(this.shadowMash);
    this.add(this.fileMesh);
    this.add(this.textureMesh);
  }

  place(column, row, level) {
    place(this, column, row, level);
  }

  appear() {
    TweenMax.from(this.scale, 1, { y: 0 });
  }
}

export default File;
