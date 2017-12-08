import React from 'react';
import styled, { keyframes } from 'styled-components';

const spinning = (props) => keyframes`
  0% { border-radius: 0px; transform: rotateZ(-45deg); }
  33% { border-radius: 0px; transform: rotateZ(-135deg); }
  66% { border-radius: ${props.theme.spacing.n(0.5)}; transform: rotateZ(-135deg); }
  100% { border-radius: 0px; transform: rotateZ(-135deg); }
`;

function LoadingSpinner({ className, pastDelay }) {
  if (pastDelay) {
    return null;
  }

  return (
    <div className={className} />
  );
}

export default styled(LoadingSpinner)`
  will-change: transformation, border-radius;
  animation-name: ${spinning};
  animation-duration: 2s;
  animation-iteration-count: infinite;
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${props => props.theme.spacing};
  height: ${props => props.theme.spacing};
  background-color: ${props => props.theme.color.highlight};
  pointer-events: none;
`;
