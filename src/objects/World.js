class World extends THREE.Object3D {
  constructor(floor) {
    super();

    const shadowCaster = new THREE.DirectionalLight(0xFEFFF5, 0.4);
    shadowCaster.castShadow = true;
    shadowCaster.shadow.mapSize.width = 4096;
    shadowCaster.shadow.mapSize.height = 4096;
    shadowCaster.shadow.camera.left = 10;
    shadowCaster.shadow.camera.right = -10;
    shadowCaster.shadow.camera.top = 10;
    shadowCaster.shadow.camera.bottom = -10;
    shadowCaster.position.set(16, 32, -16);

    const ambientLight = new THREE.AmbientLight(0xF5FDFF, 0.7);

    this.add(shadowCaster);
    this.add(new THREE.DirectionalLightHelper(shadowCaster));
    this.add(ambientLight);
  }
}

export default World;
