import React from 'react';
import styled from 'styled-components';

import { ChapterCheckbox } from './Chapter';

function ChapterTip({ className, children }) {
  return (
    <div className={className}>
      <em>Tip:</em> <span>{children}</span>
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
    width: ${props => props.theme.spacing(2)};
    left: ${props => props.theme.spacing(-1)};
    top: 0;
    height: 1px;
    background-color: ${props => props.theme.color.highlight.alpha(0.5)};
  }

  em {
    font-style: normal;
    width: ${props => props.theme.spacing(1.75)};
    color: ${props => props.theme.color.highlight};
    flex-shrink: 0;
  }

  ${ChapterCheckbox} + & {
    margin-top: ${props => props.theme.spacing(0.75)};
  }
`;
