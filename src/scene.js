import Scene from './models/Scene';
import Commit from './models/Commit';
import File from './models/File';

const file1 = new File();
const file2 = new File();
const file3 = new File();

const commit1 = new Commit([
  file1,
  new File(),
  file2,
  new File(),
]);

const commit2 = new Commit([
  new File(),
  file3,
  new File(),
]);

const scene = new Scene([
  commit1,
  commit2,
]);

setTimeout(() => {
  commit2.add(file1);
}, 2000);

setTimeout(() => {
  commit2.add(file2);
}, 4000);

setTimeout(() => {
  commit1.add(file3);
}, 6000);

export default scene;
