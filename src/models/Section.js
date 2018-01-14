import { SECTION_TEXT, SECTION_TASK } from "../constants";

class Section {
  is(type) {
    return this.type === type;
  }
}

export class Text extends Section {
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

export class Task extends Section {
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

export default Section;
