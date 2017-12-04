import React, { Component } from 'react';
import { observer } from 'mobx-react';

import sceneObjectComponentMap from '../sceneObjectComponentMap';
import { place } from '../constants';
import Object3D from './Object3D';

@observer
class SceneObject extends Component {
  constructor() {
    super();

    this.object3D = new THREE.Object3D();
  }

  render() {
    const { object } = this.props;

    const { column, row, level } = object.position;

    const Component = sceneObjectComponentMap.get(object.constructor);
    place(this.object3D, column, row, level);

    if (Component == null) {
      throw new Error('Cannot render scene object.');
    }

    const props = {
      [object.type]: object,
      children: object.children.map((child) => (
        <SceneObject object={child} key={child.id} />
      )),
    };

    return (
      <Object3D object3D={this.object3D}>
        <Component {...props} />
      </Object3D>
    );
  }
}

export default SceneObject;
