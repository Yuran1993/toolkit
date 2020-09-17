users = [
  {
    email: 'user1@test.nl',
    name: 'user1',
    password: 'wachtwoord',
    tools: [
      {url: 'impact-analysis', auth: true},
      {url: 'abtest-calculator', auth: true},
      {url: 'bayesiaanse-calculator', auth: true},
      {url: '3', auth: true},
      {url: '4', auth: true},
      {url: '6', auth: true},
    ],
    _id: 1
  },
  {
    email: 'user2@test.nl',
    name: 'user2',
    password: 'wachtwoord',
    tools: [
      {url: '1', auth: true},
      {url: '2', auth: true},
      {url: '3', auth: true},
      {url: '4', auth: true},
      {url: '5', auth: false},
      {url: '6', auth: true},
    ],
    _id: 2
  },
  {
    email: 'user3@test.nl',
    name: 'user3',
    password: 'wachtwoord',
    tools: [
      {url: 'impact-analysis', auth: false},
      {url: '2', auth: false},
      {url: '3', auth: false},
      {url: '4', auth: false},
      {url: '5', auth: true},
    ],
    _id: 3
  },
];

module.exports = users;