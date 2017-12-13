import FileStatus, { STATUS_ADDED } from './FileStatus';
import Model from './Model';

class File extends Model {
  constructor(name) {
    super();

    this.name = name;
    this.status = new FileStatus(this, STATUS_ADDED);
  }

  clone() {
    const clone = new this.constructor(this.name);

    if (this.parent != null) {
      this.parent.add(clone);
    }

    return clone;
  }
}

export default File;
