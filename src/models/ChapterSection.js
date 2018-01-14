import { SECTION_TEXT, SECTION_TASK } from "../constants";

class ChapterSection {
  is(type) {
    return this.type === type;
  }
}

export class ChapterText extends ChapterSection {
  type = SECTION_TEXT;
  skip = false;

  constructor(text, data) {
    super();

    Object.assign(this, {
      ...data,
      text,
    });
  }
}

export class ChapterTask extends ChapterSection {
  type = SECTION_TASK;
  optional = false;

  constructor(text, done, data) {
    super();

    Object.assign(this, {
      ...data,
      text,
      done,
    });
  }
}
