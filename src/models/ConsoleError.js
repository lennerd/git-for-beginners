class ConsoleError {
  constructor(message) {
    if (typeof message === 'string') {
      this.message = () => message;
    } else {
      this.message = message;
    }
  }
}

export default ConsoleError;
