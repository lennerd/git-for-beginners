import React, { Component } from 'react';
import { withTheme } from 'styled-components';
import { observer } from 'mobx-react';
import { action, computed } from 'mobx';
import { value, tween, timeline, easing } from 'popmotion';
import { Transition } from 'react-transition-group';

import VisualisationObject3D from './VisualisationObject3D';
import { LEVEL_HEIGHT, CELL_HEIGHT, CELL_WIDTH } from '../theme';
import { STATUS_DELETED, STATUS_ADDED, STATUS_MODIFIED, STATUS_UNMODIFIED } from '../constants';

export const FILE_SIZE_RATIO = 1 / Math.sqrt(2);
export const FILE_HEIGHT = LEVEL_HEIGHT / 2;
export const FILE_WIDTH = FILE_HEIGHT * 10;
export const FILE_DEPTH = FILE_WIDTH * FILE_SIZE_RATIO;
export const FILE_OUTLINE = 0.03;

function moveTo({ from, to, duration }) {
  const { level: fromLevel, column: fromColumn, row: fromRow } = from;
  const { level: toLevel, column: toColumn, row: toRow } = to;

  const halfDuration = duration / 2;
  const quarterDuration = halfDuration / 2;

  if (fromColumn === toColumn && fromRow === toRow) {
    return tween({ from, to, duration: halfDuration, ease: easing.easeInOut });
  }

  if (fromLevel === toLevel) {
    return tween({ from, to, duration: duration, ease: easing.easeInOut });
  }

  const halfWayColumn = fromColumn + ((toColumn - fromColumn) / 2);
  const halfWayRow = fromRow + ((toRow - fromRow) / 2);


  return timeline([
    [
      { track: 'row', from: fromRow, to: halfWayRow, duration: halfDuration, ease: easing.easeInOut },
      { track: 'column', from: fromColumn, to: halfWayColumn, duration: halfDuration, ease: easing.easeInOut },
    ],
    `-${quarterDuration}`,
    { track: 'level', from: fromLevel, to: toLevel, duration: halfDuration, ease: easing.easeInOut },
    `-${quarterDuration}`,
    [
      { track: 'row', from: halfWayRow, to: toRow, duration: halfDuration, ease: easing.easeInOut },
      { track: 'column', from: halfWayColumn, to: toColumn, duration: halfDuration, ease: easing.easeInOut },
    ],
  ]);
}

