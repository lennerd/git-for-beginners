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
        added: this.natural(),
        removed: this.natural()
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
