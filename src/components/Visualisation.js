import React, { Component } from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { transaction } from 'mobx';

import VisualisationScene from './VisualisationScene';

const FRUSTRUM = 200;

class Event {
  propagationStopped = false;

  constructor(type) {
    this.type = type;
  }

  stopPropagation() {
    this.propagationStopped = true;
  }
}

function dispatchEvent(object, event) {
  transaction(() => {
    object.dispatchEvent(event);

    if (!event.propagationStopped && object.parent != null) {
      dispatchEvent(object.parent, event);
    }
  });
}

@inject('ticker')
@observer
class Visualisation extends Component {
  static defaultProps = {
    offsetX: 2,
    offsetZ: -1,
  };

  ticking = false;
  scene = new THREE.Scene();
  camera = new THREE.OrthographicCamera();
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2(0, 0);
  rect = new THREE.Vector2();

  handleTick = () => {
    /*const { tick } = this.props.tutorial;

    if (!tick) {
      return;
    }*/

    this.raycaster.setFromCamera(this.mouse, this.camera);

    this.prevIntersection = this.intersection;
    this.intersection = null;

    const intersection = this.raycaster.intersectObjects(this.scene.children, true)[0];

    if (intersection != null) {
      if (intersection.object.component) {
        this.intersection = intersection.object;
      } else {
        intersection.object.traverseAncestors((object) => {
          if (this.intersection == null && object.component) {
            this.intersection = object;
          }
        });
      }

      if (this.intersection !== this.prevIntersection) {
        if (this.prevIntersection != null) {
          dispatchEvent(this.prevIntersection, new Event('mouseleave'));
        }

        if (this.intersection != null) {
          dispatchEvent(this.intersection, new Event('mouseenter'));
        }
      }
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

    if (this.intersection == null) {
      return;
    }

    dispatchEvent(this.intersection, new Event('click'));
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
