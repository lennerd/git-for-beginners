import { autorun } from 'mobx';

// @TODO Find better name!
class Composer {
  static create(mediatorStore, model, props) {
    const mediator = mediatorStore.get(model);

    return new this(mediatorStore, mediator, model, props);
  }

  constructor(mediatorStore, mediator, model, props) {
    this.mediatorStore = mediatorStore;
    this.mediator = mediator;
    this.props = props || {};
    this.children = [];

    this.updateChildrenDisposer = autorun(this.updateChildren, this);
    this.updateDisposer = autorun(this.update, this);
  }

  // @TODO Reuse composers!
  reuseChildren(children) {
    if (children == null) {
      return [];
    }

    return children.map(({ model, props }) => {
      const mediator = this.mediatorStore.get(model);

      return (
        new this.constructor(this.mediatorStore, mediator, model, props)
      );
    });
  }

  updateChildren() {
    this.prevChildren = this.children;
    this.children = this.reuseChildren(this.mediator.compose());

    const { object3D } = this.mediator;

    for (let prevChild of this.prevChildren) {
      prevChild.dispose();
      object3D.remove(prevChild.mediator.object3D);
    }

    for (let child of this.children) {
      object3D.add(child.mediator.object3D);
    }
  }

  update() {
    this.mediator.update(this.props);
  }

  dispose() {
    this.updateChildrenDisposer();
    this.updateDisposer();
  }
}

export default Composer;
