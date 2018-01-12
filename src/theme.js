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

export default {
  baseFontSize: 16,
  baseLineHeight: 1.5625,
  baseSpacing: 20,

  rem,
  spacing,

  color: {
    text: new Color('#333336'),
    interactive: new Color('#F25944'),
    highlight: new Color('#1126B4'),
  },

  borderRadius: css`${props => props.theme.spacing(0.15)}`,
  borderRadiusBig: css`${props => props.theme.spacing(0.25)}`,
};
