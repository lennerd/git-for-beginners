import React, { PureComponent } from 'react';
import { withTheme } from 'styled-components';

import Object3D from './Object3D';
import PopupObject from './objects/Popup';

@withTheme
class Popup extends PureComponent {
  static defaultProps = {
    level: 0,
    appear: false,
  };

  popupObject = new PopupObject();

  componentDidMount() {
    const { appear } = this.props;

    if (appear) {
      this.popupObject.appear();
    }
  }

  render() {
    const { theme, font, label, level } = this.props;

    this.popupObject.update(font, label);

    this.popupObject.position.y = theme.vis.levelHeight * level;

    return (
      <Object3D object3D={this.popupObject} />
    );
  }
}

export default Popup;
