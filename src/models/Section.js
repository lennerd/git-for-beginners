import { SECTION_TEXT, SECTION_TASK } from "../constants";

class Section {
  is(type) {
    return this.type === type;
  }
}

export class TextSection extends Section {
  type = SECTION_TEXT;

  constructor(text, skip) {
    super();

    this.text = text;
    this.skip = skip;
  }
}

export class TaskSection extends Section {
  type = SECTION_TASK;

  constructor(text, done, optional = false) {
    super();

    this.text = text;
    this.done = done;
    this.optional = optional;
  }
}

export default Section;
