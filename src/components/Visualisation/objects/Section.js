import { TweenLite } from 'gsap';

import theme from '../../../theme';

class Section extends THREE.Group {
  constructor(width, height) {
    super();

    this.planeMesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(1, 1),
      new THREE.MeshBasicMaterial({ color: 0x000000, opacity: 0.05, transparent: true, depthWrite: false }),
    );

    this.planeMesh.rotation.x = Math.PI / -2;

    this.add(this.planeMesh);
  }

  update(theme, width, height) {
    this.planeMesh.scale.set(
      theme.cellHeight * height,
      theme.cellWidth * width,
      1
    );

    this.planeMesh.position.x = theme.cellHeight * ((height / 2) - 0.5);
  }

  appear() {
    TweenLite.from(this.planeMesh.material, 0.8, { opacity: 0 });
  }
}

export default Section;
