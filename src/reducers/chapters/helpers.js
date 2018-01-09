import React from 'react';

import { SECTION_TEXT } from './sectionTypes';
import Text from '../../components/tasks/Text';

export function createText(content) {
  return {
    type: SECTION_TEXT,
    content: (
      <Text>
        {content}
      </Text>
    ),
  };
}
