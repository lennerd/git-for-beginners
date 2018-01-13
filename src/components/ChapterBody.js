import React, { Component } from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { action, computed } from 'mobx';

import ChapterHeader from './ChapterHeader';
import { ChapterText, ChapterReadOn } from './Chapter';

@observer
class ChapterBody extends Component {
  @computed get visibleSections() {
    const { chapter, sections } = this.props;
    const amountOfVisibleSections = chapter.state.get('visibleSections') || 1;

    return sections.slice(0, amountOfVisibleSections);
  }

  @action.bound readOn() {
    const { chapter, sections } = this.props;
    const amountOfVisibleSections = this.visibleSections.length + 1;

    if (amountOfVisibleSections === sections.length) {
      chapter.completed = true;
    }

    chapter.progress = this.visibleSections.length / sections.length;
    chapter.state.set('visibleSections', amountOfVisibleSections);
  }

  render() {
    const { className, chapter } = this.props;

    return (
      <div className={className}>
        {this.visibleSections.map(section => (
          <ChapterText>
            {section}
          </ChapterText>
        ))}
        {
          !chapter.completed &&
          <ChapterReadOn onClick={this.readOn}>Read On</ChapterReadOn>
        }
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
    border-radius: ${props => props.theme.border.radiusLarge};
  }
`;
