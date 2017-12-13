import { css } from 'styled-components';

class Color extends THREE.Color {
  toString() {
    return this.getStyle();
  }

  alpha(alpha) {
    return `rgba(${(this.r * 255) | 0}, ${(this.g * 255) | 0}, ${(this.b * 255) | 0}, ${alpha})`;
  }
}

function rem(size) {
  return css`${props => size / props.theme.baseFontSize}rem`;
}

function spacing(multiply = 1) {
  return css`${({ theme }) => theme.rem(theme.baseSpacing * multiply)}`;
}

export default {
  baseFontSize: 16,
  baseLineHeight: 1.5625,
  baseSpacing: 20,

  rem,
  spacing,

  vis: {
    cellWidth: 3,
    cellHeight: 3.5,
    levelHeight: 0.3,
  },

  color: {
    fileDefault: new Color('#FFFCFA'),
    fileAdded: new Color('#8ECF4F'),
    fileDeleted: new Color('#FF6147'),
    added: new Color('#348900'),
    deleted: new Color('#C40000'),
    highlight: new Color('#1126B4'),
    text: new Color('#333336'),
    grey: new Color('#999999'),
  },

  text: {
    small: css`
      font-size: ${props => props.theme.rem(14)};
      line-height: ${18 / 14};
    `,
    big: css`
      font-size: ${props => props.theme.rem(14)};
      line-height: ${45 / 36};
    `,
    caps: css`
      ${props => props.theme.text.small}
      font-variant-caps: all-small-caps;
      letter-spacing: 0.89px;
    `,
  }
};
