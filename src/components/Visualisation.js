import React, { PureComponent } from 'react';
import { inject } from 'mobx-react';
import styled from 'styled-components';
import 'three/examples/js/controls/OrbitControls';
import { TweenLite } from 'gsap';

import { ThreePropTypes } from './Object3D';
import SceneObject from './SceneObject';
//import Commit from './Commit';
/*import File from './File';
import FileModel from '../models/File';
import { STATUS_MODIFIED, STATUS_DELETED } from '../models/FileStatus';*/

const FRUSTRUM = 200;

const Canvas = styled.canvas`
  display: block;
  position: fixed;
`;

@inject('scene')
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
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
    });

    this.renderer.shadowMap.enabled = true;
    //this.renderer.sortObjects = false;

    TweenLite.ticker.addEventListener('tick', this.handleTick);
    window.addEventListener('resize', this.handleResize);

    this.handleResize();

    this.container.appendChild(this.renderer.domElement);
  }

  componentWillUnmount() {
    this.renderer.dispose();

    TweenLite.ticker.removeEventListener('tick', this.handleTick);
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

    /*const files = Array.apply(null, Array(4)).map((file, index) => {
      file = new FileModel();

      if (index < 2) {
        file.status.type = STATUS_MODIFIED;
        file.status.insertions = Math.round(Math.random() * 10);
        file.status.deletions = Math.round(Math.random() * 10);
      } else if (index === 3) {
        file.status.type = STATUS_DELETED;
      }

      return (
        <File
          key={index}
          level={index}
          file={file}
        />
      );
    });*/

    return (
      <div className={className} ref={(ref) => { this.container = ref; }}>
        <Canvas innerRef={(ref) => { this.canvas = ref; }} />
        <SceneObject object={scene} />
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
