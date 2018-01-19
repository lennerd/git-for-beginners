import { Component } from "react";

class PopmotionValue extends Component {
  componentDidMount() {
    const { value } = this.props;

    this.subscribe(value);
  }

  componentWillReceiveProps(nextProps) {
    const { value } = nextProps;

    if (value !== this.props.value) {
      this.subscribe(value);
    }
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  subscribe(value) {
    if (this.subscription != null) {
      this.subscription.unsubscribe();
    }

    this.subscription = value.subscribe(this.handleUpdate);
  }

  handleUpdate = () => {
    this.forceUpdate();
  }

  render() {
    const { children, value } = this.props;

    return children(value.get());
  }
}

class PopmotionAction extends Component {
  static defaultProps = {
    onComplete: () => {},
  };

  componentDidMount() {
    const { action } = this.props;

    if (action != null) {
      this.subscribe(action);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { action } = nextProps;

    if (action !== this.props.action && action != null) {
      this.subscribe(action);
    }
  }

  componentWillUnmount() {
    this.action.stop();
  }

  handleComplete = () => {
    const { onComplete } = this.props;

    this.forceUpdate();
    onComplete();
  };

  subscribe(action) {
    if (this.subscription != null) {
      this.subscription.unsubscribe();
    }

    this.subscription = action.subscribe({
      complete: this.handleUpdate
    });
  }

  updateValue() {
    this.setState({
      value: this.value.get(),
    });
  }

  subscribe() {
    if (this.subscription != null) {
      this.subscription.unsubscribe();
    }

    this.subscription = this.value.subscribe({
      update: this.handleUpdate,
      complete: this.handleComplete,
    });
  }

  render() {
    const { children } = this.props;
    const { value } = this.state;

    return children(value);
  }
}

export default PopmotionAction;
