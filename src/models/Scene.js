import { action } from 'mobx';
import Model from './Model';

class Scene extends Model {
  @action limit(limit) {
    for (let i = limit; i < this.children.length; i++) {
      const child = this.children[i];

      this.remove(child);
    }
  }
}

export default Scene;
