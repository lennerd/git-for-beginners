import React, { Component } from 'react';
import { observer } from 'mobx-react';
import TransitionGroup from 'react-transition-group/TransitionGroup';

import File from './File';
import SceneObject from './SceneObject';
import { STATUS_ADDED, STATUS_DELETED, STATUS_MODIFIED } from '../models/FileStatus';

@observer
class Commit extends Component {
  render() {
    const { commit, ...props } = this.props;

    const files = commit.children
      .sort(sortByChanges)
      .map((file, index) => (
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

function sortByChanges({ status: statusA }, { status: statusB }) {
  if (statusA.type === STATUS_ADDED && statusB.type === STATUS_DELETED) {
    return -1;
  }

  if (statusA.type === STATUS_DELETED && statusB.type === STATUS_ADDED) {
    return 1;
  }

  if (statusA.type !== STATUS_MODIFIED && statusB.type !== STATUS_MODIFIED) {
    return 0;
  }

  if (statusA.type === STATUS_MODIFIED && statusB.type !== STATUS_MODIFIED) {
    return -1;
  }

  if (statusA.type !== STATUS_MODIFIED && statusB.type === STATUS_MODIFIED) {
    return 1;
  }

  return statusA.changes < statusB.changes;
}

export default Commit;
