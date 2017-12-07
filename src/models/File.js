import FileStatus, { STATUS_ADDED } from './FileStatus';
import Model from './Model';

class File extends Model {
  constructor(name) {
    super();

    this.name = name;
    this.status = new FileStatus(this, STATUS_ADDED);
  }

  copy() {
    return new this.constructor(this.name);
  }
}

export default File;
