class Color extends THREE.Color {
  toString() {
    return this.getStyle();
  }
}

function rem(size) {
  return `${size / 16}rem`;
}

const SPACING = 20;

function spacing(multiply) {
  return rem(SPACING * multiply);
}

spacing.toString = () => {
  return rem(SPACING);
};

export default {
  spacing,

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
