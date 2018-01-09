import introduction from './introduction';
import versioningOfFiles from './versioningOfFiles';

const DEFAULT_STATE = [
  introduction,
  versioningOfFiles,
];

export default function(state = DEFAULT_STATE) {
  return state;
}
