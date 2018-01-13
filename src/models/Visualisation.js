import { observable } from "mobx";
import { serializable, list, object } from "serializr";

import File from "./File";

class Visualisation {
  @observable @serializable(list(object(File))) files = [];
}

export default Visualisation;
