import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export const ThreePropTypes = {
  object3D: PropTypes.instanceOf(THREE.Object3D),
  scene: PropTypes.instanceOf(THREE.Scene),
};

class Object3D extends PureComponent {
  static childContextTypes = {
    object3D: ThreePropTypes.object3D,
  };

  static contextTypes = {
    object3D: ThreePropTypes.object3D,
  };

  constructor(props) {
    super();

    this.object3D = props.object3D || new THREE.Object3D();
  }

  getChildContext() {
    const { object3D } = this.props;

    return {
      object3D,
    };
  }

  componentDidMount() {
    const { object3D: parentObject3D } = this.context;
    const { object3D } = this.props;

    parentObject3D.add(object3D);
  }

  componentWillUnmount() {
    const { object3D: parentObject3D } = this.context;

    parentObject3D.remove(this.object3D);
  }

  render() {
    const { children } = this.props;

    return <div>{children}</div>;
  }
}

export default Object3D;
