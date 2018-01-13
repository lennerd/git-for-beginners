/*import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import Console, {
  ConsoleSection,
  ConsoleInput,
  ConsoleCommand,
} from './Console';

@inject('tutorial')
@observer
class ChapterConsole extends Component {
  state = {
    history: [{ prompt: '' }],
    currentIndex: 0,
  };

  handleConsoleInputChange = (event) => {
    const { history } = this.state;
    const { value } = event.target;

    this.setState({
      history: [
        ...history.slice(0, -1),
        { prompt: value.substring(2) },
      ],
      currentIndex: history.length - 1,
    });
  }

  handleConsoleInputKeyDown = (event) => {
    const { history, currentIndex } = this.state;

    if(event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'Enter') {
      event.preventDefault();
    }

    if (event.key === 'ArrowUp') {
      const newIndex = currentIndex - 1;

      if (newIndex > -1) {
        this.setState({
          currentIndex: newIndex,
        });
      }

      return;
    }

    if (event.key === 'ArrowDown') {
      const newIndex = currentIndex + 1;

      if (newIndex < history.length) {
        this.setState({
          currentIndex: newIndex,
        });
      }

      return;
    }

    if (event.key === 'Enter') {
      const newHistory = [
        ...history.slice(0, -1),
        history[currentIndex],
        { prompt: '' },
      ];

      this.setState({
        history: newHistory,
        currentIndex: newHistory.length - 1,
      });

      return;
    }
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    this.console.scrollTop = this.console.scrollHeight;
  }

  render() {
    const { history, currentIndex } = this.state;
    const current = history[currentIndex];

    return (
      <Console innerRef={(ref) => { this.console = ref; }}>
        {history.slice(0, -1).map((command, index) => {
          return (
            <ConsoleSection key={index}>
              <ConsoleCommand>$ {command.prompt}</ConsoleCommand>
            </ConsoleSection>
          );
        })}
        <ConsoleSection>
          <ConsoleInput
            value={`$ ${current.prompt}`}
            onChange={this.handleConsoleInputChange}
            onKeyDown={this.handleConsoleInputKeyDown} />
        </ConsoleSection>
      </Console>
    );
  }
}

export default ChapterConsole;*/

import React, { Component } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';

import Console from './Console';

@observer
class ChapterConsole extends Component {
  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    this.console.scrollTop = this.console.scrollHeight;
  }

  render() {
    const { children, className } = this.props;

    return (
      <Console className={className} innerRef={(ref) => { this.console = ref; }}>
        {children}
      </Console>
    );
  }
}

export default styled(ChapterConsole)`
  justify-self: stretch;
  align-self: end;
  grid-area: console;
  position: relative;
  z-index: 1;
`;
