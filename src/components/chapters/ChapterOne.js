import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { TimelineLite } from 'gsap';

import Visualisation from '../Visualisation';
import File from '../File';
import FileLabel from '../FileLabel';
import FileModel from '../../models/File';

const ACTION_ADD_FIRST_FILE = Symbol('ADD_FIRST_FILE');
const ACTION_COPY_LAST_FILE = Symbol('COPY_LAST_FILE');
const ACTION_LOOP = Symbol('LOOP');
const ACTION_NONE = Symbol('NONE');

@observer
class ChapterOne extends Component {
  @observable files = [];
  @observable newVersion = false;
  @observable action = ACTION_ADD_FIRST_FILE;
  @observable versions = 0;

  componentDidMount() {
    this.timeline = new TimelineLite({
      paused: true,
      onComplete() {
        this.restart();
      }
    });

    this.timeline.add(this.copyLastFile, '+=1');
  }

  componentWillUnmount() {
    this.timeline.kill();
  }

  @action.bound addFirstFile() {
    const file = new FileModel('bio.md');
    file.column = 0;
    file.appear = true;

    this.files.push(file);
  }

  @action.bound copyLastFile() {
    this.files.forEach((file) => {
      file.column++;
    });

    const file = this.files[0].copy();
    file.column = 0;
    file.appear = false;
    file.name = `bio_final${++this.versions > 1 ? `_v${this.versions}` : ''}.md`;

    this.files.unshift(file);
    this.files.splice(6);
  }

  @action.bound handleClickNext() {
    if (this.action === ACTION_ADD_FIRST_FILE) {
      this.addFirstFile();
      this.action = ACTION_COPY_LAST_FILE;

      return;
    }

    if (this.action === ACTION_COPY_LAST_FILE) {
      this.copyLastFile();
      this.action = ACTION_LOOP;

      return;
    }

    if (this.action === ACTION_LOOP) {
      this.timeline.seek(1);
      this.timeline.play();
      this.action = ACTION_NONE;
    }
  }

  render() {
    const files = this.files.map(file => (
      <File column={file.column} appear={file.appear} key={file.id}>
        <FileLabel label={file.name} />
      </File>
    ));

    return (
      <div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1>Versionierung</h1>
          <p>Erklärung, wie Versionierung funktioniert.</p>
          <button onClick={this.handleClickNext}>Wir erstellen eine Datei</button>
        </div>
        <Visualisation>
          {files}
        </Visualisation>
      </div>
    );
  }
}

export default ChapterOne;
