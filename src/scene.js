import Scene from './models/Scene';
import Commit from './models/Commit';
import File from './models/File';

const commit = new Commit([
  new File(),
  new File(),
  new File(),
  new File(),
]);

const scene = new Scene([
  commit,
]);

setTimeout(() => {
  commit.add(new File());
}, 2000);

export default scene;
