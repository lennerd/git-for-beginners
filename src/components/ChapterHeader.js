import React from 'react';
import styled from 'styled-components';

import ChapterProgress from './ChapterProgress';
import { ChapterTitle } from './Chapter';

function ChapterHeader({ className, tutorial, chapter }) {
  return (
    <div className={className}>
      <ChapterProgress tutorial={tutorial} />
      <ChapterTitle>{chapter.id}</ChapterTitle>
    </div>
  );
}

export default styled(ChapterHeader)`
  position: relative;
`;
