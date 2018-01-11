import { extendObservable, observable, action } from 'mobx';

class Section {
  @observable reached = false;
  @observable completed = false;
  @observable.ref text;

  constructor(data) {
    extendObservable(this, data);
  }

  @action reach() {
    this.reached = true;
  }
}

export default Section;
