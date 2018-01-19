import React, { Component } from "react";
import { tween } from "popmotion";

const IDLE = 'IDLE';
const MEASURE = 'MEASURE';
const RESIZING = 'RESIZING';

class HeightTransition extends Component {
  state = {
    height: 'auto',
    state: MEASURE,
  };

  componentDidMount() {
    this.setState({
      height: this.container.clientHeight,
    });
  }

  componentDidUpdate(prevProps) {
    const { from, to, state } = this.state;

    if (state === MEASURE) {
      this.setState({
        state: RESIZING,
        from: to == null ? this.container.clientHeight : to,
        to: this.container.clientHeight,
      });
    } else if (state === RESIZING) {
      const update = (height) => {
        this.setState({
          height: `${height}px`,
        });
      }

      const complete = () => {
        this.setState({
          state: IDLE,
        });
      }

      tween({ from, to, duration: 700 })
        .start({ update, complete });

      this.setState({
        state: IDLE,
      });
    } else if (state === IDLE && prevProps.children !== this.props.children) {
      this.setState({
        state: MEASURE,
        height: 'auto',
      });
    }
  }

  render() {
    const { height } = this.state;

    return (
      <div {...this.props} style={{ height }} ref={(ref) => { this.container = ref; }} />
    );
  }
}

export default HeightTransition;
