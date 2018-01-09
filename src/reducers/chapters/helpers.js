import { SECTION_TEXT } from './sectionTypes';

export function createText(content) {
  return {
    type: SECTION_TEXT,
    content,
  };
}
