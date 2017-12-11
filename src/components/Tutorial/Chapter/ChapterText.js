import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { inject } from 'mobx-react';

import Container from '../../common/Container';

const ChapterTextWrapper = styled.div`
  width: ${props => props.half ? 40 : 100}%;
  padding-top: 25vh;
  position: relative;
  z-index: 1;

  * + * {
    margin-top: ${props => props.theme.spacing(0.75)};
  }
`;

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

@inject('tutorial', 'chapter')
class ChapterText extends PureComponent {
  render() {
    const { children, chapter, tutorial, half } = this.props;
    const chapterNumber = tutorial.chapters.indexOf(chapter) + 1;

    return (
      <Container>
        <ChapterTextWrapper half={half}>
          <ChapterIndicator>Chapter {chapterNumber} of {tutorial.chapters.length}</ChapterIndicator>
          <ChapterHeadline>{chapter.title}</ChapterHeadline>
          {children}
        </ChapterTextWrapper>
      </Container>
    );
  }
}

export default ChapterText;
