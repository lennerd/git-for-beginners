import React, { PureComponent } from 'react';

import VisualisationObject3D from './VisualisationObject3D';

class VisualisationFloor extends PureComponent {
  constructor() {
    super();

    this.floorObject = new THREE.Group();

    this.shadowMesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(50, 50),
      new THREE.ShadowMaterial({ opacity: 0.1, depthWrite: false, color: new THREE.Color('#1126B4') }),
    );


    this.shadowMesh.receiveShadow = true;
    this.shadowMesh.rotation.x = Math.PI / -2;

    this.floorObject.add(this.shadowMesh);
  }

  render() {
    const { children } = this.props;

    return (
      <VisualisationObject3D object3D={this.floorObject}>
        {children}
      </VisualisationObject3D>
    );
  }
}

export default VisualisationFloor;
