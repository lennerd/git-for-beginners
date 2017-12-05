import React, { PureComponent } from 'react';

import World from './World';
import Floor from './Floor';
import CommitModel from '../models/Commit';
import Commit from './Commit';

class Scene extends PureComponent {
  render() {
    const { scene } = this.props;

    const componentMap = {
      [CommitModel.type]: Commit,
    };

    const children = scene.children.map((object, index) => {
      const Component = componentMap[object.constructor.type];

      if (Component == null) {
        throw new Error(`No component for object ${object.constructor.type}`);
      }

      return React.createElement(Component, {
        [object.constructor.type]: object,
        key: object.id,
        column: index,
       });
    });

    return (
      <World>
        <Floor>
          {children}
        </Floor>
      </World>
    )
  }
}

export default Scene;
