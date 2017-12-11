import React from 'react';
import styled, { keyframes } from 'styled-components';

const spinning = keyframes`
  0% { border-radius: 5px; transform: rotateZ(-45deg); }
  33% { border-radius: 0px; transform: scale(1.2) rotateZ(-45deg); }
  66% { border-radius: 0px; transform: scale(1.2) rotateZ(-135deg); }
  100% { border-radius: 5px; transform: rotateZ(-135deg); }
`;

function LoadingSpinner({ className, pastDelay, ...props }) {
  if (!pastDelay) {
    return null;
  }

  return (
    <div className={className}>
      Loading
    </div>
  );
}

export default styled(LoadingSpinner)`
  ${props => props.theme.text.caps}
  position: absolute;
  pointer-events: none;
  top: ${props => props.theme.spacing(2)};
  right: ${props => props.theme.spacing(2)};
  color: ${props => props.theme.color.highlight};
  opacity: 0.5;

  &:before {
    content: '';
    display: inline-block;
    width: ${props => props.theme.spacing(0.5)};
    height: ${props => props.theme.spacing(0.5)};
    will-change: transformation, border-radius;
    animation-name: ${spinning};
    animation-duration: 2s;
    animation-iteration-count: infinite;
    background-color: ${props => props.theme.color.highlight};
    margin-right: ${props => props.theme.spacing(0.75)};
  }
`;
