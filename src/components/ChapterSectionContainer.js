import React, { Component } from 'react';
import { observer } from 'mobx-react';

import { SECTION_TEXT, SECTION_TASK } from '../constants';
import { ChapterText, ChapterReadOn, ChapterTask, ChapterCheckbox } from './Chapter';

@observer
class ChapterSectionContainer extends Component {
  render() {
    const { section, onClickReadOn } = this.props;

    switch (section.type) {
      case SECTION_TEXT:
        return (
          <ChapterText>
            {section.text}
            {
              !section.last && !section.completed &&
              <ChapterReadOn onClick={onClickReadOn}>Read On</ChapterReadOn>
            }
          </ChapterText>
        );

      case SECTION_TASK:
        return (
          <ChapterTask>
            <ChapterCheckbox checked={section.completed}>
              {section.text}
            </ChapterCheckbox>
          </ChapterTask>
        );

      default:
        return null;
    }
  }
}

export default ChapterSectionContainer;
