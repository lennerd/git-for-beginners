import React, { PureComponent } from 'react';
import { inject } from 'mobx-react';
import styled from 'styled-components';
import 'three/examples/js/controls/OrbitControls';

import Composer from '../mediators/Composer';
import World from '../objects/World';
import Floor from '../objects/Floor';

const FRUSTRUM = 200;

const Canvas = styled.canvas`
  display: block;
  position: fixed;
`;

@inject('scene', 'mediatorStore', 'ticker')
class Visualisation extends PureComponent {
  constructor(props) {
    super();

    const { mediatorStore, scene } = props;

    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera();
    this.composer = Composer.create(mediatorStore, scene);
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

    ticker.addEventListener('tick', this.handleTick);
    window.addEventListener('resize', this.handleResize);

    this.handleResize();

    this.container.appendChild(this.renderer.domElement);

    const world = new World();
    const floor = new Floor();

    world.add(floor);
    this.scene.add(world);

    floor.add(this.composer.mediator.object3D);
  }

  componentWillUnmount() {
    const { ticker } = this.props;

    this.renderer.dispose();
    this.composer.dispose();

    ticker.removeEventListener('tick', this.handleTick);
    window.removeEventListener('resize', this.handleResize);
  }

  render() {
    const { className } = this.props;

    this.camera.position.set(-5, 5, -5);
    this.camera.lookAt(this.scene.position);
    this.camera.updateProjectionMatrix();

    return (
      <div className={className} ref={(ref) => { this.container = ref; }}>
        <Canvas innerRef={(ref) => { this.canvas = ref; }} />
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
