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
  return css`${(props) => props.theme.rem(props.theme.baseSpacing * multiply)}`;
}

export const CELL_WIDTH = 3;
export const CELL_HEIGHT = 3.5;
export const LEVEL_HEIGHT = 0.3;

export default {
  baseFontSize: 16,
  baseLineHeight: 1.5625,
  baseSpacing: 20,

  rem,
  spacing,

  largeSpacing: (multiply = 1) => css`${props => props.theme.spacing(4.75 * multiply)}`,

  color: {
    fileDefault: new Color('#FFFCFA'),
    fileAdded: new Color('#8ECF4F'),
    fileDeleted: new Color('#FF6147'),
    text: new Color('#333336'),
    interactive: new Color('#F25944'),
    highlight: new Color('#1126B4'),
    added: new Color('#348900'),
    deleted: new Color('#C40000'),
  },

  borderRadius: {
    normal: css`${props => props.theme.spacing(0.15)}`,
    large: css`${props => props.theme.spacing(0.25)}`,
  },

  text: {
    sizeMono: css`${props => props.theme.spacing(0.75)}`,
  },

  mixins: {
    monospaced: css`
      font-family: 'Source Code Pro', monospaced;
      font-size: ${props => props.theme.text.sizeMono};
    `,
  }
};
