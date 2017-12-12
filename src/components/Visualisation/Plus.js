import React, { PureComponent } from 'react';

import Object3D from './Object3D';
import PlusObject from './objects/Plus';

class Plus extends PureComponent {
  plusObject = new PlusObject();

  render() {
    const { children } = this.props;

    return (
      <Object3D object3D={this.plusObject}>
        {children}
      </Object3D>
    );
  }
}

export default Plus;
