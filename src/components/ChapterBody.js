import React, { Component } from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { action, computed } from 'mobx';
import takeWhile from 'lodash/takeWhile';

import ChapterHeader from './ChapterHeader';
import { ChapterText, ChapterReadOn, ChapterCheckbox } from './Chapter';
import { SECTION_TEXT, SECTION_TASK } from '../constants';

@observer
class ChapterBody extends Component {
  @computed get amountOfVisibleTextSections() {
    const { chapter } = this.props;

    return chapter.state.get('visibleTextSections') || 1;
  }

  set amountOfVisibleTextSections(amount) {
    const { chapter } = this.props;

    chapter.state.set('visibleTextSections', amount);
  }

  @computed get visibleSections() {
    const { sections, chapter } = this.props;
    let amountOfVisibleTextSections = this.amountOfVisibleTextSections;
    let prevTaskSectionDone = true;

    return takeWhile(sections, (section) => {
      if (section.is(SECTION_TEXT)) {
        if (section.skip) {
          return true;
        }

        if (amountOfVisibleTextSections === 0) {
          return false;
        }

        amountOfVisibleTextSections--;
        prevTaskSectionDone = false;

        return true;
      }

      if (section.is(SECTION_TASK)) {
        if (!prevTaskSectionDone) {
          return false;
        }

        prevTaskSectionDone = section.optional || section.done(chapter.state);

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

    this.amountOfVisibleTextSections++;

    if (this.amountOfVisibleTextSections === sections.length) {
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
        return (
          <ChapterCheckbox
            key={index}
            checked={section.done(chapter.state)}
          >
            {section.text}{section.optional ? ' (optional)' : ''}
          </ChapterCheckbox>
        )
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
