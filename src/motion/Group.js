export default class Group {
  _animations = new Set();

  add(animate) {
    this._animations.add(animate);
  }

  tick(currentTimestamp) {
    if (this._animations.size === 0) {
      return;
    }

    for (let animation of this._animations) {
      animation.tick(currentTimestamp);
    }
  }

  remove(animate) {
    this._animations.delete(animate);
  }
}
