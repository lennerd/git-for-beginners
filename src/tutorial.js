import { autorun } from 'mobx';
import { update, serialize } from 'serializr';

import chapters from './data/chapters';
import Tutorial from "./models/Tutorial";

const tutorial = Tutorial.create({ chapters });

const state = localStorage.getItem('tutorial');

// Restore old state from local storage
if (state != null) {
  update(Tutorial, tutorial, JSON.parse(state));
}

// Store new states into local storge, as soon as serializable properties changed.
autorun(() => {
  const state = JSON.stringify(serialize(tutorial));

  localStorage.setItem('tutorial', state);

  console.log(state);
});

export default tutorial;
