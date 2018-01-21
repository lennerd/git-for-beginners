import Chance from 'chance';

const STORAGE_KEY = 'chanceSeed';

let serializedSeed = JSON.parse(localStorage.getItem(STORAGE_KEY));

if (serializedSeed == null) {
  serializedSeed = Date.now();

  localStorage.setItem(STORAGE_KEY, JSON.stringify(serializedSeed));
}

let chance;

export function reset() {
  chance = new Chance(serializedSeed);

  chance.mixin({
    diff() {
      return {
        added: chance.natural(),
        removed: chance.natural()
      };
    }
  });
}

reset();

export default chance;
