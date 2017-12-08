import React, { Component } from 'react';
import styled from 'styled-components';

import Container from './Container';
import NavigationItem from './NavigationItem';

const NavigationContent = styled.div`
  position: relative;
  height: ${props => props.theme.spacing.n(2.75)};
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

class Navigation extends Component {
  render() {
    const { className } = this.props;

    return (
      <div className={className}>
        <Container>
          <NavigationContent>
            <NavigationItem to="/chapter/0">Versioning of Files</NavigationItem>
            <NavigationItem to="/chapter/1">Versioning of Files</NavigationItem>
            <NavigationItem to="/chapter/2">Versioning of Files</NavigationItem>
          </NavigationContent>
        </Container>
      </div>
    );
  }
}

export default styled(Navigation)`

`;
