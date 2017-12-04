import FileStatus, { STATUS_ADDED } from './FileStatus';

class File {
  constructor(name) {
    this.name = name;
    this.status = new FileStatus(this, STATUS_ADDED);
  }
}

export default File;
