import FileStatus, { STATUS_ADDED } from './FileStatus';
import Model from './Model';

class File extends Model {
  static type = 'file';

  constructor(name) {
    super();

    this.name = name;
    this.status = new FileStatus(this, STATUS_ADDED);
  }
}

export default File;
