import { computed, action } from "mobx";
import flatten from 'lodash/flatten';
import findIndex from 'lodash/findIndex';

class Visualisation {
  @computed get files() {
    return [];
  }

  @computed get areas() {
    return [];
  }

  @computed get fileLists() {
    return [];
  }

  @computed get commits() {
    return [];
  }

  @computed get hover() {
    return this.files.some(file => file.hover) ||
      this.fileLists.some(fileList => fileList.hover) ||
      this.commits.some(commit => commit.hover || commit.hoverCommit);
  }

  @computed get flattenFiles() {
    return flatten([
      ...this.files,
      ...this.fileLists.map(fileList => fileList.files.peek()),
      ...this.commits.map(commit => commit.files.peek()),
    ]);
  }

  @computed get activeFileIndex() {
    return findIndex(this.flattenFiles, file => file.active);
  }

  @computed get activeFile() {
    return this.flattenFiles[this.activeFileIndex];
  }

  @computed get lastFile() {
    return this.files[this.files.length - 1];
  }

  @action deactivateAll() {
    this.files.forEach(file => {
      file.active = false;
    });

    this.fileLists.forEach(fileList => {
      fileList.active = false
    });

    this.commits.forEach(commit => {
      commit.commitActive = false;
      commit.active = false
    });
  }
}

export default Visualisation;
