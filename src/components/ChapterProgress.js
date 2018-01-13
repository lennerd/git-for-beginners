import React from 'react';
import styled from 'styled-components';

import Title from './Title';

function ChapterProgress({ className, index, tutorial }) {
  return (
    <div className={className}>
      <Title minor>{index + 1} / {tutorial.chapters.length}</Title>
    </div>
  )
}

export default styled(ChapterProgress)`
  position: absolute;
  bottom: 50%;
  left: 0;
  transform: translateX(-50%) rotate(-90deg) translateY(${props => props.theme.spacing(-1)});
  transform-origin: 50% 100%;
`;
