import React from 'react';
import styled from 'styled-components';

import arrowDownSmall from '../images/arrowDownSmall.svg';
import Button from './Button';
import Checkbox from './Checkbox';

const Chapter = styled.div`
  display: grid;
  grid-area: chapter;
  grid-template-columns: 2fr 4fr 2fr 4fr 2fr;
  grid-template-rows:
    1fr
    ${props => props.theme.spacing(1)}
    ${props => props.theme.spacing(1)}
    ${props => props.theme.spacing(3.75)};
  grid-template-areas:
    ". main . console ."
    ". next . console ."
    ". next . . .";
`;

export const ChapterMain = styled.div`
  grid-area: main;
  justify-self: stretch;
  align-self: center;
  position: relative;
  z-index: 1;
`;

export const ChapterTitle = styled.div`
  font-size: ${props => props.theme.spacing(1.8)};
  color: ${props => props.theme.color.highlight};
  line-height: ${props => props.theme.spacing(2.25)};
`;

export const ChapterText = styled.p``;

export const ChapterReadOn = Button.extend`
  transform:  rotate(-90deg) translateY(${props => props.theme.spacing(-1)}) translateX(${props => props.theme.spacing(-1.5)});
  transform-origin: 0 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  //background-image: url(${arrowDownSmall});
  //background-position: 0 70%;
  //padding-left: ${props => props.theme.spacing()};

  &:before {
    content: '←';
    margin-right: ${props => props.theme.spacing(0.5)};
  }
`;

export const ChapterTask = styled.div``;

export const ChapterCheckbox = Checkbox.extend`
  display: block;
  color: ${props => props.checked ? 'inherit' : props.theme.color.highlight};
`;

export default Chapter;
