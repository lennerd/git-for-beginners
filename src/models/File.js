import FileStatus, { STATUS_ADDED } from './FileStatus';
import SceneObject from './SceneObject';

class File extends SceneObject {
  type = 'file';

  constructor(name) {
    super();

    this.name = name;
    this.status = new FileStatus(this, STATUS_ADDED);
  }
}

export default File;
