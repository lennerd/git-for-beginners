import { autorun } from 'mobx';

class Composer {
  constructor(mediatorStore, model, props) {
    this.mediatorStore = mediatorStore;
    this.mediator = this.mediatorStore.get(model);
    this.props = props || {};
    this.children = [];

    this.updateChildrenDisposer = autorun(this.updateChildren, this);
    this.updateDisposer = autorun(this.update, this);
  }

  composeChildren(children) {
    if (children == null) {
      return [];
    }

    return children.map(({ model, props }) => (
      new this.constructor(this.mediatorStore, model, props)
    ));
  }

  updateChildren() {
    this.prevChildren = this.children;
    this.children = this.composeChildren(this.mediator.compose());

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
