import styled, { css } from 'styled-components';

import Link from './Link';

export const NavigationProgressBar = styled.div`
  transition: height 400ms;
  position: absolute;
  z-index: 0;
  width: ${props => props.theme.spacing(0.75)};
  min-height: ${props => props.theme.spacing(0.75)};
  max-height: 100%;
  height: calc(
    ${props => props.progress * 100}% + ${props => props.theme.spacing(0.375)}
  );
  left: 50%;
  margin-left: ${props => props.theme.spacing(-0.375)};
  border-radius: ${props => props.theme.spacing(0.375)};
  background-color: ${props => props.theme.color.highlight};
  opacity: 0.1;
`;

export const NavigationList = styled.ul`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

export const NavigationItem = styled.li`
  position: relative;
  width: ${props => props.theme.spacing(0.75)};
  height: ${props => props.theme.spacing(0.75)};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const completedIndicator = css`
  border-radius: 0;
  transform: rotate(-45deg);
  background-color: ${props => props.theme.color.highlight};
`;

export const NavigationIndicator = styled.div`
  transition: border-radius 400ms, transform 400ms, background-color 400ms;
  width: 5px;
  height: 5px;
  border-radius: 2px;
  transform: rotate(0);
  background-color: ${props => props.theme.color.interactive};

  ${props => props.completed && completedIndicator};
`;

export const NavigationLabel = styled.div`
  will-change: opacity, transform;
  transition: opacity 400ms, transform 400ms;
  position: absolute;
  transform: translateX(${props => props.theme.spacing(1)});
  opacity: 0;
  top: ${props => props.theme.spacing(-0.25)};
  left: ${props => props.theme.spacing(0.75)};
  padding-left: ${props => props.theme.spacing(2)};
  line-height: ${props => props.theme.baseSpacing / props.theme.baseFontSize};
  color: ${props => props.theme.color.highlight};
  white-space: nowrap;
  pointer-events: none;
`;

export const NavigationLink = Link.extend`
  display: block;
  padding: ${props => props.theme.spacing()};
  cursor: pointer;

  &:hover {
    ${NavigationLabel} {
      transform: translateX(${props => props.theme.spacing(-1)});
      opacity: 1;
    }

    ${NavigationIndicator} {
      ${completedIndicator};
    }
  }

  &.active {
    ${NavigationLabel} {
      color: ${props => props.theme.color.interactive};
    }

    ${NavigationIndicator} {
      background-color: ${props => props.theme.color.interactive};
    }
  }
`;

const Navigation = styled.nav`
  position: relative;
  z-index: 2;
  justify-self: center;
  align-self: stretch;
  grid-area: navigation;
  margin: ${props => props.theme.spacing(-0.375)} 0;
`;

export default Navigation;
