import FileStatus, { STATUS_ADDED } from './FileStatus';
import Model from './Model';

class File extends Model {
  static type = 'file';

  constructor(name) {
    super();

    this.name = name;
    this.status = new FileStatus(this, STATUS_ADDED);
  }

  copy() {
    const file = new this.constructor(this.name);

    if (this.parent != null) {
      this.parent.add(file);
    }

    return file;
  }
}

export default File;
