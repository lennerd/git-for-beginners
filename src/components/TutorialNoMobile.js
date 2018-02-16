import React from 'react';
import styled from 'styled-components';

import Tutorial from './Tutorial';
import Header, { HeaderTitle } from './Header';
import Chapter, { ChapterMain, ChapterTitle } from './Chapter';

import incomLogo from './assets/incom-logo.svg';
import githubLogo from './assets/github-logo.svg';
import pdfFile from './assets/pdf-file.svg';

const TutorialMobileContainer = styled.div`
  height: 100%;

  ${Header} {
    grid-column: span 3;
    padding: 0 ${props => props.theme.spacing(1.5)};
  }

  ${Chapter} {
    display: block;
    grid-column: span 3;
    padding: 0 ${props => props.theme.spacing(1.5)};
    align-self: center;
  }
`;

const ChapterBody = styled.div`
  ${ChapterMain} + & {
    margin-top: ${props => props.theme.spacing()};
  }

  & > * + * {
    margin-top: ${props => props.theme.spacing(0.75)};
  }
`;

const TutorialFurtherRead = styled.div`
  margin-top: ${props => props.theme.spacing(2)};

  & > * + * {
    margin-top: ${props => props.theme.spacing(0.75)};
  }

  a {
    text-decoration: none;
    color: ${props => props.theme.color.highlight};

    & > img {
      margin-right: ${props => props.theme.spacing(0.5)};
      vertical-align: middle;
      width: 16px;
    }

    & > .incom {
      width: auto;
    }
  }
`;

function TutorialNoMobile() {
  return (
    <TutorialMobileContainer>
      <Tutorial>
        <Header>
          <HeaderTitle>Git for Beginners</HeaderTitle>
        </Header>
        <Chapter>
          <ChapterMain>
            <ChapterTitle>I’m sorry …</ChapterTitle>
          </ChapterMain>
          <ChapterBody>
            <p>
              Thanks for your interest in learning Git with “Git for Beginners”.
              Unfortunately this prototype is only optimized for desktop
              devices.
            </p>
            <p>
              For more information about this project and the bachelor thesis
              this prototype is based on checkout the following links:
            </p>
            <TutorialFurtherRead>
              <p>
                <a href="https://fhp.incom.org/project/9212">
                  <img src={incomLogo} alt="Incom FHP" className="incom" />{' '}
                  Project documentation (german)
                </a>
              </p>
              <p>
                <a href="https://fhp.incom.org/action/open-file/269690">
                  <img src={pdfFile} alt="Acrobat Reader, PDF" /> Bachelor
                  thesis (PDF, german)
                </a>
              </p>
              <p>
                <a href="https://github.com/lennerd/git-for-beginners">
                  <img src={githubLogo} alt="Github" /> Source code
                </a>
              </p>
            </TutorialFurtherRead>
          </ChapterBody>
        </Chapter>
      </Tutorial>
    </TutorialMobileContainer>
  );
}

export default TutorialNoMobile;
