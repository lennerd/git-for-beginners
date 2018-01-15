import { custom } from "serializr";
import { observable, toJS } from "mobx";

export default custom(
  value => toJS(value),
  value => observable.map(value),
);
