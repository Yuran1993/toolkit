const tools = [
  {
    name: 'A/B-test Calculator',
    url: 'abtest-calculator',
    icon: 'card-icon-1',
    open: true,
    openForAccounts: true,
    lang: 'NL',
    body: [
      'Aan het eind van je A/B-test wil je, voor je investeert in het implementeren van je nieuw ontworpen variatie, graag zo zeker mogelijk weten dat je nieuwe variatie (B) het beter gaat doen dan je huidige versie (A). De A/B-Test Calculator verzorgt op een frequentistische manier het bewijs hiervoor. De calculator vertelt je of er genoeg statistische bewijs is om aan te tonen dat, gekeken naar je testdata, er in de werkelijkheid een significant verschil is tussen het aantal conversies voor je huidige versie (A) en je vernieuwde variant (B).',
      'Hierbij houden we rekening met een klein error percentage, de p-waarde. De p-waarde reflecteert de geaccepteerde kans dat de testdata misschien niet representatief is voor de werkelijkheid en we dus de verkeerde conclusie trekken. In de statistische literatuur wordt deze vaak op 5% gezet ( p < 0.05), waarmee we dus voor 95% zeker weten dat we de goede conclusie trekken uit onze data (‘confidence’ ).',
      'Je kunt het verschil tussen je A en B variant op twee manieren testen. 1) B is beter dan A. Hiermee test je een eenzijdige hypothese (one-sided test). 2) B is beter dan A of A is beter dan B. Hiermee test je een tweezijdige hypothese (two-sided test). Een een- of tweezijdige hypothese test heeft invloed op hoe het error percentage wordt verdeeld over de testdata.',
    ],
  },
  {
    name: 'Bayesiaanse A/B-test calculator',
    url: 'bayesiaanse-calculator',
    icon: 'card-icon-2',
    open: true,
    openForAccounts: true,
    lang: 'NL',
    body: [
      'Aan het eind van je A/B-test wil je, voor je investeert in het implementeren van je nieuw ontworpen variatie, graag zo zeker mogelijk weten dat je nieuwe variatie (B) het beter gaat doen dan je huidige versie (A). De Bayesiaanse A/B-Test Calculator verzorgt op een bayesiaanse manier het bewijs hiervoor. De calculator berekent de kans dat, gekeken naar je testdata, er in de werkelijkheid een significant verschil is tussen het aantal conversies voor je huidige versie (A) en je vernieuwde variant (B).',
      'De Bayesiaanse kans kan ook gezien worden als een risico analyse. Wanneer je B variant, je huidige A variant overtreft met een bayesiaanse kans van 90%, heb je 90% kans dat je investering in het implementeren van B je geld oplevert. Zo is het makkelijk de balans (of business case) op te maken voor het implementeren van je nieuwe design.',
    ],
  },
  {
    name: 'Automatic Sample Size Calculator',
    url: 'sample-size-calculator',
    icon: 'card-icon-3',
    openForAccounts: true,
    lang: 'EN',
    header: '',
    usps: [],
    body: [
      'Create a complete overview of your website using only 3 simple steps and get instant advice on where to start experimenting with your A/B tests? Yes, and it’s free! Link your Google Analytics account now and let the tool calculate where you can make a business impact.',
      'The purpose and necessity of most calculators available online are not always clear and the statistical concepts make it unnecessarily complex sometimes, especially to people new to CRO.',
      'Online Dialogue\'s Automatic Sample Size Calculator makes your life as a CRO specialist a lot easier. Within 3 simple steps you know what pages can be used for testing, how long you should be testing and how much impact on conversions is needed.',
      'Online Dialogue\'s new Automatic Sample Size Calculator is doing this all for you.'
    ],
    over: [
      'When you start experimenting, it is important to determine a number of clear preconditions in advance. One of those conditions is to determine how much visitors you need for your experiment ("Sample size").',
      'You determine how many visitors you need to find a significant effect (\'Power\'), along with the minimum effect size (\'Minimal Detectable Effect\') and a level of certainty (\'Significance\').',
      'Based on these results you decide what the best chances are for your experiments and its duration.',
    ],
    aanmelden: [],
  },
];

module.exports = tools;