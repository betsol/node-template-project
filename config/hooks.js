
module.exports = [
  'Environment',
  'Logging',
  'Services',
  'Validator',
  'Database',
  'Fixtures',
  {
    name: 'ServerInit',
    server: true
  },
  {
    name: 'ServerIpParser',
    server: true
  },
  'HttpErrors',
  {
    name: 'Routes',
    server: true
  },
  {
    name: 'ServerStart',
    server: true
  }
];
