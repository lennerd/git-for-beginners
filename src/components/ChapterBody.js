import React, { Component, Fragment, createElement } from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { action, computed, autorun } from 'mobx';
import takeWhile from 'lodash/takeWhile';

import ChapterHeader from './ChapterHeader';
import { ChapterText, ChapterReadOn, ChapterCheckbox } from './Chapter';
import { SECTION_TEXT, SECTION_TASK } from '../constants';
import ChapterTip from './ChapterTip';

@observer
class ChapterBody extends Component {
  static defaultProps = {
    onReadOn: () => {},
  };

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

  @computed get doableSections() {
    const { sections } = this.props;

    return sections.filter((section) => {
      if (section.is(SECTION_TEXT)) {
        return !section.skip;
      }

      return true;
    });
  }

  @computed get doneSections() {
    const { chapter } = this.props;

    return this.visibleSections.filter((section) => {
      if (section.is(SECTION_TEXT)) {
        return !section.skip;
      }

      return section.optional || section.done(chapter);
    })
  }

  @computed get lastVisibleSection() {
    return this.visibleSections[this.visibleSections.length - 1];
  }

  componentWillMount() {
    const { chapter } = this.props;

    this.disposeProgressUpdate = autorun(() => {
      action((progress) => {
        chapter.progress = progress;

        if (progress === 1) {
          chapter.completed = true;
        }
      })(this.doneSections.length / this.doableSections.length)
    });
  }

  componentWillUnmount() {
    this.disposeProgressUpdate();
  }

  @action.bound readOn() {
    const { chapter, onReadOn } = this.props;

    chapter.visibleTextSections++;
    onReadOn();
  }

  renderVisibleSections() {
    const { chapter } = this.props;

    return this.visibleSections.map((section, index) => {
      if (section.is(SECTION_TEXT)) {
        return (
          <ChapterText key={index}>
            {createElement(section.text)}
          </ChapterText>
        );
      }

      if (section.is(SECTION_TASK)) {
        const done = section.done(chapter);

        return (
          <Fragment key={index}>
            <ChapterCheckbox checked={done}>
            {createElement(section.text)}
            </ChapterCheckbox>
            {!done && section.tip != null && <ChapterTip>{section.tip}</ChapterTip>}
          </Fragment>
        );
      }

      throw new Error('Unknown section type.');
    });
  }

  renderReadOn() {
    const { sections } = this.props;

    if (
      this.lastVisibleSection == null ||
      !this.lastVisibleSection.is(SECTION_TEXT) ||
      this.visibleSections.length === sections.length
    ) {
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
    font-weight: 400;
    color: ${props => props.theme.color.highlight};
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
