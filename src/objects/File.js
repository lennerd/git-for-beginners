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
      new THREE.ShadowMaterial({ depthWrite: false }),
    );

    fileMesh.position.y = 0.05;
    shadowMash.castShadow = true;
    shadowMash.position.y = 0.1;

    this.add(shadowMash);
    this.add(fileMesh);
  }
}

export default File;
