import Chance from 'chance';

const STORAGE_KEY = 'chanceSeed';

let serializedSeed = JSON.parse(localStorage.getItem(STORAGE_KEY));

if (serializedSeed == null) {
  serializedSeed = Date.now();

  localStorage.setItem(STORAGE_KEY, JSON.stringify(serializedSeed));
}

let chance;

export function reset() {
  if (chance != null) {
    Object.assign(chance, new Chance(serializedSeed));
  } else {
    chance = new Chance(serializedSeed);
  }

  chance.mixin({
    diff(diff) {
      const { added, removed } = diff;

      const newDiff = { added, removed };

      while (added === newDiff.added && removed === newDiff.removed) {
        newDiff.added = Math.max(
          0,
          newDiff.added + this.natural({ min: 0, max: 2000 }) - 1000,
        );
        newDiff.removed = Math.max(
          0,
          newDiff.removed + this.natural({ min: 0, max: 2000 }) - 1000,
        );
      }

      return newDiff;
    },

    fileName() {
      return this.unique(() => {
        return `${this.word({ length: 6 })}.${this.word({ length: 3 })}`;
      }, 1)[0];
    },
  });
}

reset();

export default chance;
