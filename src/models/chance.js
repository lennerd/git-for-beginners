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
        added: this.natural({ min: 0, max: 2000 }) - 1000,
        removed: this.natural({ min: 0, max: 2000 }) - 1000
      };
    },

    fileName() {
      return this.unique(() => {
        return `${this.word({ length: 6 })}.${this.word({ length: 3 })}`
      }, 1)[0];
    }
  });
}

reset();

export default chance;
