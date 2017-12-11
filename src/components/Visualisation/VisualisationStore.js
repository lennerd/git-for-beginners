import { observable, action } from 'mobx';

class VisualisationStore {
  @observable tick = true;

  constructor(ticker) {
    this.ticker = ticker;
  }

  @action pause() {
    this.tick = false;
  }

  @action play() {
    this.tick = true;
  }
}

export default VisualisationStore;
