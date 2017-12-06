import { TimelineLite, TweenLite, Power2 } from 'gsap';

import Mediator from './Mediator';
import { LEVEL_HEIGHT, COLOR_FILE_DEFAULT, COLOR_ADDED, COLOR_DELETED } from '../constants';
import { STATUS_MODIFIED, STATUS_ADDED, STATUS_DELETED } from '../models/FileStatus';
import createChangesTexture from '../helpers/createChangesTexture';
import createAddTexture from '../helpers/createAddTexture';
import createDeleteTexture from '../helpers/createDeleteTexture';

const FILE_SIZE_RATIO = 1 / Math.sqrt(2);
const FILE_HEIGHT = LEVEL_HEIGHT / 2;
const FILE_WIDTH = FILE_HEIGHT * 10;
const FILE_DEPTH = FILE_WIDTH * FILE_SIZE_RATIO;
const TEXTURE_WIDTH = 4096;
const TEXTURE_HEIGHT = 512;
const TEXTURE_HORIZONTAL_SCALE = (FILE_WIDTH / FILE_HEIGHT) / (TEXTURE_WIDTH / TEXTURE_HEIGHT);

class File extends Mediator {
  createObject3D() {
    const group = super.createObject3D();

    this.fileMesh = new THREE.Mesh(
      new THREE.BoxBufferGeometry(FILE_WIDTH, FILE_HEIGHT, FILE_DEPTH),
      new THREE.MeshLambertMaterial({ color: COLOR_FILE_DEFAULT }),
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

    group.add(this.shadowMash);
    group.add(this.fileMesh);
    group.add(this.textureMesh);

    return group;
  }

  update(props) {
    let { level } = props;

    // @TODO Add default props
    if (level == null) {
      level = 0;
    }

    const { status, parent } = this.model;
    let color = COLOR_FILE_DEFAULT;

    if (status.type === STATUS_ADDED) {
      color = COLOR_ADDED;
    } else if (status.type === STATUS_DELETED) {
      color = COLOR_DELETED;
    }

    this.fileMesh.material.color = color;
    this.fileMesh.material.needsUpdate = true;

    let texture;

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
    } else if (status.type === STATUS_DELETED) {
      texture = createDeleteTexture(
        TEXTURE_WIDTH,
        TEXTURE_HEIGHT,
      );
    }

    if (texture != null) {
      texture.repeat.set(TEXTURE_HORIZONTAL_SCALE * 0.9, 0.9);
      texture.offset.set(-0.05, 0.05);
      texture.needsUpdate = true;

      this.textureMesh.material.map = texture;
      this.textureMesh.material.opacity = 1;
      this.textureMesh.material.needsUpdate = true;
    }

    if (this.prevChanges != null) {
      if (status.changes < this.prevChanges) {
        this.shrink();
      } else if (status.changes > this.prevChanges) {
        this.grow();
      }
    }

    this.prevChanges = status.changes;

    this.object3D.position.y = LEVEL_HEIGHT * level;
    const prevWorldPosition = this.object3D.getWorldPosition();

    if (this.prevParent != null && this.prevParent !== parent) {
      const worldPosition = this.object3D.getWorldPosition();
      const newPosition = this.object3D.position.clone();
      const oldPosition = this.prevWorldPosition
        .sub(worldPosition);

      this.object3D.position.add(oldPosition);

      /*new TimelineLite()
        .to(this.object3D.position, 0.8, { z: oldPosition.z / 2, x: oldPosition.x / 2 }, 0)
        .to(this.object3D.position, 0.8, { y: newPosition.y }, 0.4)
        .to(this.object3D.position, 0.8, { z: newPosition.z, x: newPosition.x }, 0.8);*/

      TweenLite
        .to(this.object3D.position, 0.8, { x: newPosition.x, z: newPosition.z });
    } else if (this.prevLevel != null && level !== this.prevLevel) {
      TweenLite
        .from(this.object3D.position, 0.4, { y: LEVEL_HEIGHT * this.prevLevel })
        .delay(0.4);
    }

    this.prevParent = parent;
    this.prevWorldPosition = prevWorldPosition;
    this.prevLevel = level;
  }

  shrink() {
    const factor = 0.8;

    new TimelineLite()
      .to(this.object3D.scale, 0.1, { x: factor, z: factor, ease: Power2.easeIn })
      .to(this.object3D.scale, 0.4, { x: 1, z: 1 });
  }

  grow() {
    const factor = 1.2;

    new TimelineLite()
      .to(this.object3D.scale, 0.1, { x: factor, z: factor, ease: Power2.easeIn })
      .to(this.object3D.scale, 0.4, { x: 1, z: 1 });
  }
}

export default File;
