import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { inject } from 'mobx-react';

import Container from '../../common/Container';
import ContentTransition from '../../common/ContentTransition';

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

  ${ChapterIndicator} + & {
    margin-top: ${props => props.theme.spacing(0.75)};
  }
`;

const ChapterTextWrapper = styled.div`
  width: ${props => props.half ? 40 : 60}%;
  transform: ${props => props.half ? null : 'translateX(-50%)'};
  left: ${props => props.half ? null : '50%'};
  padding-top: 25vh;
  position: absolute;
  z-index: 1;

  ${ChapterHeadline} + p {
    margin-top: ${props => props.theme.spacing(1)};
  }

  p + p {
    margin-top: ${props => props.theme.spacing(0.75)};
  }
`;

@inject('tutorial', 'chapter')
class ChapterText extends PureComponent {
  render() {
    const { children, chapter, tutorial, half, ...props } = this.props;

    return (
      <Container>
        <ContentTransition {...props}>
          <ChapterTextWrapper half={half}>
            <ChapterIndicator>Chapter {chapter.index} of {tutorial.chapters.length - 1}</ChapterIndicator>
            <ChapterHeadline>{chapter.title}</ChapterHeadline>
            {children}
          </ChapterTextWrapper>
        </ContentTransition>
      </Container>
    );
  }
}

export default ChapterText;
