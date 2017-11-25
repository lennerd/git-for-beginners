

/*const object = { x: 0, y: 0 };
const move = animate(object);

const circle = document.getElementById('test');
const world = document.getElementById('world');

function animation(timestamp) {
  tick(timestamp);

  circle.setAttribute('transform', `translate(${object.x}, ${object.y})`);

  requestAnimationFrame(animation);
}

requestAnimationFrame(animation);

world.addEventListener('click', (event) => {
  move.to({
    x: event.offsetX,
    y: event.offsetY,
  }).start();
});*/

import * as THREE from 'three';

import './index.css';
import * as MOTION from './motion';

class World extends THREE.Object3D {
  constructor() {
    super();

    const shadowCaster = new THREE.DirectionalLight(0xFEFFF5, 0.4);
    shadowCaster.castShadow = true;
    shadowCaster.shadow.mapSize.width = 4096;
    shadowCaster.shadow.mapSize.height = 4096;
    shadowCaster.position.set(0, 3, 2);
    this.add(shadowCaster);
    //this.add(new THREE.DirectionalLightHelper(shadowCaster));

    const ambientLight = new THREE.AmbientLight(0xF5FDFF, 0.7);
    this.add(ambientLight);
  }
}

const FILE_SIZE_RATIO = 1 / Math.sqrt(2);

class File extends THREE.Mesh {
  constructor() {
    super();

    const fileMesh = new THREE.Mesh(
      new THREE.BoxBufferGeometry(1, 0.1, FILE_SIZE_RATIO),
      new THREE.MeshLambertMaterial({ color: 0xFCFCFA/*, transparent: true, opacity: 0.2, side: THREE.DoubleSide*/ }),
    );

    //this.receiveShadow = true;
    fileMesh.castShadow = true;
    fileMesh.position.y += 0.05;
    this.add(fileMesh);
  }
}

class Floor extends THREE.Group {
  constructor() {
    super();

    this.plane = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(100, 100),
      new THREE.MeshLambertMaterial({ color: 0x90A0A9 }),
    );
    this.plane.receiveShadow = true;
    this.plane.rotation.x = Math.PI / -2;

    this.add(this.plane);
  }
}

var scene = new THREE.Scene();
var camera = new THREE.OrthographicCamera(window.innerWidth / -200, window.innerWidth / 200,  window.innerHeight / 200,  window.innerHeight / -200, 1, 1000);

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

var world = new World();
scene.add(world);

var floor = new Floor();
scene.add(floor);

var commit = new THREE.Group();
floor.add(commit);

var file1 = new File();
commit.add(file1);
var file2 = new File();
commit.add(file2);
var file3 = new File();
commit.add(file3);
var file4 = new File();
commit.add(file4);

// Components
camera.position.set(5, 5, 5);
camera.lookAt(scene.position);
file2.position.y = 0.15;
file3.position.y = 0.3;
file4.position.y = 0.45;

// Shadow
renderer.shadowMap.enabled = true;

// Animation
const moveFile4 = MOTION.animate(file4.position);

setTimeout(() => {
  moveFile4.to({
    z: -2,
    y: 0,
  }).start();
}, 500);

setTimeout(() => {
  moveFile4.to({
    z: 0,
    y: 0.45,
  }).start();
}, 2000);

function animate(time) {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  MOTION.tick(time);
}
requestAnimationFrame(animate);
