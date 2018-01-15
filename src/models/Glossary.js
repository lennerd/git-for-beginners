export class GlossaryTerm {
  constructor(name, text) {
    this.name = name;
    this.text = text;
  }
}

class Glossary {
  constructor(terms) {
    this.terms = terms;
  }
}

export default Glossary;
