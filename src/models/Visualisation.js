import { computed, action } from "mobx";

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

  @computed get activeFileIndex() {
    return this.files.findIndex(file => file.active);
  }

  @computed get activeFile() {
    return this.files[this.activeFileIndex];
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
