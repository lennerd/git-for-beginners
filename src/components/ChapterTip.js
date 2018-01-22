import React from 'react';
import styled from 'styled-components';

import { ChapterCheckbox } from './Chapter';

function ChapterTip({ className, children }) {
  return (
    <div className={className}>
      <strong>Tip</strong> <span>{children}</span>
    </div>
  )
}

export default styled(ChapterTip)`
  padding-top: ${props => props.theme.spacing(0.5)};
  position: relative;
  display: flex;
  align-items: baseline;

  &:before {
    content: '';
    position: absolute;
    width: ${props => props.theme.spacing(1.75)};
    left: 0;
    top: 0;
    height: 2px;
    background-color: ${props => props.theme.color.highlight.alpha(0.3)};
  }

  & > strong {
    width: ${props => props.theme.spacing(1.75)};
    color: ${props => props.theme.color.highlight};
    flex-shrink: 0;
  }

  ${ChapterCheckbox} + & {
    margin-top: ${props => props.theme.spacing(0.75)};
  }

  & + * {
    padding-top: ${props => props.theme.spacing(2)};
  }
`;
