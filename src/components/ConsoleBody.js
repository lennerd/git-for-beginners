import styled, { css } from 'styled-components';
import React, { Component } from 'react';

class ConsoleBody extends Component {
  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    if (this.consoleBody == null) {
      return;
    }

    this.consoleBody.scrollTop = this.consoleBody.scrollHeight;
  }

  render() {
    const props = { ...this.props };

    delete props.limit;
    delete props.back;

    return (
      <div
        {...props}
        ref={ref => {
          this.consoleBody = ref;
        }}
      />
    );
  }
}

const limit = css`
  max-height: ${props => props.theme.spacing(8)};
`;

export default styled(ConsoleBody)`
  ${props => props.limit && limit} transition: opacity 600ms;
  display: flex;
  flex-direction: column;
  overflow: auto;
  overflow-x: hidden;
  opacity: ${props => (props.back ? 0.5 : 1)};
  background-color: white;

  &:first-child {
    border-top-left-radius: ${props => props.theme.borderRadius.large};
    border-top-right-radius: ${props => props.theme.borderRadius.large};
  }

  &:last-child {
    border-bottom-left-radius: ${props => props.theme.borderRadius.large};
    border-bottom-right-radius: ${props => props.theme.borderRadius.large};
  }

  &:hover {
    opacity: 1;
  }

  & > * + * {
    border-top: 1px solid ${props => props.theme.color.highlight.alpha(0.1)};
  }
`;
