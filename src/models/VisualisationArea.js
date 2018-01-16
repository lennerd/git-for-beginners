import { observable } from 'mobx';

class VisualisationArea {
  @observable column = 0;
  @observable row = 0;
  @observable width = 1;
  @observable height = 1;
  @observable name;
}

export default VisualisationArea;
