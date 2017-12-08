import React, { Component } from 'react';
import styled from 'styled-components';

import Container from '../Container';

class ChapterText extends Component {
  render() {
    const { children, className } = this.props;

    return (
      <div className={className}>
        <Container>
          {children}
        </Container>
      </div>
    );
  }
}

export default styled(ChapterText)``;
