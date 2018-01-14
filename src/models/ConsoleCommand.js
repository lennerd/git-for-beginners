class ConsoleCommand {
  icon = '';
  commands = [];

  constructor(name, options) {
    Object.assign(this, {
      ...options,
      name,
    });
  }

  test() {
    return true;
  }

  run() {
    console.error('Missing run.');
  }
}

export default ConsoleCommand;
