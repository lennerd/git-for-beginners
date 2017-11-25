import { MS_PER_FRAME } from './constants';

export default class Group {
  _animations = new Set();
  _prevTimestamp = 0;
  _accumulatedTime = 0;

  add(animate) {
    this._animations.add(animate);
  }

  tick(currentTimestamp) {
    const timeDelta = currentTimestamp - this._prevTimestamp;

    this._prevTimestamp = currentTimestamp;

    if (this._animations.size === 0) {
      return;
    }

    this._accumulatedTime = this._accumulatedTime + timeDelta;

    const framesToCatchUp = Math.floor(this._accumulatedTime / MS_PER_FRAME);
    const currentFrameCompletion = (this._accumulatedTime - framesToCatchUp * MS_PER_FRAME) / MS_PER_FRAME;

    for (let animation of this._animations) {
      animation.update(this._accumulatedTime, framesToCatchUp, currentFrameCompletion);
    }

    this._accumulatedTime -= framesToCatchUp * MS_PER_FRAME;
  }

  remove(animate) {
    this._animations.delete(animate);
  }
}
