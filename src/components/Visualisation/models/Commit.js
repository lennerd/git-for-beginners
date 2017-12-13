import sha1 from 'js-sha1';
import { computed, observable } from 'mobx';
import moment from 'moment';

import Model from './Model';

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
}

export default Commit;
