import { observer } from "mobx-react";
import React, { Component } from "react";
import styled, { css } from "styled-components";
import { action } from "mobx";

const hover = css`
  border-bottom-color: ${props => props.theme.color.highlight};
`;

const active = css`
  background-color: ${props => props.theme.color.highlight.alpha(0.1)};
`;

const VisualisationReference = styled.a`
  white-space: nowrap;
  cursor: pointer;
  z-index: 1;
  border-bottom: 2px solid ${props => props.theme.color.highlight.alpha(0.3)};
  ${props => (props.hover || props.active) && hover};
  ${props => props.active && active};
`;

@observer
class VisualisationObjectReference extends Component {
  @action.bound handleMouseEnter() {
    const { object } = this.props;

    object.directHover = true;
  }

  @action.bound handleMouseLeave() {
    const { object } = this.props;

    object.directHover = false;
  }

  @action.bound handleClick() {
    const { object, vis } = this.props;

    vis.active = false;
    object.directActive = true;
  }

  render() {
    const { object, children } = this.props;

    return (
      <VisualisationReference
        active={object.active}
        hover={object.hover}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onClick={this.handleClick}
      >
        {children}
      </VisualisationReference>
    );
  }
}

@observer
export class VisualisationCommitReference extends Component {
  render() {
    const { commit, vis } = this.props;

    if (commit == null) {
      console.error('missing commit');
      return null;
    }

    return (
      <VisualisationObjectReference object={commit} vis={vis}>
        {commit.commit.checksumShort}
      </VisualisationObjectReference>
    )
  }
}

@observer
export class VisualisationFileReference extends Component {
  render() {
    const { file, vis } = this.props;

    return (
      <VisualisationObjectReference object={file} vis={vis}>
        {file.file.name}
      </VisualisationObjectReference>
    )
  }
}

export default VisualisationObjectReference;
