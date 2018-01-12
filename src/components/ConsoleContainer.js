import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import Console, {
  ConsoleSection,
  ConsoleCommandName,
  ConsoleCommandMessage,
  ConsoleInput
} from './Console';

@inject('tutorial')
@observer
class ConsoleContainer extends Component {
  state = {
    input: '',
  };

  handleConsoleInputChange = (event) => {
    const { value } = event.target;

    this.setState({
      input: value.substring(2),
    });
  }

  handleConsoleInputKeyDown = (event) => {
    if(event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'Enter') {
      event.preventDefault();
    }

    if (event.key === 'ArrowUp') {
      console.log('prev');
    }

    if (event.key === 'ArrowDown') {
      console.log('next');
    }

    if (event.key === 'Enter') {
      console.log('send');
    }
  }

  handleConsoleInputSelect = (event) => {
    event.preventDefault();
    console.log('Select', event);
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
    const { input } = this.state;

    return (
      <Console innerRef={(ref) => { this.console = ref; }}>
        <ConsoleSection>
          <ConsoleCommandName>$ git checkout master</ConsoleCommandName>
          <ConsoleCommandMessage>Switched to branch 'master'<br />Your branch is ahead of 'origin/master' by 2 commits.</ConsoleCommandMessage>
        </ConsoleSection>
        <ConsoleSection>
          <ConsoleInput
            value={`$ ${input}`}
            onChange={this.handleConsoleInputChange}
            onKeyDown={this.handleConsoleInputKeyDown} />
        </ConsoleSection>
      </Console>
    );
  }
}

export default ConsoleContainer;
