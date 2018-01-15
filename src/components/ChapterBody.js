import React, { Component, Fragment, createElement } from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';

import ChapterHeader from './ChapterHeader';
import { ChapterText, ChapterReadOn, ChapterCheckbox } from './Chapter';
import { SECTION_TEXT, SECTION_TASK } from '../constants';
import ChapterTip from './ChapterTip';

@observer
class ChapterBody extends Component {
  renderSections() {
    const { sections } = this.props;

    return sections.map((section, index) => {
      if (section.is(SECTION_TEXT)) {
        return (
          <ChapterText key={index}>
            {createElement(section.text)}
          </ChapterText>
        );
      }

      if (section.is(SECTION_TASK)) {

        return (
          <Fragment key={index}>
            <ChapterCheckbox checked={section.done}>
            {createElement(section.text)}
            </ChapterCheckbox>
            {
              !section.done && section.tip != null &&
              <ChapterTip>{section.tip}</ChapterTip>
            }
          </Fragment>
        );
      }

      throw new Error('Unknown section type.');
    });
  }

  renderReadOn() {
    const { sections, chapter, onReadOn } = this.props;
    const lastSection = sections[sections.length - 1]

    if (
      lastSection == null ||
      !lastSection.is(SECTION_TEXT) ||
      chapter.completed
    ) {
      return null;
    }

    return <ChapterReadOn onClick={onReadOn}>Read On</ChapterReadOn>;
  }

  render() {
    const { className } = this.props;

    return (
      <div className={className}>
        {this.renderSections()}
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
