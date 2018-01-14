import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { action, computed } from 'mobx';
import takeWhile from 'lodash/takeWhile';

import ChapterHeader from './ChapterHeader';
import { ChapterText, ChapterReadOn, ChapterCheckbox } from './Chapter';
import { SECTION_TEXT, SECTION_TASK } from '../constants';
import ChapterTip from './ChapterTip';

@observer
class ChapterBody extends Component {
  @computed get visibleSections() {
    const { sections, chapter } = this.props;
    let amountOfVisibleTextSections = chapter.visibleTextSections;
    let prevTaskSectionDone = true;

    return takeWhile(sections, (section) => {
      if (section.is(SECTION_TEXT)) {
        if (!prevTaskSectionDone) {
          return false;
        }

        if (section.skip) {
          return true;
        }

        if (amountOfVisibleTextSections === 0) {
          return false;
        }

        amountOfVisibleTextSections--;

        return true;
      }

      if (section.is(SECTION_TASK)) {
        if (!prevTaskSectionDone) {
          return false;
        }

        prevTaskSectionDone = section.optional || section.done(chapter);

        return true;
      }

      throw new Error('Unknown section type.');
    });
  }

  @computed get lastVisibleSection() {
    return this.visibleSections[this.visibleSections.length - 1];
  }

  @action.bound readOn() {
    const { chapter, sections } = this.props;
    const progress = this.visibleSections.length / sections.length;

    chapter.visibleTextSections++;

    if (chapter.visibleTextSections === sections.length) {
      chapter.completed = true;
    }

    chapter.progress = progress;
  }

  renderVisibleSections() {
    const { chapter } = this.props;

    return this.visibleSections.map((section, index) => {
      if (section.is(SECTION_TEXT)) {
        return (
          <ChapterText key={index}>
            {section.text}
          </ChapterText>
        );
      }

      if (section.is(SECTION_TASK)) {
        const done = section.done(chapter);

        return (
          <Fragment key={index}>
            <ChapterCheckbox checked={done}>
              {section.text}{section.optional ? ' (optional)' : ''}
            </ChapterCheckbox>
            {!done && section.tip != null && <ChapterTip>{section.tip}</ChapterTip>}
          </Fragment>
        );
      }

      throw new Error('Unknown section type.');
    });
  }

  renderReadOn() {
    const { chapter } = this.props;

    if (this.lastVisibleSection == null || !this.lastVisibleSection.is(SECTION_TEXT) || chapter.completed) {
      return null;
    }

    return <ChapterReadOn onClick={this.readOn}>Read On</ChapterReadOn>;
  }

  render() {
    const { className } = this.props;

    return (
      <div className={className}>
        {this.renderVisibleSections()}
        {this.renderReadOn()}
      </div>
    );
  }
}

export default styled(ChapterBody)`
  position: relative;

  ${ChapterHeader} + & {
    margin-top: ${props => props.theme.spacing()};
  }

  & > * + * {
    margin-top: ${props => props.theme.spacing(0.75)};
  }

  strong {
    font-weight: 600;
  }

  code {
    ${props => props.theme.mixins.monospaced};
    white-space: nowrap;
    background-color: white;
    padding: ${props => props.theme.spacing(0.1)} ${props => props.theme.spacing(0.3)};
    margin: 0 ${props => props.theme.spacing(-0.25)};
    border-radius: ${props => props.theme.borderRadius.large};
  }
`;
