import { observable } from 'mobx';

class Position {
  @observable column;
  @observable row;
  @observable level;

  constructor(column = 0, row = 0, level = 0) {
    this.column = column;
    this.row = row;
    this.level = level;
  }
}

export default Position;
