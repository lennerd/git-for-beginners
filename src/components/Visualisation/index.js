import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';

import Scene from './Scene';

const FRUSTRUM = 200;

@inject('visualisation')
@observer
class Visualisation extends Component {
  static defaultProps = {
    offsetX: 3,
    offsetZ: 0,
  };

  intersections = new Set();
  ticking = false;
  scene = new THREE.Scene();
  camera = new THREE.OrthographicCamera();
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
  rect = new THREE.Vector2();

  handleTick = () => {
    const { tick } = this.props.visualisation;

    if (!tick) {
      return;
    }

    this.raycaster.setFromCamera(this.mouse, this.camera);

    this.prevIntersections = new Set(this.intersections);
    this.intersections.clear();

    const intersections = this.raycaster.intersectObjects(this.scene.children, true);

    for (let intersection of intersections) {
      if (intersection.object.component) {
        this.intersections.add(intersection.object);
      }

      intersection.object.traverseAncestors((object) => {
        if (object.component) {
          this.intersections.add(object);
        }
      });
    }

    const enterEvent = { type: 'raycast-enter' };

    for (let intersection of this.intersections.values()) {
      if (this.prevIntersections.has(intersection)) {
        continue;
      }

      intersection.dispatchEvent(enterEvent);
    }

    const leaveEvent = { type: 'raycast-leave' };

    for (let prevIntersection of this.prevIntersections.values()) {
      if (this.intersections.has(prevIntersection)) {
        continue;
      }

      prevIntersection.dispatchEvent(leaveEvent);
    }

    this.renderer.render(this.scene, this.camera);
  }

  handleResize = () => {
    const rect = this.container.getBoundingClientRect();

    this.rect.set(rect.width, rect.height);
    this.resize();
  }

  handleMouseMove = (event) => {
    this.mouse.set(
      (event.clientX / this.rect.x) * 2 - 1,
      -(event.clientY / this.rect.y) * 2 + 1,
    );
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

  resize() {
    this.camera.near = 0.5;
    this.camera.far = 500;
    this.camera.left = this.rect.x / -FRUSTRUM;
    this.camera.right = this.rect.x / FRUSTRUM;
    this.camera.top = this.rect.y / FRUSTRUM;
    this.camera.bottom = this.rect.y / -FRUSTRUM;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.rect.x, this.rect.y);
    this.renderer.setPixelRatio(window.devicePixelRatio);
  }

  render() {
    const { className, children } = this.props;

    return (
      <div
        className={className}
        ref={(ref) => { this.container = ref; }}
        onMouseMove={this.handleMouseMove}
      >
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
