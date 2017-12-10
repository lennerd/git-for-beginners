import React, { Component } from 'react';
import styled from 'styled-components';

const ChapterIndicator = styled.div`
  position: relative;
  ${props => props.theme.text.caps}
  color: ${props => props.theme.color.grey};

  &:before {
    content: '';
    display: block;
    position: absolute;
    top: 0.62em;
    left: ${props => props.theme.spacing(-0.75)};
    width: ${props => props.theme.spacing(0.15)};
    height: ${props => props.theme.spacing(0.15)};
    transform: scale(1.2) rotateZ(-45deg);
    background-color: ${props => props.theme.color.grey};
  }
`;

const ChapterHeadline = styled.h1`
  font-weight: 400;
  font-size: ${props => props.theme.text.big};
  color: ${props => props.theme.color.highlight};
  line-height: ${props => props.theme.text.lineHeightBig};
  margin-bottom: ${props => props.theme.spacing(1)};
`;

class ChapterText extends Component {
  render() {
    const { children, chapter, className } = this.props;

    return (
      <div className={className}>
        <ChapterIndicator>Chapter {chapter.id}  of {chapter.tutorial.chapters.length}</ChapterIndicator>
        <ChapterHeadline>{chapter.title}</ChapterHeadline>
        {children}
      </div>
    );
  }
}

export default styled(ChapterText)`
  margin-bottom: ${props => props.theme.spacing(6)};
  width: ${props => props.half ? 40 : 100}%;
  margin-top: 25vh;

  * + * {
    margin-top: ${props => props.theme.spacing(0.75)};
  }
`;
