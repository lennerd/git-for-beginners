// import * as THREE from 'three';
// import * as TWEEN from '@tweenjs/tween.js';
// import { extendObservable } from 'mobx';

// import './index.css';

// class World extends THREE.Object3D {
//   constructor() {
//     super();

//     const shadowCaster = new THREE.DirectionalLight(0xFEFFF5, 0.4);
//     shadowCaster.castShadow = true;
//     shadowCaster.shadow.mapSize.width = 4096;
//     shadowCaster.shadow.mapSize.height = 4096;
//     shadowCaster.position.set(0, 3, 2);
//     this.add(shadowCaster);
//     this.add(new THREE.DirectionalLightHelper(shadowCaster));

//     const ambientLight = new THREE.AmbientLight(0xF5FDFF, 0.7);
//     this.add(ambientLight);
//   }
// }

// const FILE_SIZE_RATIO = 1 / Math.sqrt(2);

// class File extends THREE.Mesh {
//   constructor() {
//     super();

//     const fileMesh = new THREE.Mesh(
//       new THREE.BoxBufferGeometry(1, 0.1, FILE_SIZE_RATIO),
//       new THREE.MeshLambertMaterial({ color: 0xFCFCFA/*, transparent: true, opacity: 0.2, side: THREE.DoubleSide*/ }),
//     );

//     //this.receiveShadow = true;
//     fileMesh.castShadow = true;
//     fileMesh.position.y += 0.05;
//     this.add(fileMesh);
//   }
// }

// class Floor extends THREE.Group {
//   constructor() {
//     super();

//     this.plane = new THREE.Mesh(
//       new THREE.PlaneBufferGeometry(100, 100),
//       new THREE.MeshLambertMaterial({ color: 0x90A0A9 }),
//     );
//     this.plane.receiveShadow = true;
//     this.plane.rotation.x = Math.PI / -2;

//     this.add(this.plane);
//   }
// }

// var scene = new THREE.Scene();
// var camera = new THREE.OrthographicCamera(window.innerWidth / -200, window.innerWidth / 200,  window.innerHeight / 200,  window.innerHeight / -200, 1, 1000);

// var renderer = new THREE.WebGLRenderer({ antialias: true });
// renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.setPixelRatio(window.devicePixelRatio);
// document.body.appendChild(renderer.domElement);

// var world = new World();
// scene.add(world);

// var floor = new Floor();
// scene.add(floor);

// var commit = new THREE.Group();
// floor.add(commit);

// var file1 = new File();
// commit.add(file1);
// var file2 = new File();
// commit.add(file2);
// var file3 = new File();
// commit.add(file3);
// var file4 = new File();
// commit.add(file4);

// // Components
// camera.position.set(5, 5, 5);
// camera.lookAt(scene.position);
// file2.position.y = 0.15;
// file3.position.y = 0.3;
// file4.position.y = 0.45;

// // Shadow
// renderer.shadowMap.enabled = true;

// function animate(time) {
//   requestAnimationFrame(animate);
//   renderer.render(scene, camera);
//   TWEEN.update(time);
// }
// requestAnimationFrame(animate);

const MS_PER_FRAME = 1000 / 60;
const SECOND_PER_FRAME = MS_PER_FRAME / 1000;

let returnTuple = [0, 0];

class Spring {
  static NO_WOBBLE = { stiffness: 170, damping: 26 };
  static GENTLE = { stiffness: 120, damping: 14 };
  static WOBBLY = { stiffness: 180, damping: 12 };
  static STIFF = { stiffness: 210, damping: 20 };

  constructor(value, options) {
    this.value = value;
    this.stiffness = options.stiffness;
    this.damping = options.damping;
    this.precision = options.precision;
  }

  static create(value, options = null) {
    if (value instanceof Spring) {
      return value;
    }

    return new Spring(value, {
      ...this.NO_WOBBLE,
      precision: 0.01,
      ...options,
    });
  }

  update(value, velocity) {
    const spring = -this.stiffness * (value - this.value);
    const damper = -this.damping * velocity;
    const a = spring + damper;

    const newVelocity = velocity + a * SECOND_PER_FRAME;
    const newValue = value + newVelocity * SECOND_PER_FRAME;

    if (Math.abs(newVelocity) < this.precision && Math.abs(newValue - this.value) < this.precision) {
      returnTuple[0] = this.value;
      returnTuple[1] = 0;

      return returnTuple;
    }

    returnTuple[0] = newValue;
    returnTuple[1] = newVelocity;

    return returnTuple;
  }
}

class Animate {
  _prevTimestamp = 0;
  _accumulatedTime = 0;
  _target = {};
  _velocity = {};

  constructor(object) {
    this._object = object;
  }

  _shouldStopAnimation() {
    for (let key in this._object) {
      if (!object.hasOwnProperty(key)) {
        continue;
      }

      if (this._velocity[key] !== 0) {
        return false;
      }

      if (this._target[key] != null && this._target[key] !== this._object[key]) {
        return false;
      }
    }

    return true;
  }

  to(target, options) {
    const oldTargetKeys = Object.keys(this._target);

    for (let key in target) {
      if (!target.hasOwnProperty(key)) {
        continue;
      }

      this._target[key] = Spring.create(target[key], options);

      if (this._velocity[key] == null) {
        this._velocity[key] = 0;
      }
    }

    // Clean up target from old keys
    for (let i = 0; i < oldTargetKeys.length; i++) {
      const key = oldTargetKeys[i];

      if (target[key] != null) {
        continue;
      }

      delete this._target[key];
      delete this._velocity[key];
    }

    this._accumulatedTime = 0;

    return this;
  }

  update(currentTimestamp) {
    if (this._shouldStopAnimation()) {
      return true;
    }

    const timeDelta = currentTimestamp - this._prevTimestamp;

    this._prevTimestamp = currentTimestamp;
    this._accumulatedTime = this._accumulatedTime + timeDelta;

    const framesToCatchUp = Math.floor(this._accumulatedTime / MS_PER_FRAME);
    const currentFrameCompletion = (this._accumulatedTime - framesToCatchUp * MS_PER_FRAME) / MS_PER_FRAME;

    for (let key in this._target) {
      if (!this._target.hasOwnProperty(key)) {
        continue;
      }

      const target = this._target[key];

      let lastValue = this._object[key];
      let lastVelocity = this._velocity[key];

      for (let i = 0; i < framesToCatchUp; i++) {
        [lastValue, lastVelocity] = target.update(lastValue, lastVelocity);
      }

      const [newValue, newVelocity] = target.update(lastValue, lastVelocity);

      this._object[key] = lastValue + (newValue - lastValue) * currentFrameCompletion;
      this._velocity[key] = lastVelocity + (newVelocity - lastVelocity) * currentFrameCompletion;
    }

    this._accumulatedTime -= framesToCatchUp * MS_PER_FRAME;

    return false;
  }
}

const object = { x: 0, y: 0 };
const animate = new Animate(object);

const circle = document.getElementById('test');
const world = document.getElementById('world');

function animation(timestamp) {
  animate.update(timestamp);

  circle.setAttribute('transform', `translate(${object.x}, ${object.y})`);

  requestAnimationFrame(animation);
}

requestAnimationFrame(animation);

world.addEventListener('click', (event) => {
  animate.to({
    x: event.offsetX,
    y: event.offsetY,
  });
});
