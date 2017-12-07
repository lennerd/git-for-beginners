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
