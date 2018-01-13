import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class VisualisationObject3D extends PureComponent {
  static defaultProps = {
    onMouseEnter: () => {},
    onMouseLeave: () => {},
    onClick: () => {},
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

    object3D.addEventListener('mouseenter', this.handleMouseEnter);
    object3D.addEventListener('mouseleave', this.handleMouseLeave);
    object3D.addEventListener('click', this.handleClick);
  }

  componentWillUnmount() {
    const { object3D } = this.props;
    const { parentObject3D } = this.context;

    object3D.component = false;
    parentObject3D.remove(object3D);

    object3D.removeEventListener('mouseenter', this.handleMouseEnter);
    object3D.removeEventListener('mouseleave', this.handleMouseLeave);
    object3D.removeEventListener('click', this.handleClick);

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

  handleMouseEnter = (event) => {
    this.props.onMouseEnter(event);
  };

  handleMouseLeave = (event) => {
    this.props.onMouseLeave(event);
  };

  handleClick = (event) => {
    this.props.onClick(event);
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
