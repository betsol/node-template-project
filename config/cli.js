
module.exports = {
  minimistConfig: {
    alias: {
      environment: ['env', 'e'],
      command: ['cmd'],
      noServer: ['no-server', 'ns'],
      console: ['cli']
    },
    default: {
      noServer: false,
      console: false
    },
    boolean: [
      'noServer', 'no-server', 'ns',
      'cli', 'console'
    ]
  }
};
