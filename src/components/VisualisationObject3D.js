import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class VisualisationObject3D extends PureComponent {
  static defaultProps = {
    onRaycastEnter: () => {},
    onRaycastLeave: () => {},
  };

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

    object3D.component = true;
    parentObject3D.add(object3D);

    object3D.addEventListener('raycast-enter', this.handleRaycastEnter);
    object3D.addEventListener('raycast-leave', this.handleRaycastLeave);
  }

  componentWillUnmount() {
    const { object3D } = this.props;
    const { parentObject3D } = this.context;

    object3D.component = false;
    parentObject3D.remove(object3D);

    object3D.removeEventListener('raycast-enter', this.handleRaycastEnter);
    object3D.removeEventListener('raycast-leave', this.handleRaycastLeave);

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

  handleRaycastEnter = (event) => {
    this.props.onRaycastEnter(event);
  };

  handleRaycastLeave = (event) => {
    this.props.onRaycastLeave(event);
  };

  render() {
    const { children } = this.props;

    return (
      <div>
        {children}
      </div>
    );
  }
}

export default VisualisationObject3D;
