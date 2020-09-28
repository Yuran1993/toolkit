users = [
  {
    email: 'user1@test.nl',
    name: 'user1',
    password: 'wachtwoord',
    tools: [
      {url: 'impact-analysis', auth: true},
      {url: 'abtest-calculator', auth: false},
      {url: 'bayesiaanse-calculator', auth: false},
    ],
    _id: 1
  },
  {
    email: 'user2@test.nl',
    name: 'user2',
    password: 'wachtwoord',
    tools: [

    ],
    _id: 2
  },
  {
    email: 'user3@test.nl',
    name: 'user3',
    password: 'wachtwoord',
    tools: [

    ],
    _id: 3
  },
];

module.exports = users;