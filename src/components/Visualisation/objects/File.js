import { TweenLite } from 'gsap';

import theme from '../../../theme';

export const FILE_SIZE_RATIO = 1 / Math.sqrt(2);
export const FILE_HEIGHT = theme.vis.levelHeight / 2;
export const FILE_WIDTH = FILE_HEIGHT * 10;
export const FILE_DEPTH = FILE_WIDTH * FILE_SIZE_RATIO;

class File extends THREE.Object3D {
  constructor(status) {
    super();

    this.fileMesh = new THREE.Mesh(
      new THREE.BoxBufferGeometry(FILE_WIDTH, FILE_HEIGHT, FILE_DEPTH),
      new THREE.MeshLambertMaterial({ color: theme.color.fileDefault }),
    );

    const outline = 0.015;

    this.hoverMesh = new THREE.Mesh(
      new THREE.BoxBufferGeometry(FILE_WIDTH + outline, FILE_HEIGHT + outline, FILE_DEPTH + outline),
      new THREE.MeshBasicMaterial({ opacity: 1, transparent: true, depthWrite: false, color: theme.color.highlight, side: THREE.BackSide }),
    );

    this.shadowMash = new THREE.Mesh(
      new THREE.BoxBufferGeometry(FILE_WIDTH, FILE_HEIGHT * 2, FILE_DEPTH),
      new THREE.ShadowMaterial({ depthWrite: false }),
    );


    this.fileMesh.position.y = FILE_HEIGHT / 2;

    // Shift a little to the back by outline to have no border between moving clones.
    this.hoverMesh.position.y = FILE_HEIGHT / 2 - outline;
    this.hoverMesh.position.x = outline;
    this.hoverMesh.position.z = outline;

    this.shadowMash.castShadow = true;
    this.shadowMash.position.y = 0.1;

    this.add(this.shadowMash);
    this.add(this.hoverMesh);
    this.add(this.fileMesh);
  }

  appear(duration = 0.8) {
    TweenLite.from(this.fileMesh.scale, duration, { y: 0 });
    TweenLite.from(this.hoverMesh.scale, duration, { y: 0 });
  }
}

export default File;
