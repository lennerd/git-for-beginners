class MediatorStore {
  mediators = new Map();
  mediatorRegistry = new Map();

  get(model) {
    let mediator = this.mediators.get(model);

    if (mediator != null) {
      return mediator;
    }

    const mediatorClass = this.mediatorRegistry.get(model.constructor)

    if (mediatorClass == null) {
      throw new Error(`Missing mediator for model type "${model.constructor.name}".`);
    }

    mediator = new mediatorClass(model);
    this.mediators.set(model, mediator);

    return mediator;
  }

  register(modelClass, mediatorClass) {
    this.mediatorRegistry.set(modelClass, mediatorClass);
  }
}

export default MediatorStore;
