import React, { PureComponent } from 'react';
import styled from 'styled-components';

import Title from './Title';

import githubLogo from './assets/github-logo.svg';
import pdfFile from './assets/pdf-file.svg';

const TutorialInfoLabel = styled.span`
  will-change: opacity, transform;
  transition: opacity 400ms, transform 400ms;
  position: absolute;
  opacity: 0;
  right: 100%;
  white-space: nowrap;
  text-align: right;
  line-height: ${props => props.theme.baseSpacing / props.theme.baseFontSize};
  padding-right: ${props => props.theme.spacing()};
  transform: translateX(${props => props.theme.spacing(-1)});
  pointer-events: none;
`;

const TutorialInfoItem = styled.a`
  will-change: opacity;
  transition: opacity 400ms;
  display: block;
  text-decoration: none;
  color: ${props => props.theme.color.highlight};
  position: relative;
  opacity: 0.5;

  & > img {
    margin-right: ${props => props.theme.spacing(0.5)};
    vertical-align: middle;
    width: 15px;
  }

  & > .incom {
    width: auto;
  }

  &:hover {
    opacity: 1;

    ${TutorialInfoLabel} {
      transform: translateX(${props => props.theme.spacing(0)});
      opacity: 1;
    }
  }
`;

class TutorialInfo extends PureComponent {
  render() {
    const { className } = this.props;

    return (
      <div className={className}>
        <TutorialInfoItem href="https://fhp.incom.org/action/open-file/269690">
          <img src={pdfFile} alt="Acrobat Reader, PDF" />
          <TutorialInfoLabel>
            Bachelor thesis<br />
            <Title minor>PDF, german</Title>
          </TutorialInfoLabel>
        </TutorialInfoItem>
        <TutorialInfoItem href="https://github.com/lennerd/git-for-beginners">
          <img src={githubLogo} alt="Github" />
          <TutorialInfoLabel>
            Source code<br />
            <Title minor>GitHub</Title>
          </TutorialInfoLabel>
        </TutorialInfoItem>
      </div>
    );
  }
}

export default styled(TutorialInfo)`
  grid-area: info;
  justify-self: center;
  display: flex;
  flex-direction: column;
  align-items: center;

  & > * + * {
    margin-top: ${props => props.theme.spacing(1)};
  }
`;
