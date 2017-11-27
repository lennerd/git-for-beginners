import * as THREE from 'three';
import { TweenLite, TimelineMax, Power2 } from 'gsap';

import './index.css';

class World extends THREE.Object3D {
  constructor() {
    super();

    const shadowCaster = new THREE.DirectionalLight(0xFEFFF5, 0.4);
    shadowCaster.castShadow = true;
    shadowCaster.shadow.mapSize.width = 4096;
    shadowCaster.shadow.mapSize.height = 4096;
    shadowCaster.position.set(-2, 4, 2);
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
      new THREE.MeshLambertMaterial({ color: 0xFFFCFA }),
    );

    const shadowMash = new THREE.Mesh(
      new THREE.BoxBufferGeometry(1, 0.2, FILE_SIZE_RATIO),
      new THREE.ShadowMaterial(),
    );

    fileMesh.position.y = 0.05;

    shadowMash.castShadow = true;
    shadowMash.position.y = 0.1;

    this.add(fileMesh);
    this.add(shadowMash);
  }
}

function createGradientTexture(size, color1, color2) {
  // create canvas
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  // get context
  const context = canvas.getContext('2d');

  // draw gradient
  context.rect(0, 0, size, size);

  const gradient = context.createLinearGradient(0, 0, size, 0);
  gradient.addColorStop(0, color1); // light blue
  gradient.addColorStop(1, color2); // dark blue

  context.fillStyle = gradient;
  context.fill();

  return new THREE.Texture(canvas);
}

class Floor extends THREE.Group {
  constructor() {
    super();

    const gradientTexture = createGradientTexture(512, '#ffffff', '#B9C0E5');
    gradientTexture.needsUpdate = true;

    this.planeMesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(50, 50),
      new THREE.MeshBasicMaterial({ map: gradientTexture, overdraw: 0.5 }),
    );

    this.shadowMesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(50, 50),
      new THREE.ShadowMaterial({ opacity: 0.1 }),
    );

    this.planeMesh.rotation.x = Math.PI / -2;

    this.shadowMesh.receiveShadow = true;
    this.shadowMesh.rotation.x = Math.PI / -2;

    this.add(this.planeMesh);
    this.add(this.shadowMesh);
  }
}

var scene = new THREE.Scene();
var camera = new THREE.OrthographicCamera(window.innerWidth / -200, window.innerWidth / 200,  window.innerHeight / 200,  window.innerHeight / -200, 1, 1000);

var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
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
var file5 = new File();
commit.add(file5);
var file6 = new File();
commit.add(file6);

// Components
camera.position.set(5, 5, 5);
camera.lookAt(scene.position);
file1.position.y = 0.1;
file2.position.y = 0.3;
file3.position.y = 0.5;
file4.position.y = 0.7;
file5.position.y = 0.9;
file6.position.y = 1.1;

// Shadow
renderer.shadowMap.enabled = true;

// Animation
var timeline = new TimelineMax({
  repeat: -1,
  yoyo: true,
  repeatDelay: 1,
});

timeline.add(TweenLite.to(
  file4.position, 1, {
  z: -1,
}), '+=1');

timeline.add([
  TweenLite.to(
    file4.position, 1, {
    y: 0.1,
  }),
  TweenLite.to(
    file5.position, 1, {
    y: 0.7,
  }),
  TweenLite.to(
    file6.position, 1, {
    y: 0.9,
  }),
], '+=0.1');

timeline.add(TweenLite.to(
  file4.position, 1, {
  z: -2,
}), "-=0.75");

function render() {
  renderer.render(scene, camera);
}

TweenLite.defaultEase = Power2.easeInOut;
TweenLite.ticker.addEventListener("tick", render);
