import Animate from './Animate';
import Group from './Group';
import Spring from './Spring';

const motion = new Group();

export function animate(object) {
  return new Animate(object, motion);
}

export function tick(timestamp) {
  return motion.tick(timestamp);
}

export {
  Spring,
};
