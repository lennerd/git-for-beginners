class Mediator {
  constructor(model) {
    this.model = model;
    this.object3D = this.createObject3D();
  }

  mediate(model, props = null) {
    return {
      model,
      props,
    };
  }

  createObject3D() {
    return new THREE.Group();
  }

  compose() {

  }

  update() {

  }

  mount() {

  }

  unmount() {

  }
}

export default Mediator;
