class ConsoleCommand {
  icon = '';
  commands = [];
  available = true;

  constructor(name, options) {
    Object.assign(this, {
      ...options,
      name,
    });
  }

  run() {
    console.error('Missing run.');
  }
}

export default ConsoleCommand;
