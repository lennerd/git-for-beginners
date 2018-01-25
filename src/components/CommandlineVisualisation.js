import React, { Component } from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';

import Console, { ConsoleMessage, ConsoleSection } from './Console';
import ConsoleBody from './ConsoleBody';

@observer
class Commandline extends Component {
  render() {
    const { className, chapter } = this.props;

    return (
      <div className={className}>
        <Console>
          <ConsoleBody>
            <ConsoleSection>
              <ConsoleMessage>
                <CommandlinePart>
                  <CommandlinePartLabel active={chapter.hasPrompt}>
                    Prompt
                  </CommandlinePartLabel>
                  path/to/project $
                </CommandlinePart>
                <CommandlinePart>
                  <CommandlinePartLabel active={chapter.hasCommand}>
                    Command<br />Program
                  </CommandlinePartLabel>
                  git
                </CommandlinePart>
                <CommandlinePart>
                  <CommandlinePartLabel active={chapter.hasParameters}>
                    Subcommands<br />Options
                  </CommandlinePartLabel>
                  commit -m "Commit name"
                </CommandlinePart>
              </ConsoleMessage>
            </ConsoleSection>
          </ConsoleBody>
        </Console>
      </div>
    );
  }
}

const CommandlinePart = styled.div`
  position: relative;
  white-space: nowrap;

  & + & {
    margin-left: ${props => props.theme.spacing(0.5)};
  }
`;

const CommandlinePartLabel = styled.div`
  transition: opacity 400ms;
  position: absolute;
  bottom: calc(100% + ${props => props.theme.spacing(1.25)});
  width: 100%;
  left: 0;
  padding-bottom: ${props => props.theme.spacing(1.25)};
  text-align: center;
  display: flex;
  justify-content: center;
  border-bottom: 1px solid #979797;
  font-family: 'Source Sans Pro', sans-serif;
  line-height: ${props => props.theme.baseLineHeight};
  font-size: ${props => props.theme.baseFontSize}px;
  opacity: ${props => (props.active ? 1 : 0)};
  color: ${props => props.theme.color.highlight};

  &:after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: 0;
    height: ${props => props.theme.spacing()};
    background-color: #979797;
    width: 1px;
  }
`;

export default styled(Commandline)`
  grid-area: console;
  align-self: center;
  justify-self: center;

  ${ConsoleBody} {
    font-size: ${props => props.theme.spacing(0.8)};
    overflow: visible;
  }
`;
