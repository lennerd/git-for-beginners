import React, { PureComponent } from 'react';

import Object3D from './Object3D';
import File from './File';

class Commit extends PureComponent {
  render() {
    const { commit } = this.props;

    return (
      <Object3D>
        {commit.map((file, index) => <File key={index} level={index} />)}
      </Object3D>
    )
  }
}

export default Commit;
