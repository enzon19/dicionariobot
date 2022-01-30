module.exports = [
  {
    name: 'Definição de Palavras',
    command: '/definir',
    description: 'Use o comando para receber a definição de uma palavra. Ao informar uma frase, apenas a primeira palavra gerá resultados.',
    example: '/definir dicionário',
    alternative: ['/definicoes', '/definicao', '/definições', '/definição', '/definiçoes', '/definiçao'],
    args: '[palavra ou frase]',
    admin: false,
    parameters: [ 'bot', 'message', 'args' ],
    function: 'defineMessage',
    modulePath: './commands/define.js'
  },
  {
    name: 'Sinônimo de Palavras',
    command: '/sinonimo',
    description: 'Use o comando para receber o sinônimo de uma palavra. Ao informar uma frase, apenas a primeira palavra gerá resultados.',
    example: '/sinonimo dicionário',
    alternative: ['/sinônimo', '/sinônimos', '/sinonimos'],
    args: '[palavra ou frase]',
    admin: false,
    parameters: [ 'bot', 'message', 'args' ],
    function: 'synonymMessage',
    modulePath: './commands/synonym.js'
  },
  {
    name: 'Introdução',
    command: '/start',
    description: 'Seja introduzido ao bot.',
    example: '',
    alternative: [],
    args: '',
    admin: false,
    parameters: [ 'bot', 'message' ],
    function: 'start',
    modulePath: './commands/_general.js'
  },
  {
    name: 'Ajuda',
    command: '/help',
    description: 'Saiba como usar os comandos do bot.',
    example: '',
    alternative: ['/ajuda'],
    args: '',
    admin: false,
    parameters: [ 'bot', 'message' ],
    function: 'helpMessage',
    modulePath: './commands/help.js'
  },
  {
    name: 'Ajustes',
    command: '/settings',
    description: 'Configure o atalho no chat privado.',
    example: '',
    alternative: ['/ajustes', '/configuracoes', '/configurações'],
    args: '',
    admin: false,
    parameters: [ 'bot', 'message', 'dicionarioDB' ],
    function: 'settings',
    modulePath: './commands/_general.js'
  },
  {
    name: 'Privacidade',
    command: '/privacy',
    description: 'Política de privacidade do bot.',
    example: '',
    alternative: ['/privacidade'],
    args: '',
    admin: false,
    parameters: [ 'bot', 'message' ],
    function: 'privacy',
    modulePath: './commands/_general.js'
  },
  {
    name: 'Ajustes de Anúncios e Notícias',
    command: '/sem_interesse',
    description: 'Habilite ou desabilite anúncios e notícias.',
    example: '',
    alternative: ['/com_interesse'],
    args: '',
    admin: false,
    parameters: [ 'dicionarioDB', 'command', 'message', 'bot' ],
    function: 'subscribe',
    modulePath: './commands/news.js'
  },
  {
    name: 'Ping',
    command: '/ping',
    description: 'Teste de conexão do bot.',
    example: '',
    alternative: [],
    args: '',
    admin: false,
    parameters: [ 'bot', 'message' ],
    function: 'ping',
    modulePath: './commands/_general.js'
  },
  {
    name: 'allData',
    command: '/alldata',
    description: '',
    example: '',
    alternative: [],
    args: '',
    admin: true,
    parameters: [ 'dicionarioDB', 'bot' ],
    function: 'allData',
    modulePath: './commands/news.js'
  },
  {
    name: 'addData',
    command: '/adddata',
    description: '',
    example: '',
    alternative: [],
    args: '',
    admin: true,
    parameters: [ 'dicionarioDB', 'args', 'bot', 'message' ],
    function: 'addData',
    modulePath: './commands/news.js'
  },
  {
    name: 'deleteData',
    command: '/deletedata',
    description: '',
    example: '',
    alternative: [],
    args: '',
    admin: true,
    parameters: [ 'dicionarioDB', 'args', 'bot', 'message' ],
    function: 'deleteData',
    modulePath: './commands/news.js'
  }
];