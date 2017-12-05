import React, { PureComponent } from 'react';
import Transition from 'react-transition-group/Transition';
import { TimelineLite, TweenLite, Power2 } from 'gsap';

import FileObject from '../objects/File';
import SceneObject from './SceneObject';

class File extends PureComponent {
  constructor(props) {
    super();

    const { file } = props;

    this.object3D = new FileObject(file.status);
  }

  componentDidMount() {
    const { file } = this.props;

    if (file.previousWorldPosition == null) {
      file.previousWorldPosition = this.object3D.getWorldPosition();
      console.log('mount', file.id, file.previousWorldPosition);
    }
  }

  componentDidUpdate(prevProps) {
    const { level, file } = this.props;

    if (level === prevProps.level) {
      return;
    }

    const { x, y, z } = file.previousWorldPosition;
    file.previousWorldPosition = this.object3D.getWorldPosition();

    TweenLite.from(this.object3D.position, 0.8, { x, y, z }).delay(0.4);
  }

  componentWillUnmount() {
    const { file } = this.props;

    file.previousWorldPosition = this.object3D.getWorldPosition();
    console.log('unmount', file.id, file.previousWorldPosition);
  }

  handleEnter = () => {
    const { file } = this.props;
    console.log('enter', file.id, file.previousWorldPosition);

    const newWorldPosition = this.object3D.getWorldPosition();
    const newPosition = this.object3D.position.clone();

    const diff = new THREE.Vector3()
      .subVectors(file.previousWorldPosition, newWorldPosition)
      .add(newPosition);

    this.object3D.position.copy(diff);

    this.tween = new TimelineLite()
      .to(this.object3D.position, 0.8, { z: diff.z / 2, x: diff.x / 2 }, 0)
      .to(this.object3D.position, 0.8, { y: newPosition.y }, 0.4)
      .to(this.object3D.position, 0.8, { z: newPosition.z, x: newPosition.x }, 0.8);
  }

  handleExit = () => {
    this.tween = null;
  }

  addEndListener = (node, done) => {
    if (this.tween == null) {
      done();
    } else {
      this.tween.eventCallback('onComplete', done);
    }

    this.tween = null;
  }

  render() {
    const { file, level, ...props } = this.props;

    return (
      <Transition
        {...props}
        onEnter={this.handleEnter}
        onExit={this.handleExit}
        addEndListener={this.addEndListener}
      >
        <SceneObject object3D={this.object3D} level={level} />
      </Transition>
    );
  }
}

export default File;
