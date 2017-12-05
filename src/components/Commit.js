import React, { Component } from 'react';
import { observer } from 'mobx-react';
import TransitionGroup from 'react-transition-group/TransitionGroup';

import File from './File';
import SceneObject from './SceneObject';

@observer
class Commit extends Component {
  render() {
    const { commit, ...props } = this.props;

    const files = commit.children.map((file, index) => (
      <File file={file} key={file.id} level={index} />
    ));

    return (
      <SceneObject {...props}>
        <TransitionGroup>
          {files}
        </TransitionGroup>
      </SceneObject>
    )
  }
}

export default Commit;
