import sha1 from 'js-sha1';
import { computed, observable } from 'mobx';
import moment from 'moment';

import Model from './Model';
import { STATUS_ADDED, STATUS_DELETED, STATUS_MODIFIED } from './FileStatus';

class Commit extends Model {
  @observable author;

  @computed get hash() {
    return sha1(this.id);
  }

  @computed get shortHash() {
    return this.hash.substring(0, 6);
  }

  @computed get date() {
    return moment().format('DD-MM-YYYY');
  }

  @computed get maxChanges() {
    return Math.max(0, ...this.children.map(file => file.status.changes));
  }

  @computed get hasChanges() {
    return this.children.some(file => (
      file.status.type === STATUS_ADDED ||
      file.status.type === STATUS_DELETED ||
      (file.status.type === STATUS_MODIFIED && file.status.changes > 0)
    ));
  }

  clone() {
    const clone = super.clone();
    clone.author = this.author;

    return clone;
  }
}

export default Commit;
