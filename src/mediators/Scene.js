import Mediator from './Mediator';

class Scene extends Mediator {
  compose() {
    const { children } = this.model;

    return children.map((object, index) => (
      this.mediate(object, { column: index })
    ));
  }
}

export default Scene;
