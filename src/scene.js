import Scene from './models/Scene';
import Commit from './models/Commit';
import File from './models/File';
import { STATUS_MODIFIED, STATUS_DELETED, STATUS_ADDED } from './models/FileStatus';

const files = Array.apply(null, Array(7)).map((file, index) => {
  file = new File();

  const status = Math.floor(Math.random() * 3 % 3);

  if (status === 0) {
    file.status.type = STATUS_MODIFIED;
    file.status.insertions = Math.round(Math.random() * 10);
    file.status.deletions = Math.round(Math.random() * 10);
  } else if (status === 1) {
    file.status.type = STATUS_DELETED;
  } else if (status === 2) {
    file.status.type = STATUS_ADDED;
  }

  return file;
});

const commit1 = new Commit([
  files[0],
  files[1],
  files[2],
  files[3],
]);

const commit2 = new Commit([
  files[4],
  files[5],
  files[6],
]);

const scene = new Scene([
  commit1,
  commit2,
]);

setTimeout(() => {
  commit2.add(files[1]);
}, 2000);

setTimeout(() => {
  commit2.add(files[3]);
}, 4000);

setTimeout(() => {
  commit1.add(files[5]);
}, 6000);

export default scene;
