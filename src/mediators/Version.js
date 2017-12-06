import { TweenLite } from 'gsap';

import Mediator from './Mediator';
import { CELL_WIDTH } from '../constants';

class Verion extends Mediator {
  update(props) {
    const { column } = props;

    this.object3D.position.z = CELL_WIDTH * column;

    if (this.prevColumn != null && column !== this.prevColumn) {
      TweenLite
        .from(this.object3D.position, 0.8, { z: CELL_WIDTH * this.prevColumn });
    }

    this.prevColumn = column;
  }

  compose() {
    const { children } = this.model;

    return children.map(object => (
      this.mediate(object)
    ));
  }
}

export default Verion;
