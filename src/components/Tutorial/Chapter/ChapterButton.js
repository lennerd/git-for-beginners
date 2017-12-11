import styled from 'styled-components';

function inlineSVG(svg) {
  return `url(data:image/svg+xml;base64,${btoa(svg)})`;
}

const ChapterButton = styled.button`
  transition: 200ms background-color;
  position: relative;
  appearance: none;
  border: 0;
  color: ${props => props.theme.color.highlight};
  height: ${props => props.theme.spacing(2)};
  line-height: ${props => props.theme.spacing(2)};
  margin-left: ${props => props.theme.spacing(-0.75)};
  padding: 0;
  padding-left: ${props => props.theme.spacing(0.75)};
  padding-right: ${props => props.theme.spacing(2)};
  background-color: ${props => props.theme.color.highlight.alpha(0)};
  margin-top: ${props => props.theme.spacing(3)};
  background-image: ${inlineSVG('<svg width="9" height="16" xmlns="http://www.w3.org/2000/svg"><path d="m1,1l7,7l-7,7" stroke-width="1.2" stroke="#1126B4" fill="none" /></svg>')};
  background-repeat: no-repeat;
  background-position: 100% 50%;

  &:hover {
    background-color: ${props => props.theme.color.highlight.alpha(0.05)};

    &:after {
      opacity: 1;
    }
  }

  &:after {
    transition: 200ms opacity;
    position: absolute;
    content: '';
    left: 100%;
    height: 0;
    border-top: 20px solid transparent;
    border-bottom: 20px solid transparent;
    border-left: 20px solid ${props => props.theme.color.highlight.alpha(0.05)};
    opacity: 0;
  }
`;

export default ChapterButton;
