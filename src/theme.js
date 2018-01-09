import { css } from 'styled-components';

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
    text: '#333336',
    interactive: '#F25944',
    highlight: '#1126B4',
  },
};
