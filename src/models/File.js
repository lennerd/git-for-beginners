import uuid from 'uuid/v4';
import { serializable, identifier } from 'serializr';

class File {
  @serializable(identifier()) id = uuid();
}

export default File;
