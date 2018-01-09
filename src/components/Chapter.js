import styled from 'styled-components';

const Chapter = styled.div``;

export default Chapter;

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
`;
