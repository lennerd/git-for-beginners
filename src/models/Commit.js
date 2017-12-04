import { action } from 'mobx';

import SceneObject from './SceneObject';

class Commit extends SceneObject {
  type = 'commit';

  @action add(child) {
    super.add(child);

    const level = this.children.indexOf(child);
    child.position.level = level;
  }

  @action remove(child) {
    super.remove(child);

    child.position.level = 0;
  }
}

export default Commit;
