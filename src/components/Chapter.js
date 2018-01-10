import styled from 'styled-components';

import Title from './Title';

function inlineSVG(svg) {
  return `url(data:image/svg+xml;base64,${btoa(svg)})`;
}

const Chapter = styled.div``;

export const ChapterHeader = styled.div`
  position: relative;
`;

export const ChapterProgress = styled.div`
  position: absolute;
  bottom: 50%;
  left: 0;
  transform: translateX(-50%) rotate(-90deg) translateY(${props => props.theme.spacing(-1)});
  transform-origin: 50% 100%;
`;

export const ChapterTitle = styled.div`
  font-size: ${props => props.theme.spacing(1.8)};
  color: ${props => props.theme.color.highlight};
  line-height: ${props => props.theme.spacing(2.25)};
`;

export const ChapterBody = styled.div`
  ${ChapterHeader} + & {
    margin-top: ${props => props.theme.spacing()};
  }
`;

export const ChapterText = styled.p`
  position: relative;

  & + & {
    margin-top: ${props => props.theme.spacing(0.75)};
  }
`;

export const ChapterTextNext = Title.extend`
  display: block;
  transform: translateX(-50%) rotate(-90deg) translateY(${props => props.theme.spacing(-1)});
  transform-origin: 50% 100%;
  position: absolute;
  bottom: ${props => props.theme.spacing()};
  left: 0;
  background-image: ${inlineSVG('<svg width="10" height="20" xmlns="http://www.w3.org/2000/svg"><path d="m9,1l-8,8l8,8" stroke-width="1" stroke="#F25944" fill="none" /></svg>')};
  background-repeat: no-repeat;
  background-position: 0 100%;
  padding-left: ${props => props.theme.spacing()};
  color: ${props => props.theme.color.interactive};
  cursor: pointer;
`;

export default Chapter;
