import React, { PureComponent } from 'react';
import Transition from 'react-transition-group/Transition';
import { TimelineLite, TweenLite } from 'gsap';

import FileObject from '../objects/File';
import SceneObject from './SceneObject';

class File extends PureComponent {
  constructor(props) {
    super();

    const { file } = props;

    this.object3D = new FileObject(file.status);
  }

  handleEntering = () => {
    const { file } = this.props;
    const { previousWorldPosition } = file;

    const newWorldPosition = file.previousWorldPosition = this.object3D.getWorldPosition();
    const newPosition = this.object3D.position.clone();

    const diff = new THREE.Vector3()
      .subVectors(previousWorldPosition, newWorldPosition)
      .add(newPosition);

    this.object3D.position.copy(diff);

    this.tween = new TimelineLite()
      .to(this.object3D.position, 0.8, { z: diff.z / 2, x: diff.x / 2 }, 0)
      .to(this.object3D.position, 0.8, { y: newPosition.y }, 0.4)
      .to(this.object3D.position, 0.8, { z: newPosition.z, x: newPosition.x }, 0.8);
  }

  handleExit = (...args) => {
    this.props.file.previousWorldPosition = this.object3D.getWorldPosition();
  }

  addEndListener = (node, done) => {
    if (this.tween == null) {
      done();
    } else {
      this.tween.eventCallback('onComplete', done);
    }

    this.tween = null;
  }

  componentWillUpdate() {
    this.props.file.previousWorldPosition = this.object3D.getWorldPosition();
  }

  componentDidUpdate(prevProps) {
    const { level, file } = this.props;

    if (level === prevProps.level) {
      return;
    }

    const { y } = file.previousWorldPosition;

    TweenLite.from(this.object3D.position, 0.8, { y }).delay(0.4);
  }

  render() {
    const { file, level, ...props } = this.props;

    return (
      <Transition
        {...props}
        onEntering={this.handleEntering}
        onExit={this.handleExit}
        addEndListener={this.addEndListener}
      >
        <SceneObject object3D={this.object3D} level={level} />
      </Transition>
    );
  }
}

export default File;
