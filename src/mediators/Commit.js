import Mediator from './Mediator';

import { CELL_WIDTH } from '../constants';
import { STATUS_ADDED, STATUS_DELETED, STATUS_MODIFIED } from '../models/FileStatus';

class Commit extends Mediator {
  update(props) {
    const { column } = props;

    this.object3D.position.z = CELL_WIDTH * column;
  }

  compose() {
    const { children } = this.model;

    return children.sort(sortByChanges)
      .map((file, index) => this.mediate(file, { level: index }));
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
