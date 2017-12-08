import React, { PureComponent } from 'react';
import { inject } from 'mobx-react';
import styled from 'styled-components';

import Scene from './Scene';

const FRUSTRUM = 200;

@inject('ticker')
class Visualisation extends PureComponent {
  static defaultProps = {
    offsetX: 3,
    offsetZ: 0,
  };

  scene = new THREE.Scene();
  camera = new THREE.OrthographicCamera();

  handleTick = () => {
    this.renderer.render(this.scene, this.camera);
  }

  handleResize = () => {
    const rect = this.container.getBoundingClientRect();

    this.resize(rect.width, rect.height);
  }

  componentDidMount() {
    const { ticker, offsetX, offsetZ } = this.props;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
    });

    this.renderer.shadowMap.enabled = true;

    ticker.addEventListener('tick', this.handleTick);
    window.addEventListener('resize', this.handleResize);

    this.handleResize();
    this.offsetCamera(offsetX, offsetZ);
  }

  componentDidUpdate() {
    const { offsetX, offsetZ } = this.props;

    this.offsetCamera(offsetX, offsetZ);
  }

  componentWillUnmount() {
    const { ticker } = this.props;

    ticker.removeEventListener('tick', this.handleTick);
    window.removeEventListener('resize', this.handleResize);

    this.renderer.dispose();
  }

  offsetCamera(x, z) {
    this.camera.position.set(-5 + x, 5, -5 + z);
    this.camera.lookAt(x, 0, z);
    this.camera.updateProjectionMatrix();
  }

  resize(width, height) {
    this.camera.near = 0.5;
    this.camera.far = 500;
    this.camera.left = width / -FRUSTRUM;
    this.camera.right = width / FRUSTRUM;
    this.camera.top = height / FRUSTRUM;
    this.camera.bottom = height / -FRUSTRUM;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
  }

  render() {
    const { className, children } = this.props;

    return (
      <div className={className} ref={(ref) => { this.container = ref; }}>
        <canvas ref={(ref) => { this.canvas = ref; }} />
        <Scene scene={this.scene}>
          {children}
        </Scene>
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

  canvas {
    display: block;
    position: fixed;
  }
`;
