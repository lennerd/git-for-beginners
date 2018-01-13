import uuid from 'uuid/v4';
import { serializable, identifier } from 'serializr';
import { observable } from 'mobx';

class File {
  @serializable(identifier()) id = uuid();
  @serializable @observable column = 0;
  @serializable @observable level = 0;
  @serializable @observable row = 0;
  @observable hover = false;
  @serializable @observable active = false;
}

export default File;
