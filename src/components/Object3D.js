import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class Object3D extends PureComponent {
  static childContextTypes = {
    parentObject3D: PropTypes.object,
  };

  static contextTypes = {
    parentObject3D: PropTypes.object,
  };

  getChildContext() {
    const { object3D } = this.props;

    return {
      parentObject3D: object3D,
    };
  }

  componentDidMount() {
    const { object3D } = this.props;
    const { parentObject3D } = this.context;

    parentObject3D.add(object3D);
  }

  componentWillUnmount() {
    const { object3D } = this.props;
    const { parentObject3D } = this.context;

    parentObject3D.remove(object3D);

    object3D.traverse((child) => {
      if (child.geometry != null) {
        child.geometry.dispose();
      }

      if (child.material != null) {
        child.material.dispose();

        if (child.material.map) {
          child.material.map.dispose();
        }

        if (child.material.lightMap) {
          child.material.lightMap.dispose();
        }

        if (child.material.bumpMap) {
          child.material.bumpMap.dispose();
        }

        if (child.material.normalMap) {
          child.material.normalMap.dispose();
        }

        if (child.material.specularMap) {
          child.material.specularMap.dispose();
        }

        if (child.material.envMap) {
          child.material.envMap.dispose();
        }
      }
    });
  }

  render() {
    const { children } = this.props;

    return (
      <div>
        {children}
      </div>
    );
  }
}

export default Object3D;
