class Container {
  keys = {};
  raw = {};
  values = {};
  frozen = {};
  factories = new Map();
  protected = new Map();

  set(id, value) {
    if (id in this.frozen) {
      throw new Error(`Frozen service ${id}.`);
    }

    this.values[id] = value;
    this.keys[id] = true;
  }

  async get(id) {
    if (!this.has(id)) {
      throw new Error(`Unknown service ${id}`);
    }

    if (
      id in this.raw ||
      typeof this.values[id] !== 'function' ||
      this.protected.has(id)
    ) {
      return this.values[id];
    }

    const raw = this.values[id];
    const value = await raw(this);

    if (this.factories.has(raw)) {
      return value;
    }

    this.raw[id] = raw;
    this.frozen[id] = true;

    return value;
  }

  has(id) {
    return id in this.keys;
  }

  delete(id) {
    if (!this.has(id)) {
      return;
    }

    const value = this.values[id];

    if (typeof value === 'function') {
      this.factories.delete(value);
      this.protected.delete(value);
    }

    delete this.values[id];
    delete this.frozen[id];
    delete this.raw[id];
    delete this.keys[id];
  }

  factory(callback) {
    if (typeof callback !== 'function') {
      throw new Error('Expected function.');
    }

    this.factories.set(callback, true);

    return callback;
  }

  protect(callback) {
    if (typeof callback !== 'function') {
      throw new Error('Expected function.');
    }

    this.protected.set(callback, true);

    return callback;
  }

  extend(id, callback) {
    if (!this.has(id)) {
      throw new Error(`Unknown serice ${id}`);
    }

    if (id in this.frozen) {
      throw new Error(`Frozen service ${id}.`);
    }

    const factory = this.value[id];

    if (typeof factory !== 'function') {
      throw new Error('Can only extend functions.');
    }

    const extended = function(container) {
      return callback(factory(container), container);
    }

    if (this.factories.has(factory)) {
      this.factories.delete(factory);
      this.factories.set(extended);
    }

    this.set(id, extended);

    return extended;
  }
}

export default Container;
