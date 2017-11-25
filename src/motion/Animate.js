import Spring from './Spring';
import { SECOND_PER_FRAME } from './constants';

export default class Animate {
  _target = {};
  _velocity = {};

  constructor(object, group) {
    this._object = object;
    this._group = group;
  }

  _shouldStopAnimation() {
    for (let key of Object.keys(this._object)) {
      if (this._velocity[key] !== 0) {
        return false;
      }

      if (this._target[key] != null && this._target[key].value !== this._object[key]) {
        return false;
      }
    }

    return true;
  }

  start() {
    this._group.add(this);

    return this;
  }

  stop() {
    this._group.remove(this);

    return this;
  }

  to(target, options) {
    const oldTargetKeys = Object.keys(this._target);

    for (let key of Object.keys(target)) {
      this._target[key] = Spring.create(target[key], options);

      if (this._velocity[key] == null) {
        this._velocity[key] = 0;
      }
    }

    // Clean up target from old keys
    for (let key of oldTargetKeys) {
      if (this._target[key] != null) {
        continue;
      }

      delete this._target[key];
      delete this._velocity[key];
    }

    return this;
  }

  update(accumulatedTime, framesToCatchUp, currentFrameCompletion) {
    if (this._shouldStopAnimation()) {
      this.stop();

      return true;
    }

    for (let key of Object.keys(this._target)) {
      const target = this._target[key];

      let lastValue = this._object[key];
      let lastVelocity = this._velocity[key];

      for (let i = 0; i < framesToCatchUp; i++) {
        [lastValue, lastVelocity] = target.update(lastValue, lastVelocity, SECOND_PER_FRAME);
      }

      const [newValue, newVelocity] = target.update(lastValue, lastVelocity, SECOND_PER_FRAME);

      this._object[key] = lastValue + (newValue - lastValue) * currentFrameCompletion;
      this._velocity[key] = lastVelocity + (newVelocity - lastVelocity) * currentFrameCompletion;
    }

    return false;
  }
}
