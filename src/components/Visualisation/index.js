import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';

import Scene from './Scene';

const FRUSTRUM = 200;

@inject('visualisation')
@observer
class Visualisation extends Component {
  static defaultProps = {
    offsetX: 2,
    offsetZ: -2,
  };

  scene = new THREE.Scene();
  camera = new THREE.OrthographicCamera();
  ticking = false;

  handleTick = () => {
    const { tick } = this.props.visualisation;

    if (tick) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  handleResize = () => {
    const rect = this.container.getBoundingClientRect();

    this.resize(rect.width, rect.height);
  }

  componentDidMount() {
    const { offsetX, offsetZ } = this.props;

    this.offsetCamera(offsetX, offsetZ);
    this.startTicking();
  }

  componentDidUpdate() {
    const { offsetX, offsetZ } = this.props;

    this.offsetCamera(offsetX, offsetZ);
    this.startTicking();
  }

  componentWillUnmount() {
    if (!this.ticking) {
      return;
    }

    const { ticker } = this.props.visualisation;

    ticker.removeEventListener('tick', this.handleTick);
    window.removeEventListener('resize', this.handleResize);

    this.renderer.dispose();
  }

  startTicking() {
    const { tick, ticker } = this.props.visualisation;

    if (this.ticking || !tick) {
      return;
    }

    this.ticking = true;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
    });

    this.renderer.shadowMap.enabled = true;

    ticker.addEventListener('tick', this.handleTick);
    window.addEventListener('resize', this.handleResize);

    this.handleResize();
    this.handleTick();
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
  z-index: 0;

  canvas {
    display: block;
    position: fixed;
  }
`;
