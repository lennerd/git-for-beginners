import styled from 'styled-components';

import arrowDownSmall from '../images/arrowDownSmall.svg';
import arrowRightLarge from '../images/arrowRightLarge.svg';
import Button from './Button';
import Checkbox from './Checkbox';
import ChapterHeader from './ChapterHeader';

const Chapter = styled.div`
  display: grid;
  grid-area: chapter;
  grid-template-columns:
    2fr
    4fr
    1fr
    4fr
    1fr;
  grid-template-rows:
    1fr
    ${props => props.theme.spacing(1)}
    ${props => props.theme.spacing(1)}
    ${props => props.theme.spacing(3.75)};
  grid-template-areas:
    ". main . console ."
    ". main . next next"
    ". main . next next";
`;

export const ChapterMain = styled.div`
  grid-area: main;
  justify-self: stretch;
  align-self: center;
`;

export const ChapterNext = Button.extend`
  grid-area: next;
  justify-self: right;
  align-self: center;
  background-image: url(${arrowRightLarge});
  background-position: 100% 0;
  padding-right: ${props => props.theme.spacing(1.5)};
  height: ${props => props.theme.spacing(2)};
`;

export const ChapterTitle = styled.div`
  font-size: ${props => props.theme.spacing(1.8)};
  color: ${props => props.theme.color.highlight};
  line-height: ${props => props.theme.spacing(2.25)};
`;

export const ChapterBody = styled.div`
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

export const ChapterText = styled.p``;

export const ChapterReadOn = Button.extend`
  transform:  rotate(-90deg) translateY(${props => props.theme.spacing(-1)}) translateX(${props => props.theme.spacing(-1.5)});
  transform-origin: 0 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  background-image: url(${arrowDownSmall});
  background-position: 0 70%;
  padding-left: ${props => props.theme.spacing()};
`;

export const ChapterTask = styled.div``;

export const ChapterCheckbox = Checkbox.extend`
  color: ${props => props.checked ? 'inherit' : props.theme.color.highlight};
`;

export default Chapter;
