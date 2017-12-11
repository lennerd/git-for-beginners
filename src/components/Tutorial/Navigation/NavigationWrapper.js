import styled from 'styled-components';

import NavigationItem from './NavigationItem';

const NavigationWrapper = styled.div`
  position: relative;
  height: ${props => props.theme.spacing(2.75)};
  display: flex;
  justify-content: stretch;
  align-items: stretch;

  &:after,
  &:before {
    content: '';
    position: absolute;
    top: 0;
    height: 100%;
    background-color: white;
  }

  &:after {
    left: 99%;
    right: calc((100vw - 100%) / -2);
  }

  &:before {
    right: 99%;
    left: calc((100vw - 100%) / -2);
  }

  ${NavigationItem} {
    width: 100%;
  }
`;

export default NavigationWrapper;