@withTheme
@observer
class VisualisationFile extends Component {
  constructor(props) {
    super();

    const { file, theme } = props;

    this.fileObject = new THREE.Group();

    this.fileMesh = new THREE.Mesh(
      new THREE.BoxBufferGeometry(FILE_WIDTH, FILE_HEIGHT, FILE_DEPTH),
      new THREE.MeshLambertMaterial(),
    );

    this.hoverMesh = new THREE.Mesh(
      new THREE.BoxBufferGeometry(FILE_WIDTH + FILE_OUTLINE, FILE_HEIGHT + FILE_OUTLINE, FILE_DEPTH + FILE_OUTLINE),
      new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, color: theme.color.highlight, side: THREE.BackSide }),
    );

    this.shadowMash = new THREE.Mesh(
      new THREE.BoxBufferGeometry(FILE_WIDTH, FILE_HEIGHT * 2, FILE_DEPTH),
      new THREE.ShadowMaterial({ depthWrite: false }),
    );

    this.fileMesh.position.y = FILE_HEIGHT / 2;

    // Shift a little to the back by FILE_OUTLINE to have no border between moving clones.
    this.hoverMesh.position.y = FILE_HEIGHT / 2 - FILE_OUTLINE;
    this.hoverMesh.position.x = FILE_OUTLINE;
    this.hoverMesh.position.z = FILE_OUTLINE;

    this.shadowMash.castShadow = true;
    this.shadowMash.position.y = 0.1;

    this.fileObject.add(this.shadowMash);
    this.fileObject.add(this.hoverMesh);
    this.fileObject.add(this.fileMesh);

    this.height = value(1, height => {
      this.fileObject.scale.y = height;
    });

    this.position = value(file.position, position => {
      this.fileObject.position.set(
        CELL_HEIGHT * position.row,
        LEVEL_HEIGHT * position.level,
        CELL_WIDTH * position.column,
      );
    });

    this.hoverOpacity = value(0, opacity => {
      this.hoverMesh.material.opacity = opacity;
    });

    this.size = value(1, size => {
      this.fileObject.scale.x = size;
      this.fileObject.scale.z = size;
    });
  }

  handleEnter = () => {
    const { file } = this.props;

    if (file.prevPosition != null) {
      moveTo({ from: file.prevPosition, to: this.position.get(), duration: 1400 }).start(this.position);
      this.tweenValue = this.position;
    } else if (file.status === STATUS_ADDED) {
      tween({ from: 0, to: this.height.get(), duration: 700, ease: easing.easeInOut }).start(this.height);
      this.tweenValue = this.height;
    }
  };

  handleExit = () => {
    const { file } = this.props;

    if (file.status === STATUS_DELETED) {
      tween({ from: this.height.get(), to: 0, duration: 700, ease: easing.easeInOut }).start(this.height);
      this.tweenValue = this.height;
    }
  };

  addEndListener = (node, complete) => {
    if (this.tweenValue == null) {
      return complete();
    }

    this.tweenValue.subscribe({
      complete,
    });

    this.tweenValue = null;
  };

  @action.bound handleClick(event) {
    const { file, vis } = this.props;

    vis.active = false;
    file.active = !file.active;

    event.stopPropagation();
  };

  @action.bound handleMouseEnter(event) {
    const { file } = this.props;

    file.hover = true;
  };

  @action.bound handleMouseLeave(event) {
    const { file } = this.props;

    file.hover = false;
  };

  @computed get versionsHovered() {
    const { file, vis } = this.props;

    if (!vis.isGit) {
      return false;
    }

    return vis.getVersions(file).some(file => file.hover);
  }

  @computed get versionsActive() {
    const { file, vis } = this.props;

    if (!vis.isGit) {
      return false;
    }

    return vis.getVersions(file).some(file => file.active);
  }

  render() {
    const { children, file, theme, in: inProp, ...props } = this.props;

    this.fileObject.visible = file.visible;

    let color = theme.color.fileDefault;

    if (file.status === STATUS_ADDED) {
      color = theme.color.fileAdded;
    } else if (file.status === STATUS_DELETED) {
      color = theme.color.fileDeleted;
    }

    const opacity = !inProp ? 0 : file.active ? 1 : file.hover ? 0.7 : (this.versionsHovered || this.versionsActive) ? 0.3 : 0;

    if (inProp) {
      moveTo({
        from: this.position.get(),
        to: file.position,
        duration: 1400,
        ease: easing.easeInOut
      }).start(this.position);
    }

    tween({
      from: this.hoverOpacity.get(),
      to: opacity,
      duration: 200
    }).start(this.hoverOpacity);

    this.fileMesh.material.color = color;

    // Add small offset when for not new or deleted files so no artefacts appear between colors.
    this.fileMesh.material.polygonOffset = true;
    this.fileMesh.material.polygonOffsetFactor =
      (file.status === STATUS_UNMODIFIED || file.status === STATUS_MODIFIED) ? -0.01 : 0;

    this.fileMesh.material.needsUpdate = true;

    return (
      <Transition
        {...props}
        in={inProp}
        onEnter={this.handleEnter}
        onExit={this.handleExit}
        addEndListener={this.addEndListener}
      >
        <VisualisationObject3D
          object3D={this.fileObject}
          onClick={this.handleClick}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
        >
          {children}
        </VisualisationObject3D>
      </Transition>
    );
  }
}

export default VisualisationFile;
