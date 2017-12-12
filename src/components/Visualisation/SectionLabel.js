import React, { PureComponent } from 'react';
import { withTheme } from 'styled-components';

import Object3D from './Object3D';
import SectionLabelObject from './objects/SectionLabel';

@withTheme
class SectionLabel extends PureComponent {
  static defaultProps = {
    column: 0,
    level: 0,
    row: 0,
    height: 1,
    width: 1,
    appear: false,
  };

  sectionLabelObject = new SectionLabelObject();

  componentDidMount() {
    const { appear } = this.props;

    if (appear) {
      this.sectionLabelObject.appear();
    }
  }

  render() {
    const { font, label } = this.props;

    this.sectionLabelObject.update(font, label);

    return (
      <Object3D object3D={this.sectionLabelObject} />
    );
  }
}

export default SectionLabel;
