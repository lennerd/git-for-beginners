import React from 'react';
import styled from 'styled-components';

import checkmark from '../images/checkmark.svg';

const Checkmark = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: ${props => props.theme.spacing()};
  height: ${props => props.theme.spacing()};

  &:before,
  &:after {
    content: '';
    position: absolute;
    left: 0;
    top: 2px;
    width: 100%;
    height: 100%;
  }

  &:before {
    border-radius: ${props => props.theme.border.radius};
  }

  &:after {
    background-image: url(${checkmark});
    background-position: 50% 50%;
    background-repeat: no-repeat;
  }
`;

function Checkbox({ className, children, ...props }) {
  return (
    <label className={className}>
      {children}
      <input type="checkbox" {...props} />
      <Checkmark />
    </label>
  );
}

Checkbox.defaultProps = { checked: false, onChange: () => {} };

export default styled(Checkbox)`
  padding-left: ${props => props.theme.spacing(1.75)};
  //line-height: ${props => props.theme.spacing()};
  display: inline-block;
  position: relative;

  & > input {
    position: absolute;
    left: 0;
    top: 2px;
    opacity: 0;
    width: ${props => props.theme.spacing()};
    height: ${props => props.theme.spacing()};
  }

  & > input ~ ${Checkmark} {
    &:before {
      background-color: ${props => props.theme.color.highlight.alpha(0.1)};
    }

    &:after {
      opacity: 0;
    }
  }

  & > input:checked ~ ${Checkmark} {
    &:before {
      background-color: ${props => props.theme.color.text.alpha(0.1)};
    }

    &:after {
      opacity: 1;
    }
  }
`;
