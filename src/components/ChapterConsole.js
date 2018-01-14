import React, { Component } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { computed, action, observable } from 'mobx';

import Console, { ConsoleSection, ConsoleMessage, ConsoleIcon, ConsoleCommand, ConsoleLabel, ConsoleCommandList, ConsoleLog, ConsoleTitle } from './Console';

@observer
class ChapterConsole extends Component {
  @observable history = [];

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    this.console.scrollTop = this.console.scrollHeight;
  }

  @computed get command() {
    const { commands, chapter } = this.props;

    return commands.find((command) => {
      if (!command.test(chapter)) {
        return false;
      }

      if (command.commands.length > 0) {
        return command.commands.some(command => command.test(chapter));
      }

      return true;
    });
  }

  @action runCommand(command, parentCommand = null) {
    const { chapter } = this.props;

    command.run(chapter);
    this.history.push({ command, parentCommand });
  }

  renderVisibleCommand() {
    const { chapter } = this.props;

    if (this.command == null) {
      return (
        <ConsoleSection>
          <ConsoleMessage>No file is selected.</ConsoleMessage>
        </ConsoleSection>
      );
    }

    if (this.command.commands.length === 0) {
      return (
        <ConsoleSection>
          <ConsoleCommand onClick={() => this.runCommand(this.command)}>
            {this.command.icon !== '' && <ConsoleIcon>{this.command.icon}</ConsoleIcon>}
            {this.command.name}
          </ConsoleCommand>
        </ConsoleSection>
      );
    }

    const iconMaxLength = Math.max(
      ...this.command.commands.map(command => command.icon.length)
    );

    return (
      <ConsoleSection>
        <ConsoleLabel>{this.command.name}</ConsoleLabel>
        <ConsoleCommandList>
          {this.command.commands.map((command, index) => (
            command.test(chapter) &&
            <ConsoleCommand key={index} onClick={() => this.runCommand(command, this.command)}>
              <ConsoleIcon offset={iconMaxLength - command.icon.length}>{command.icon}</ConsoleIcon>
              {command.name}
            </ConsoleCommand>
          ))}
        </ConsoleCommandList>
      </ConsoleSection>
    )
  }

  renderHistory() {
    return this.history.map((log, index) => (
      <ConsoleSection key={index}>
        {log.parentCommand != null && <ConsoleLabel>{log.parentCommand.name}</ConsoleLabel>}
        <ConsoleLog>
          <ConsoleTitle>
            {log.command.icon !== '' && <ConsoleIcon>{log.command.icon}</ConsoleIcon>}
            {log.command.name}
          </ConsoleTitle>
          <ConsoleMessage>
            {log.command.message}
          </ConsoleMessage>
        </ConsoleLog>
      </ConsoleSection>
    ));
  }

  render() {
    const {  className } = this.props;

    return (
      <Console className={className} innerRef={(ref) => { this.console = ref; }}>
        {this.renderHistory()}
        {this.renderVisibleCommand()}
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
