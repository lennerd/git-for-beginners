import React, { PureComponent } from 'react';
import styled from 'styled-components';

import ContentTransition from '../../common/ContentTransition';

class ChapterWrapper extends PureComponent {
  render() {
    const { children, className, ...props } = this.props;

    return (
      <ContentTransition {...props}>
        <div className={className}>
          {children}
        </div>
      </ContentTransition>
    );
  }
}

export default styled(ChapterWrapper)`
  will-change: transform, opacity;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;
