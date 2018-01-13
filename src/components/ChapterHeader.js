import React from 'react';
import styled from 'styled-components';

import ChapterProgress from './ChapterProgress';
import { ChapterTitle } from './Chapter';

function ChapterHeader({ className, index, tutorial, chapter }) {
  return (
    <div className={className}>
      <ChapterProgress index={index} tutorial={tutorial} />
      <ChapterTitle>{chapter.title}</ChapterTitle>
    </div>
  )
}

export default styled(ChapterHeader)`
  position: relative;
`;
