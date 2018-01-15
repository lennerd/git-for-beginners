import React, { Component, createElement } from 'react';
import { observable, action, computed } from 'mobx';
import { createPortal } from 'react-dom';
import { Manager, Target, Popper, Arrow } from 'react-popper';
import styled from 'styled-components';
import { observer, inject } from 'mobx-react';

const TooltipTarget = styled(Target)`
  border-bottom: 2px solid ${props => props.theme.color.interactive.alpha(0.5)};
  cursor: pointer;

  &:hover {
    border-bottom-color: ${props => props.theme.color.interactive};
  }
`;

const TooltipPopper = styled(Popper).attrs({
  'aria-hidden': props => props.hidden,
})`
  z-index: 2;
  background-color: white;
  display: ${props => props.hidden ? 'none' : 'block'};
  border-radius: ${props => props.theme.borderRadius.large};
  width: ${props => props.theme.spacing(13)};

  &[data-placement="top"] {
    margin-bottom: ${props => props.theme.spacing(0.75)};
  }

  &[data-placement="bottom"] {
    margin-top: ${props => props.theme.spacing(0.75)};
  }
`;

const TooltipArrow = styled(Arrow)`
  width: 0;
  height: 0;
  position: absolute;
  border-color: white;
  border-style: solid;

  [data-placement="top"] > & {
    border-width: ${props => props.theme.spacing(0.75)} ${props => props.theme.spacing(0.75)} 0 ${props => props.theme.spacing(0.75)};
    bottom: ${props => props.theme.spacing(-0.75)};
    border-left-color: transparent;
    border-right-color: transparent;
    border-bottom-color: transparent;
  }

  [data-placement="bottom"] > & {
    border-width: 0 ${props => props.theme.spacing(0.75)} ${props => props.theme.spacing(0.75)} ${props => props.theme.spacing(0.75)};
    top: ${props => props.theme.spacing(-0.75)};
    border-left-color: transparent;
    border-right-color: transparent;
    border-top-color: transparent;
  }
`;

const TooltipTitle = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${props => props.theme.spacing(0.75)};
  padding-bottom: ${props => props.theme.spacing(0.5)};
  font-weight: 600;
  color: ${props => props.theme.color.highlight};
`;

const TooltipClose = styled.button`
  ${props => props.theme.mixins.monospaced}
  color: ${props => props.theme.color.interactive};

  strong {
    font-weight: 700;
  }
`;

const TooltipBody = styled.div`
  padding: ${props => props.theme.spacing(0.75)};
  padding-bottom: ${props => props.theme.spacing()};

  ${TooltipTitle} + & {
    padding-top: ${props => props.theme.spacing(0.5)};
    border-top: 1px solid ${props => props.theme.color.highlight.alpha(0.1)};
  }

  & > * + * {
    margin-top: ${props => props.theme.spacing(0.75)};
  }
`;

@inject('glossary')
@observer
class Tooltip extends Component {
  @observable hidden = true;

  @computed get term() {
    const { name, glossary } = this.props;

    return glossary.terms[name];
  }

  constructor() {
    super();

    this.popperContainer = document.createElement('div');
  }

  componentDidMount() {
    document.body.appendChild(this.popperContainer);

    window.addEventListener('click', this.hide);
  }

  componentWillUnmount() {
    document.body.removeChild(this.popperContainer);

    window.removeEventListener('click', this.hide);
  }

  @action.bound hide() {
    this.toggle(false);
  }

  @action.bound toggle(visible = this.hidden) {
    this.hidden = !visible;
  }

  handleClick = (event) => {
    event.stopPropagation();
  };

  renderPopper() {
    return (
      <TooltipPopper placement="top" hidden={this.hidden}>
        <TooltipTitle>
          {this.term.name}
          <TooltipClose onClick={this.hide}><strong>×</strong> Close</TooltipClose>
        </TooltipTitle>
        <TooltipBody>
          {createElement(this.term.text)}
        </TooltipBody>
        <TooltipArrow />
      </TooltipPopper>
    );
  }

  render() {
    const { children } = this.props;

    return (
      <Manager tag="span" onClick={this.handleClick}>
        <TooltipTarget component="a" onClick={this.toggle}>
          {children}
        </TooltipTarget>
        {createPortal(
          this.renderPopper(),
          this.popperContainer,
        )}
      </Manager>
    );
  }
}

export default Tooltip;
