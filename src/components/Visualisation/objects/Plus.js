const plusShape = new THREE.Shape()
plusShape.moveTo(1, 0);
plusShape.lineTo(2, 0);
plusShape.lineTo(2, 1);
plusShape.lineTo(3, 1);
plusShape.lineTo(3, 2);
plusShape.lineTo(2, 2);
plusShape.lineTo(2, 3);
plusShape.lineTo(1, 3);
plusShape.lineTo(1, 2);
plusShape.lineTo(0, 2);
plusShape.lineTo(0, 1);
plusShape.lineTo(1, 1);
plusShape.lineTo(1, 0); // Close path

class Plus extends THREE.Group {
  constructor() {
    super();

    const plusMesh = new THREE.Mesh(
      new THREE.ShapeBufferGeometry(plusShape),
      new THREE.MeshBasicMaterial({ color: 0x000000 }),
    );

    plusMesh.rotation.x = Math.PI / 2;
    plusMesh.castShadow = true;
    plusMesh.position.set(-1.5 * 0.25, 0, -1.5 * 0.25);
    plusMesh.scale.set(0.25, 0.25, 0.25);

    this.add(plusMesh);
  }
}

export default Plus;
