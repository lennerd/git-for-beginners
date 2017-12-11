import styled from 'styled-components';

const NavigationTimeline = styled.div`
  position: absolute;
  top: 50%;
  left: ${props => 100 / props.items / 2}%;
  right: ${props => 100 / props.items / 2}%;
  height: 1px;
  background-color: #F2F2F2;
  pointer-events: none;

  &:after {
    transition: 1s width;
    will-change: width;
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: ${props => 100 * props.progress}%;
    height: 100%;
    background-color: ${props => props.theme.color.highlight};
  }
`;

export default NavigationTimeline;
