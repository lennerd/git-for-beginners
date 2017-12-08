import React, { Component } from 'react';
import styled from 'styled-components';

class Container extends Component {
  render() {
    const { children, className } = this.props;

    return (
      <div className={className}>
        {children}
      </div>
    );
  }
}

export default styled(Container)`
  width: 900px;
  height: 100%;
  margin: 0 auto;
`;
