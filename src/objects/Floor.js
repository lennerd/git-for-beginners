class Floor extends THREE.Group {
  constructor() {
    super();

    this.shadowMesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(50, 50),
      new THREE.ShadowMaterial({ opacity: 0.1 }),
    );

    /*this.mesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(50, 50),
      new THREE.MeshBasicMaterial({ color: 0xffffff }),
    );*/

    this.shadowMesh.receiveShadow = true;
    this.shadowMesh.rotation.x = Math.PI / -2;
    //this.mesh.rotation.x = Math.PI / -2;

    this.add(this.shadowMesh);
    //this.add(this.mesh);
  }
}

export default Floor;
