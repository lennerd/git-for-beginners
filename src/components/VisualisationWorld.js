import React, { PureComponent } from 'react';
import { action } from 'mobx';

import VisualisationObject3D from './VisualisationObject3D';

class VisualisationWorld extends PureComponent {
  constructor() {
    super();

    this.worldObject = new THREE.Group();

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

    this.worldObject.add(shadowCaster);
    // this.worldObject.add(new THREE.DirectionalLightHelper(shadowCaster)); // debug
    this.worldObject.add(ambientLight);
  }

  @action.bound handleClick() {
    const { vis } = this.props;

    vis.active = false;
  }

  render() {
    const { children } = this.props;

    return (
      <VisualisationObject3D object3D={this.worldObject} onClick={this.handleClick}>
        {children}
      </VisualisationObject3D>
    );
  }
}

export default VisualisationWorld;
