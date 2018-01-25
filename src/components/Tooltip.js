import React, { Component } from 'react';
import { observable, action, computed } from 'mobx';
import { createPortal } from 'react-dom';
import { Manager, Target, Popper, Arrow } from 'react-popper';
import styled from 'styled-components';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

const TooltipTarget = styled.a`
  transition: border-bottom-color 400ms;
  border-bottom: 2px solid ${props => props.theme.color.interactive.alpha(0.5)};
  cursor: pointer;
  hyphens: none;

  &:hover {
    border-bottom-color: ${props => props.theme.color.interactive};
  }
`;

const TooltipPopper = styled.div.attrs({
  'aria-hidden': props => props.hidden,
})`
  z-index: 2;
  background-color: white;
  display: ${props => (props.hidden ? 'none' : 'block')};
  border-radius: ${props => props.theme.borderRadius.large};
  width: ${props => props.theme.spacing(13)};

  &[data-placement='top'] {
    margin-bottom: ${props => props.theme.spacing(0.75)};
  }

  &[data-placement='bottom'] {
    margin-top: ${props => props.theme.spacing(0.75)};
  }
`;

const TooltipArrow = styled.div`
  width: 0;
  height: 0;
  position: absolute;
  border-color: white;
  border-style: solid;

  [data-placement='top'] > & {
    border-width: ${props => props.theme.spacing(0.75)}
      ${props => props.theme.spacing(0.75)} 0
      ${props => props.theme.spacing(0.75)};
    bottom: ${props => props.theme.spacing(-0.75)};
    border-left-color: transparent;
    border-right-color: transparent;
    border-bottom-color: transparent;
  }

  [data-placement='bottom'] > & {
    border-width: 0 ${props => props.theme.spacing(0.75)}
      ${props => props.theme.spacing(0.75)}
      ${props => props.theme.spacing(0.75)};
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

  & > * + * {
    margin-left: ${props => props.theme.spacing(0.5)};
  }
`;

const TooltipTitleTerm = styled.div`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const TooltipTitleLink = styled.button`
  ${props => props.theme.mixins.monospaced} color: ${props =>
      props.theme.color.interactive};
  white-space: nowrap;

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

export class TooltipTerm extends Component {
  static contextTypes = {
    onClickTerm: PropTypes.func,
  };

  handleClickTarget = event => {
    const { onClickTerm } = this.context;
    const { name } = this.props;

    onClickTerm(name);
  };

  render() {
    const { children } = this.props;

    return (
      <TooltipTarget onClick={this.handleClickTarget}>{children}</TooltipTarget>
    );
  }
}

@inject('glossary')
@observer
class Tooltip extends Component {
  static childContextTypes = {
    onClickTerm: PropTypes.func,
  };

  @observable hidden = true;
  @observable history = [];

  @computed
  get term() {
    const { glossary } = this.props;
    const lastName = this.history[this.history.length - 1];

    return glossary.terms[lastName];
  }

  constructor(props) {
    super();

    const { name } = props;

    this.popperContainer = document.createElement('div');
    this.history.push(name);
  }

  componentDidMount() {
    document.body.appendChild(this.popperContainer);

    window.addEventListener('click', this.hide);
  }

  componentWillUnmount() {
    document.body.removeChild(this.popperContainer);

    window.removeEventListener('click', this.hide);
  }

  getChildContext() {
    return {
      onClickTerm: this.addTerm,
    };
  }

  @action.bound
  hide(event) {
    const nativeEvent = event.nativeEvent || event;

    if (nativeEvent.tooltip === this) {
      return;
    }

    this.toggle(false);
  }

  @action
  toggle(visible = this.hidden) {
    this.hidden = !visible;

    if (this.hidden) {
      this.history = [this.history[0]];
    }
  }

  @action.bound
  handleClickTarget(event) {
    event.nativeEvent.tooltip = this;

    this.toggle();
  }

  @action.bound
  handleClickPopper(event) {
    event.stopPropagation();
  }

  @action.bound
  addTerm(name) {
    this.history.push(name);
  }

  @action.bound
  goBack() {
    this.history.pop();
  }

  renderPopper() {
    return (
      <Popper
        component={TooltipPopper}
        placement="top"
        hidden={this.hidden}
        onClick={this.handleClickPopper}
      >
        <TooltipTitle>
          {this.history.length > 1 && (
            <TooltipTitleLink onClick={this.goBack}>
              <strong>←</strong> Back
            </TooltipTitleLink>
          )}
          <TooltipTitleTerm>{this.term.name}</TooltipTitleTerm>
          <TooltipTitleLink onClick={this.hide}>
            Close <strong>×</strong>
          </TooltipTitleLink>
        </TooltipTitle>
        <TooltipBody>{this.term.text()}</TooltipBody>
        <Arrow component={TooltipArrow} />
      </Popper>
    );
  }

  render() {
    const { children } = this.props;

    return (
      <Manager tag={false}>
        <Target component={TooltipTarget} onClick={this.handleClickTarget}>
          {children}
        </Target>
        {createPortal(this.renderPopper(), this.popperContainer)}
      </Manager>
    );
  }
}

export default Tooltip;
