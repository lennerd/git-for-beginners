import React, { Component } from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx';

import VisualisationScene from './VisualisationScene';

const FRUSTRUM = 200;

@inject('ticker')
@observer
class Visualisation extends Component {
  static defaultProps = {
    offsetX: 2,
    offsetZ: -1,
  };

  intersections = new Set();
  ticking = false;
  scene = new THREE.Scene();
  camera = new THREE.OrthographicCamera();
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2(0, 0);
  rect = new THREE.Vector2();

  @observable hovering = 0;

  handleTick = () => {
    /*const { tick } = this.props.tutorial;

    if (!tick) {
      return;
    }*/

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

    const mouseEnterEvent = { type: 'mouseenter' };

    for (let intersection of this.intersections.values()) {
      if (this.prevIntersections.has(intersection)) {
        continue;
      }

      intersection.dispatchEvent(mouseEnterEvent);
    }

    const mouseLeaveEvent = { type: 'mouseleave' };

    for (let prevIntersection of this.prevIntersections.values()) {
      if (this.intersections.has(prevIntersection)) {
        continue;
      }

      prevIntersection.dispatchEvent(mouseLeaveEvent);
    }

    this.renderer.render(this.scene, this.camera);
  }

  handleResize = () => {
    const rect = this.container.getBoundingClientRect();

    this.rect.set(rect.width, rect.height);
    this.resize();
  };

  handleMouseMove = (event) => {
    this.mouse.set(
      (event.clientX / this.rect.x) * 2 - 1,
      -(event.clientY / this.rect.y) * 2 + 1,
    );
  };

  handleClick = (event) => {
    event.preventDefault();

    const clickEvent = {
      type: 'click',
      propagationStopped: false,
      stopPropagation() {
        this.propagationStopped = true;
      },
    };

    for (let intersection of this.intersections.values()) {
      intersection.dispatchEvent(clickEvent);

      if (clickEvent.propagationStopped) {
        break;
      }
    }
  };

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

    const { ticker } = this.props;

    ticker.removeEventListener('tick', this.handleTick);
    window.removeEventListener('resize', this.handleResize);

    this.renderer.dispose();
  }

  startTicking() {
    const { /*tick, */ticker } = this.props;

    if (this.ticking/* || !tick*/) {
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
    const { className, children, vis } = this.props;

    return (
      <div
        className={className}
        style={{ cursor: vis.hover ? 'pointer' : 'auto' }}
        ref={(ref) => { this.container = ref; }}
        onMouseMove={this.handleMouseMove}
        onClick={this.handleClick}
      >
        <canvas ref={(ref) => { this.canvas = ref; }} />
        <VisualisationScene vis={vis} scene={this.scene}>
          {children}
        </VisualisationScene>
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
