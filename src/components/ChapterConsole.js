import React, { Component } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { action, observable, reaction } from 'mobx';
import AutosizeInput from 'react-input-autosize';

import Console, {
  ConsoleSection,
  ConsoleMessage,
  ConsoleIcon,
  ConsoleCommand,
  ConsoleLabel,
  ConsoleCommandList,
  ConsoleLog,
  ConsoleTitle,
  ConsoleInput,
} from './Console';
import ConsoleBody from './ConsoleBody';

@observer
class ChapterConsoleHistory extends Component {
  render() {
    const { chapter } = this.props;

    if (chapter.console.history.length === 0) {
      return null;
    }

    return (
      <ConsoleBody back limit>
        {chapter.console.history.map(log => {
          let message = log.command.message;

          if (log.error != null) {
            message = log.error.message;
          }

          return (
            <ConsoleSection key={log.id} error={log.error}>
              {log.command.parent != null &&
                !log.command.parent.isConsole && (
                  <ConsoleLabel>
                    {log.command.textOnly && '$ '}
                    {log.command.parent.name}
                  </ConsoleLabel>
                )}
              <ConsoleLog>
                <ConsoleTitle>
                  {log.command.icon !== '' && (
                    <ConsoleIcon>{log.command.icon}</ConsoleIcon>
                  )}
                  {log.command.name}
                </ConsoleTitle>
                {message != null && (
                  <ConsoleMessage>
                    <span>{message(log)}</span>
                  </ConsoleMessage>
                )}
              </ConsoleLog>
            </ConsoleSection>
          );
        })}
      </ConsoleBody>
    );
  }
}

@observer
class ChapterConsoleInput extends Component {
  @observable inputValue = '';

  @action.bound
  handleChange(event) {
    this.inputValue = event.target.value;
  }

  @action.bound
  handleKeyDown(event) {
    const { chapter, onEnter } = this.props;

    if (event.key !== 'Enter') {
      return;
    }

    event.preventDefault();

    let command;
    let args;

    try {
      ({ command, args } = chapter.console.parse(event.target.value));
    } catch (error) {
      console.error(error);
      return;
    }

    this.inputValue = '';
    onEnter({ command, args });
  }

  componentDidMount() {
    this.disposeFocus = reaction(
      () => this.props.chapter.vis.find(object => object.directActive),
      activeVisObject => {
        // Focus input if vis element was activated.
        if (activeVisObject != null) {
          this.inputElement.focus();
        }
      },
    );
  }

  componentWillUnmount() {
    this.disposeFocus();
  }

  handleClick = () => {
    this.inputElement.focus();
  };

  render() {
    const { chapter } = this.props;

    return (
      <ConsoleSection onClick={this.handleClick}>
        <ConsoleInput>
          <span>$</span>
          <AutosizeInput
            inputRef={ref => {
              this.inputElement = ref;
            }}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            placeholder="Your command …"
            value={this.inputValue}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown}
          />
          <span>{chapter.console.payloadElement()}</span>
        </ConsoleInput>
      </ConsoleSection>
    );
  }
}

@observer
class ChapterConsole extends Component {
  @action.bound
  runCommand({ command, args }) {
    const { chapter } = this.props;

    chapter.dispatch(command.action(command.payloadCreator(args)));
  }

  renderVisibleCommands() {
    const { chapter } = this.props;

    if (
      chapter.console.visibleCommands.length === 0 &&
      !chapter.console.useInput
    ) {
      return (
        <ConsoleSection>
          <ConsoleMessage>Nothing selected.</ConsoleMessage>
        </ConsoleSection>
      );
    }

    return chapter.console.visibleCommands.map(command => {
      if (command.commands.length === 0) {
        return (
          <ConsoleSection key={command.id}>
            <ConsoleCommand onClick={() => this.runCommand({ command })}>
              {command.icon !== '' && <ConsoleIcon>{command.icon}</ConsoleIcon>}
              {command.name}
            </ConsoleCommand>
          </ConsoleSection>
        );
      }

      const iconMaxLength = Math.max(
        ...command.commands.map(command => command.icon.length),
      );

      return (
        <ConsoleSection key={command.id}>
          <ConsoleLabel>{command.name}</ConsoleLabel>
          <ConsoleCommandList>
            {command.visibleCommands.map(
              command =>
                command.available && (
                  <ConsoleCommand
                    key={command.id}
                    onClick={() => this.runCommand({ command })}
                  >
                    <ConsoleIcon offset={iconMaxLength - command.icon.length}>
                      {command.icon}
                    </ConsoleIcon>
                    {command.name}
                  </ConsoleCommand>
                ),
            )}
          </ConsoleCommandList>
        </ConsoleSection>
      );
    });
  }

  render() {
    const { className, chapter } = this.props;

    if (chapter.console == null) {
      return null;
    }

    return (
      <Console className={className}>
        <ChapterConsoleHistory chapter={chapter} />
        <ConsoleBody>
          {this.renderVisibleCommands()}
          {chapter.console.useInput && (
            <ChapterConsoleInput chapter={chapter} onEnter={this.runCommand} />
          )}
        </ConsoleBody>
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
