const returnTuple = [0, 0];

export default class Spring {
  static NO_WOBBLE = { stiffness: 170, damping: 26 };
  static GENTLE = { stiffness: 120, damping: 14 };
  static WOBBLY = { stiffness: 180, damping: 12 };
  static STIFF = { stiffness: 210, damping: 20 };

  constructor(value, options) {
    this.value = value;
    this.stiffness = options.stiffness;
    this.damping = options.damping;
    this.precision = options.precision;
  }

  static create(value, options = null) {
    if (value instanceof Spring) {
      return value;
    }

    return new Spring(value, {
      ...this.NO_WOBBLE,
      precision: 0.01,
      ...options,
    });
  }

  update(value, velocity, secondPerFrame) {
    const spring = -this.stiffness * (value - this.value);
    const damper = -this.damping * velocity;
    const a = spring + damper;

    const newVelocity = velocity + a * secondPerFrame;
    const newValue = value + newVelocity * secondPerFrame;

    if (Math.abs(newVelocity) < this.precision && Math.abs(newValue - this.value) < this.precision) {
      returnTuple[0] = this.value;
      returnTuple[1] = 0;

      return returnTuple;
    }

    returnTuple[0] = newValue;
    returnTuple[1] = newVelocity;

    return returnTuple;
  }
}
