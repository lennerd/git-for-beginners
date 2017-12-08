class Color extends THREE.Color {
  toString() {
    return this.getStyle();
  }
}

function rem(size) {
  if (isNaN(size)) {
    debugger;
  }

  return `${size / 16}rem`;
}

const SPACING = 20;

class Spacing {
  constructor(multiply = 1) {
    this.multiply = multiply;
  }

  n(multiply) {
    return new Spacing(multiply);
  }

  toString() {
    return rem(this.multiply * SPACING);
  }
}

export default {
  spacing: new Spacing(),

  vis: {
    cellWidth: 3,
    cellHeight: 2.3,
    levelHeight: 0.3,
  },

  color: {
    fileDefault: new Color('#FFFCFA'),
    fileAdded: new Color('#8ECF4F'),
    fileDeleted: new Color('#FF6147'),
    highlight: new Color('#1126B4'),
    text: new Color('#333336'),
    grey: new Color('#999999'),
  },

  text: {
    small: rem(14),
  }
};
