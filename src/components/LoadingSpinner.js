import React from 'react';
import styled, { keyframes } from 'styled-components';

const spinning = keyframes`
  0% { border-radius: 50%; transform: rotateZ(-45deg); }
  33% { border-radius: 0%; transform: scale(1.2) rotateZ(-45deg); }
  66% { border-radius: 0%; transform: scale(1.2) rotateZ(-135deg); }
  100% { border-radius: 50%; transform: rotateZ(-135deg); }
`;

function LoadingSpinner({ className, pastDelay, ...props }) {
  if (!pastDelay) {
    return null;
  }

  return <div className={className} />;
}

export default styled(LoadingSpinner)`
  grid-area: spinner;
  position: relative;
  justify-self: center;
  align-self: center;
  ${props => props.theme.text.caps} pointer-events: none;
  color: ${props => props.theme.color.highlight};
  opacity: 0.5;
  z-index: 2;

  &:before {
    content: '';
    display: block;
    width: ${props => props.theme.spacing(0.5)};
    height: ${props => props.theme.spacing(0.5)};
    will-change: transformation, border-radius;
    animation-name: ${spinning};
    animation-duration: 2s;
    animation-iteration-count: infinite;
    background-color: ${props => props.theme.color.highlight};
  }
`;
