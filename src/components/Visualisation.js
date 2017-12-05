import React, { PureComponent } from 'react';
import { inject } from 'mobx-react';
import styled from 'styled-components';
import 'three/examples/js/controls/OrbitControls';

import { ThreePropTypes } from './Object3D';
import Scene from './Scene';
//import Commit from './Commit';
/*import File from './File';
import FileModel from '../models/File';
import { STATUS_MODIFIED, STATUS_DELETED } from '../models/FileStatus';*/

const FRUSTRUM = 200;

const Canvas = styled.canvas`
  display: block;
  position: fixed;
`;

@inject('scene', 'ticker')
class Visualisation extends PureComponent {
  static childContextTypes = {
    object3D: ThreePropTypes.object3D,
    scene: ThreePropTypes.scene,
  };

  constructor() {
    super();

    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera();
  }

  handleTick = () => {
    this.renderer.render(this.scene, this.camera);
  }

  handleResize = () => {
    const rect = this.container.getBoundingClientRect();

    this.camera.near = 0.5;
    this.camera.far = 500;
    this.camera.left = rect.width / -FRUSTRUM;
    this.camera.right = rect.width / FRUSTRUM;
    this.camera.top = rect.height / FRUSTRUM;
    this.camera.bottom = rect.height / -FRUSTRUM;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(rect.width, rect.height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
  }

  componentDidMount() {
    const { ticker } = this.props;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
    });

    this.renderer.shadowMap.enabled = true;
    //this.renderer.sortObjects = false;

    ticker.addEventListener('tick', this.handleTick);
    window.addEventListener('resize', this.handleResize);

    this.handleResize();

    this.container.appendChild(this.renderer.domElement);
  }

  componentWillUnmount() {
    const { ticker } = this.props;

    this.renderer.dispose();

    ticker.removeEventListener('tick', this.handleTick);
    window.removeEventListener('resize', this.handleResize);
  }

  getChildContext() {
    return {
      scene: this.scene,
      object3D: this.scene,
    };
  }

  render() {
    const { className, scene } = this.props;

    // Update camera
    this.camera.position.set(-5, 5, -5);
    this.camera.lookAt(this.scene.position);
    this.camera.updateProjectionMatrix();

    return (
      <div className={className} ref={(ref) => { this.container = ref; }}>
        <Canvas innerRef={(ref) => { this.canvas = ref; }} />
        <Scene scene={scene} />
      </div>
    );
  }
}

export default styled(Visualisation)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(to bottom right, #ffffff, #B9C0E5);
`;