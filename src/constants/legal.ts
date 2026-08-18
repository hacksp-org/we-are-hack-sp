export interface Localized {
  pt: string;
  en: string;
}

export interface LegalNavLink extends Localized {
  href: string;
}

export interface LegalNavGroup {
  label?: Localized;
  links: LegalNavLink[];
}

export interface LegalBlock extends Localized {
  kind: 'h2' | 'h3' | 'p' | 'li';
}

export interface LegalSection {
  id: string;
  blocks: LegalBlock[];
}

export interface LegalDocument {
  eyebrow: Localized;
  title: Localized;
  lead: Localized;
  nav: LegalNavGroup[];
  sections: LegalSection[];
}

/**
 * Long-form legal copy, kept out of `translations.ts` so the UI dictionary stays
 * scannable. Both languages sit in each entry, which makes a gap obvious.
 */

export const conductDocument: LegalDocument = {
  eyebrow: {
    en: 'Code of conduct',
    pt: 'Código de conduta'
  },
  title: {
    en: 'Everyone is welcome at Hack SP — and everyone is responsible for keeping it that way.',
    pt: 'Todo mundo é bem-vindo no Hack SP — e todo mundo é responsável por manter esse ambiente.'
  },
  lead: {
    en: 'This code of conduct applies to every Hack SP space: hackathons, workshops, our Discord server, repositories, e-mail and any online or in-person interaction on behalf of the project. It applies to participants, mentors, volunteers, organizers, partners and guests alike.',
    pt: 'Este código de conduta vale para todos os espaços do Hack SP: hackathons, workshops, nosso servidor no Discord, repositórios, e-mails e qualquer interação online ou presencial em nome do projeto. Vale igualmente para participantes, mentores, voluntários, organizadores, parceiros e convidados.'
  },
  nav: [
    {
      label: undefined,
      links: [
        {
          en: 'Our principles',
          pt: 'Nossos princípios',
          href: '#principios'
        },
        {
          en: 'Expected behavior',
          pt: 'Comportamento esperado',
          href: '#esperado'
        },
        {
          en: 'Unacceptable behavior',
          pt: 'Comportamento inaceitável',
          href: '#inaceitavel'
        },
        {
          en: 'Minors and safety',
          pt: 'Menores de idade e segurança',
          href: '#menores'
        },
        {
          en: 'Projects and fair play',
          pt: 'Projetos e fair play',
          href: '#projetos'
        },
        {
          en: 'Reporting',
          pt: 'Como denunciar',
          href: '#denuncia'
        },
        {
          en: 'Consequences',
          pt: 'Consequências',
          href: '#consequencias'
        },
        {
          en: 'Credits',
          pt: 'Créditos',
          href: '#creditos'
        }
      ]
    }
  ],
  sections: [
    {
      id: 'principios',
      blocks: [
        {
          kind: 'h2',
          pt: 'Nossos princípios',
          en: 'Our principles'
        },
        {
          kind: 'p',
          pt: 'O Hack SP existe para que adolescentes construam coisas juntos. Isso só funciona quando as pessoas se sentem seguras, respeitadas e livres para serem iniciantes. Levamos este documento a sério: ele não é enfeite, é a forma como nossos eventos funcionam.',
          en: 'Hack SP exists so that teenagers can build things together. That only works when people feel safe, respected and free to be beginners. We take this document seriously: it is not decoration, it is how our events are run.'
        },
        {
          kind: 'p',
          pt: 'Três ideias guiam tudo o que vem abaixo: seja gentil com as pessoas, seja honesto sobre o seu trabalho e deixe o espaço melhor do que você encontrou.',
          en: 'Three ideas guide everything below: be kind to people, be honest about your work, and leave the space better than you found it.'
        }
      ]
    },
    {
      id: 'esperado',
      blocks: [
        {
          kind: 'h2',
          pt: 'Comportamento esperado',
          en: 'Expected behavior'
        },
        {
          kind: 'p',
          pt: 'Trate todas as pessoas com respeito',
          en: 'Treat everyone with respect'
        },
        {
          kind: 'p',
          pt: 'Idades, escolas, níveis de experiência, gêneros, raças, religiões, corpos, orientações sexuais e neurotipos diferentes dividem a mesma sala. Presuma boa-fé e abra espaço para quem está começando.',
          en: 'Different ages, schools, levels of experience, genders, races, religions, bodies, sexual orientations and neurotypes share the same room. Assume good faith and make room for people who are new.'
        },
        {
          kind: 'p',
          pt: 'Ajude antes de se exibir',
          en: 'Help before showing off'
        },
        {
          kind: 'p',
          pt: 'Se você já sabe algo, ensine. Nenhuma pergunta é básica demais e ninguém deve ser feito de atrasado.',
          en: 'If you already know something, teach it. Nobody\'s question is too basic, and no one should be made to feel behind.'
        },
        {
          kind: 'p',
          pt: 'Respeite limites e consentimento',
          en: 'Respect boundaries and consent'
        },
        {
          kind: 'p',
          pt: 'Pergunte antes de tocar em pessoas ou nas coisas delas, antes de fotografar ou gravar alguém e antes de divulgar o trabalho ou o contato de outra pessoa.',
          en: 'Ask before touching people or their belongings, before photographing or recording someone, and before sharing anyone\'s work or contact details.'
        },
        {
          kind: 'p',
          pt: 'Siga as regras do local e as orientações da organização',
          en: 'Follow the venue rules and the organizers'
        },
        {
          kind: 'p',
          pt: 'Os locais nos recebem como convidados. Respeite espaços, horários, equipamentos e a equipe do local, e siga as orientações da organização e dos adultos responsáveis.',
          en: 'Venues host us as guests. Respect their spaces, schedules, equipment and staff, and follow instructions from organizers and supervising adults.'
        },
        {
          kind: 'p',
          pt: 'Cuide de você',
          en: 'Take care of yourself'
        },
        {
          kind: 'p',
          pt: 'Coma, beba água, durma e faça pausas. Um hackathon não é uma competição de quem aguenta mais sofrimento.',
          en: 'Eat, drink water, sleep and take breaks. A hackathon is not a competition of who can suffer the most.'
        }
      ]
    },
    {
      id: 'inaceitavel',
      blocks: [
        {
          kind: 'h2',
          pt: 'Comportamento inaceitável',
          en: 'Unacceptable behavior'
        },
        {
          kind: 'p',
          pt: 'O que segue não é tolerado em nenhum espaço do Hack SP, presencial ou online:',
          en: 'The following is not tolerated in any Hack SP space, in person or online:'
        },
        {
          kind: 'li',
          pt: 'Assédio, intimidação, perseguição ou insistência em contato indesejado.',
          en: 'Harassment, intimidation, stalking or unwanted persistent contact.'
        },
        {
          kind: 'li',
          pt: 'Comentários e piadas discriminatórios, racistas, sexistas, homofóbicos, transfóbicos, capacitistas ou de intolerância religiosa.',
          en: 'Discriminatory, racist, sexist, homophobic, transphobic, ableist or religiously intolerant comments and jokes.'
        },
        {
          kind: 'li',
          pt: 'Investidas sexuais, comentários de teor sexual ou conteúdo sexual de qualquer tipo — lembre-se de que a maioria dos participantes é menor de idade.',
          en: 'Sexual advances, sexual comments or sexual content of any kind — remember that most of our participants are minors.'
        },
        {
          kind: 'li',
          pt: 'Ameaças ou incitação à violência, incluindo piadas sobre armas ou ataques.',
          en: 'Threats or incitement of violence, including jokes about weapons or attacks.'
        },
        {
          kind: 'li',
          pt: 'Divulgar informações privadas de alguém sem permissão.',
          en: 'Publishing private information about someone without their permission.'
        },
        {
          kind: 'li',
          pt: 'Álcool, tabaco, outras drogas ou comparecer a um evento sob efeito delas.',
          en: 'Alcohol, tobacco, other drugs or coming to an event under their effect.'
        },
        {
          kind: 'li',
          pt: 'Danificar, furtar ou mexer em dispositivos, projetos, contas de outras pessoas ou no patrimônio do local.',
          en: 'Damaging, stealing or tampering with other people\'s devices, projects, accounts or the venue\'s property.'
        },
        {
          kind: 'li',
          pt: 'Acesso não autorizado a sistemas, redes ou dados — inclusive nossos. Se encontrar uma vulnerabilidade, avise a organização.',
          en: 'Unauthorized access to systems, networks or data — including our own. If you find a vulnerability, report it to the organizers.'
        },
        {
          kind: 'li',
          pt: 'Atrapalhar de forma insistente palestras, workshops, apresentações ou o trabalho de outros times.',
          en: 'Sustained disruption of talks, workshops, demos or the work of other teams.'
        }
      ]
    },
    {
      id: 'menores',
      blocks: [
        {
          kind: 'h2',
          pt: 'Menores de idade e segurança',
          en: 'Minors and safety'
        },
        {
          kind: 'p',
          pt: 'Nossos eventos são feitos para estudantes do Ensino Médio, então a maioria dos participantes tem menos de 18 anos. Todo evento tem supervisão de adultos, e adultos que atuam com a gente — mentores, voluntários, parceiros e equipe — aceitam regras mais rígidas: nada de contato privado individual com menores fora dos canais oficiais, nada de pedir contato pessoal a participantes e nada de fotos ou gravações sem autorização do participante e, quando exigido, do responsável.',
          en: 'Our events are made for high school students, so most participants are under 18. Every event has adult supervision, and adults who work with us — mentors, volunteers, partners and staff — accept stricter rules: no private one-on-one contact with a minor outside official channels, no asking participants for personal contact details, and no photographs or recordings without permission from the participant and, when required, their guardian.'
        },
        {
          kind: 'p',
          pt: 'Responsáveis podem falar com a gente a qualquer momento para saber como o evento vai funcionar, quem estará presente e como os dados são tratados.',
          en: 'Guardians can contact us at any time to ask how an event will run, who will be present and how their data is handled.'
        }
      ]
    },
    {
      id: 'projetos',
      blocks: [
        {
          kind: 'h2',
          pt: 'Projetos e fair play',
          en: 'Projects and fair play'
        },
        {
          kind: 'p',
          pt: 'Construa seu projeto durante o evento e seja honesto sobre o que usou. Bibliotecas open source, templates, ferramentas de IA e código que você escreveu antes são permitidos quando você deixa isso claro na apresentação. Apresentar o trabalho de outra pessoa como seu, não.',
          en: 'Build your project during the event, and be honest about what you used. Open-source libraries, templates, AI tools and code you wrote before are fine when you say so clearly in your demo. Presenting someone else\'s work as your own is not.'
        },
        {
          kind: 'p',
          pt: 'Projetos não podem atacar, assediar ou colocar ninguém em risco, e devem respeitar as licenças e os termos daquilo que usam como base.',
          en: 'Projects must not attack, harass or endanger anyone, and must respect the licenses and terms of what they build on.'
        }
      ]
    },
    {
      id: 'denuncia',
      blocks: [
        {
          kind: 'h2',
          pt: 'Como denunciar',
          en: 'How to report'
        },
        {
          kind: 'p',
          pt: 'Se algo acontecer com você, ou se você vir algo acontecendo com outra pessoa, nos avise. Durante um evento, procure qualquer pessoa da organização — usamos identificação e estamos ali para isso. Fora do evento, escreva para a gente.',
          en: 'If something happens to you, or you see something happening to someone else, tell us. At an event, look for any organizer — we wear identification and we are there for this. Outside an event, write to us.'
        },
        {
          kind: 'p',
          pt: 'Canal confidencial de denúncia',
          en: 'Confidential reporting channel'
        },
        {
          kind: 'p',
          pt: 'As denúncias são lidas apenas pelo time organizador. Mantemos a identidade de quem denuncia em sigilo, nunca retaliamos e respondemos o mais rápido possível. Em uma emergência, ligue primeiro para 190 (polícia) ou 192 (ambulância) — depois nos avise.',
          en: 'Reports are read only by the organizing team. We keep the identity of whoever reports confidential, we never retaliate, and we answer as soon as possible. In an emergency, call 190 (police) or 192 (ambulance) first — then tell us.'
        },
        {
          kind: 'p',
          pt: 'Você também pode reportar qualquer coisa que envolva espaços do Hack Club ou nosso patrocinador fiscal diretamente ao Hack Club.',
          en: 'You can also report anything involving Hack Club spaces or our fiscal sponsor directly to Hack Club.'
        }
      ]
    },
    {
      id: 'consequencias',
      blocks: [
        {
          kind: 'h2',
          pt: 'Consequências',
          en: 'Consequences'
        },
        {
          kind: 'p',
          pt: 'A organização decide caso a caso, e nos preocupamos mais em proteger as pessoas do que em ser leniente. Dependendo do que aconteceu, a resposta pode ser:',
          en: 'Organizers decide what to do case by case, and we care more about protecting people than about being lenient. Depending on what happened, the response may be:'
        },
        {
          kind: 'li',
          pt: 'Uma conversa reservada e um pedido para parar.',
          en: 'A private conversation and a request to stop.'
        },
        {
          kind: 'li',
          pt: 'Uma advertência formal, com registro do ocorrido.',
          en: 'A formal warning, with the incident recorded.'
        },
        {
          kind: 'li',
          pt: 'Remoção da atividade, do local ou do espaço online.',
          en: 'Removal from the activity, the venue or the online space.'
        },
        {
          kind: 'li',
          pt: 'Desclassificação de um projeto ou de um time.',
          en: 'Disqualification of a project or a team.'
        },
        {
          kind: 'li',
          pt: 'Proibição de participar de eventos futuros do Hack SP e, quando necessário, contato com responsáveis, escola, local ou autoridades.',
          en: 'A ban from future Hack SP events, and, when necessary, contact with guardians, the school, the venue or the authorities.'
        }
      ]
    },
    {
      id: 'creditos',
      blocks: [
        {
          kind: 'h2',
          pt: 'Créditos e atualizações',
          en: 'Credits and updates'
        },
        {
          kind: 'p',
          pt: 'Este código de conduta é adaptado do Código de Conduta do Hack Club, nosso patrocinador fiscal, com acréscimos específicos para os eventos do Hack SP no Brasil. É um documento vivo: conforme nossos eventos crescem, ele muda. Sugestões são bem-vindas — abra uma issue no nosso repositório ou escreva para a gente.',
          en: 'This code of conduct is adapted from the Hack Club Code of Conduct, our fiscal sponsor, with additions specific to Hack SP events in Brazil. It is a living document: as our events grow, it changes. Suggestions are welcome — open an issue in our repository or write to us.'
        },
        {
          kind: 'p',
          pt: 'Última atualização: agosto de 2026',
          en: 'Last updated: August 2026'
        }
      ]
    }
  ]
};

export const termsDocument: LegalDocument = {
  eyebrow: {
    en: 'Privacy and terms',
    pt: 'Privacidade e termos'
  },
  title: {
    en: 'Privacy policy and terms of use',
    pt: 'Política de privacidade e termos de uso'
  },
  lead: {
    en: 'Plain-language version: we only collect what we need to run our hackathons, we never sell your data, and most of our participants are minors — so we treat their information with extra care. The full text is below.',
    pt: 'Versão em português claro: só coletamos o que precisamos para realizar nossos hackathons, nunca vendemos seus dados e a maioria dos nossos participantes é menor de idade — então tratamos essas informações com cuidado extra. O texto completo está abaixo.'
  },
  nav: [
    {
      label: {
        en: 'Privacy',
        pt: 'Privacidade'
      },
      links: [
        {
          en: 'What we collect',
          pt: 'O que coletamos',
          href: '#coleta'
        },
        {
          en: 'How we use it',
          pt: 'Como usamos',
          href: '#uso'
        },
        {
          en: 'Who we share it with',
          pt: 'Com quem compartilhamos',
          href: '#compartilhamento'
        },
        {
          en: 'Data of minors',
          pt: 'Dados de menores',
          href: '#menores'
        },
        {
          en: 'Your rights',
          pt: 'Seus direitos',
          href: '#direitos'
        },
        {
          en: 'Security and retention',
          pt: 'Segurança e retenção',
          href: '#seguranca'
        }
      ]
    },
    {
      label: {
        en: 'Terms',
        pt: 'Termos'
      },
      links: [
        {
          en: 'Using the site',
          pt: 'Uso do site',
          href: '#uso-site'
        },
        {
          en: 'Taking part in events',
          pt: 'Participação nos eventos',
          href: '#eventos'
        },
        {
          en: 'Photos and content',
          pt: 'Fotos e conteúdo',
          href: '#conteudo'
        },
        {
          en: 'Your projects and our code',
          pt: 'Seus projetos e nosso código',
          href: '#propriedade'
        },
        {
          en: 'Limits and changes',
          pt: 'Limites e mudanças',
          href: '#limites'
        },
        {
          en: 'Contact',
          pt: 'Contato',
          href: '#contato'
        }
      ]
    }
  ],
  sections: [
    {
      id: 'coleta',
      blocks: [
        {
          kind: 'h2',
          pt: 'O que coletamos',
          en: 'What we collect'
        },
        {
          kind: 'p',
          pt: 'Quando você se inscreve em um evento ou nas nossas novidades, pedimos: nome, e-mail, telefone, data de nascimento, escola ou instituição, série e — dependendo do perfil — os dados do responsável ou da organização. Se algum formulário pedir mais que isso, o próprio campo explica o motivo.',
          en: 'When you register for an event or subscribe to our updates, we ask for: name, e-mail, phone, date of birth, school or institution, grade, and — depending on the profile — the guardian\'s details or the organization\'s data. If a form asks for anything else, the field itself says why.'
        },
        {
          kind: 'p',
          pt: 'No site em si somos mínimos: não usamos rastreadores de publicidade e não montamos perfis sobre você. Registros técnicos básicos (como a página acessada e o horário) podem existir para segurança e estabilidade.',
          en: 'On the website itself we keep it minimal: we do not use advertising trackers, and we do not build profiles about you. Basic technical logs (like the page requested and the time) may exist for security and reliability.'
        }
      ]
    },
    {
      id: 'uso',
      blocks: [
        {
          kind: 'h2',
          pt: 'Como usamos',
          en: 'How we use it'
        },
        {
          kind: 'li',
          pt: 'Para organizar eventos: listas de inscrição, check-in, alimentação, times, mentores e segurança.',
          en: 'To organize events: registration lists, check-in, food, teams, mentors and safety.'
        },
        {
          kind: 'li',
          pt: 'Para falar com você sobre o hackathon em que se inscreveu e sobre os próximos.',
          en: 'To contact you about the hackathon you signed up for, and about the next ones.'
        },
        {
          kind: 'li',
          pt: 'Para entrar em contato com o responsável quando o participante tem menos de 18 anos.',
          en: 'To contact a guardian when the participant is under 18.'
        },
        {
          kind: 'li',
          pt: 'Para reportar números agregados (quantas pessoas participaram, quantos projetos) ao nosso patrocinador fiscal e apoiadores — nunca com dados individuais.',
          en: 'To report aggregate numbers (how many people took part, how many projects) to our fiscal sponsor and supporters — never with individual data.'
        },
        {
          kind: 'p',
          pt: 'Nunca vendemos seus dados e não os usamos para publicidade.',
          en: 'We never sell your data, and we do not use it for advertising.'
        }
      ]
    },
    {
      id: 'compartilhamento',
      blocks: [
        {
          kind: 'h2',
          pt: 'Com quem compartilhamos',
          en: 'Who we share it with'
        },
        {
          kind: 'p',
          pt: 'Só com quem precisa para o evento acontecer: nosso patrocinador fiscal Hack Club e sua plataforma financeira HCB, o local que recebe o evento (normalmente uma lista de nomes para entrada) e prestadores de serviço que usamos para enviar e-mails e guardar inscrições. Eles só podem usar os dados para essa finalidade.',
          en: 'Only with who needs it to make an event happen: our fiscal sponsor Hack Club and its finance platform HCB, the venue hosting the event (usually a name list for entry), and service providers we use to send e-mail and store registrations. They may only use the data for that purpose.'
        },
        {
          kind: 'p',
          pt: 'Também podemos compartilhar informações quando a lei exigir ou quando for necessário para proteger a segurança de alguém.',
          en: 'We may also share information when the law requires it, or when it is necessary to protect someone\'s safety.'
        }
      ]
    },
    {
      id: 'menores',
      blocks: [
        {
          kind: 'h2',
          pt: 'Dados de menores',
          en: 'Data of minors'
        },
        {
          kind: 'p',
          pt: 'A maioria dos nossos participantes tem menos de 18 anos. Inscrições de menores exigem consentimento do responsável, e o responsável pode, a qualquer momento, pedir para ver, corrigir ou excluir os dados do filho. Coletamos o mínimo necessário e não usamos dados de menores para nada além de organizar e realizar os eventos.',
          en: 'Most of our participants are under 18. Registrations of minors require a guardian\'s consent, and the guardian can ask at any time to see, correct or delete their child\'s data. We collect the minimum necessary and we do not use minors\' data for anything beyond organizing and running the events.'
        }
      ]
    },
    {
      id: 'direitos',
      blocks: [
        {
          kind: 'h2',
          pt: 'Seus direitos',
          en: 'Your rights'
        },
        {
          kind: 'p',
          pt: 'Pela Lei Geral de Proteção de Dados (LGPD) você pode pedir a confirmação do que temos sobre você, a correção, a exclusão, a portabilidade dos dados, ou a interrupção das nossas mensagens. Escreva para contact@hacksp.org e respondemos em um prazo razoável — normalmente alguns dias.',
          en: 'Under Brazilian data protection law (LGPD) you can ask us to confirm what we hold about you, to correct it, to delete it, to export it, or to stop sending you messages. Write to contact@hacksp.org and we answer within a reasonable time — usually a few days.'
        },
        {
          kind: 'p',
          pt: 'Todo e-mail que enviamos também tem um link para cancelar a inscrição.',
          en: 'Every e-mail we send also carries an unsubscribe link.'
        }
      ]
    },
    {
      id: 'seguranca',
      blocks: [
        {
          kind: 'h2',
          pt: 'Segurança e retenção',
          en: 'Security and retention'
        },
        {
          kind: 'p',
          pt: 'O acesso aos dados de inscrição é restrito às pessoas da organização que precisam deles. Guardamos as inscrições enquanto o projeto estiver ativo e enquanto elas servirem para convidar você a eventos futuros; se você pedir a exclusão, excluímos, mantendo apenas o que a lei ou a contabilidade exigem.',
          en: 'Access to registration data is restricted to the organizers who need it. We keep registrations while the project is active and while they are useful to invite you to future events; if you ask us to delete them, we delete them, keeping only what the law or our accounting requires.'
        }
      ]
    },
    {
      id: 'uso-site',
      blocks: [
        {
          kind: 'h2',
          pt: 'Uso do site',
          en: 'Using the site'
        },
        {
          kind: 'p',
          pt: 'Este site é oferecido como está, de graça, para que as pessoas conheçam o Hack SP e participem dos nossos eventos. Não use o site para infringir a lei, atacar nossos sistemas ou de terceiros, nem para enviar informações que não são suas.',
          en: 'This website is offered as is, for free, so people can learn about Hack SP and take part in our events. Do not use it to break the law, to attack our systems or anyone else\'s, or to submit information that is not yours to submit.'
        },
        {
          kind: 'p',
          pt: 'Se encontrar uma vulnerabilidade, avise em contact@hacksp.org antes de divulgar — e, se você quiser, agradecemos publicamente.',
          en: 'If you find a vulnerability, tell us at contact@hacksp.org before telling anyone else — we will thank you publicly if you want us to.'
        }
      ]
    },
    {
      id: 'eventos',
      blocks: [
        {
          kind: 'h2',
          pt: 'Participação nos eventos',
          en: 'Taking part in events'
        },
        {
          kind: 'p',
          pt: 'Inscrever-se em um evento significa aceitar nosso código de conduta e as regras do local, e que as informações enviadas são verdadeiras. Participantes com menos de 18 anos precisam de autorização do responsável, que enviamos por e-mail depois da inscrição.',
          en: 'Registering for an event means you accept our code of conduct and the venue\'s rules, and that the information you gave us is true. Participants under 18 need a guardian\'s authorization, which we send by e-mail after registration.'
        },
        {
          kind: 'p',
          pt: 'As vagas podem ser limitadas. Podemos cancelar, remarcar ou mudar o formato de um evento — se isso acontecer, avisamos todas as pessoas inscritas por e-mail.',
          en: 'Spots may be limited. We may cancel, reschedule or change the format of an event — if that happens, we tell everyone registered by e-mail.'
        }
      ]
    },
    {
      id: 'conteudo',
      blocks: [
        {
          kind: 'h2',
          pt: 'Fotos e conteúdo',
          en: 'Photos and content'
        },
        {
          kind: 'p',
          pt: 'Fotografamos e gravamos nossos eventos para mostrar o que acontece neles. Se você (ou seu responsável) não quiser aparecer, avise na inscrição ou no evento — respeitamos, sem precisar explicar.',
          en: 'We photograph and record our events to show what happens there. If you (or your guardian) do not want you in our photos, tell us at registration or at the event — we respect it, no explanation needed.'
        }
      ]
    },
    {
      id: 'propriedade',
      blocks: [
        {
          kind: 'h2',
          pt: 'Seus projetos e nosso código',
          en: 'Your projects and our code'
        },
        {
          kind: 'p',
          pt: 'O que você constrói em um hackathon é seu. Podemos mostrar o projeto — nome, imagens, uma descrição curta — quando falarmos sobre o evento, e você pode pedir a remoção a qualquer momento.',
          en: 'What you build at a hackathon is yours. We may show your project — name, screenshots, a short description — when talking about the event, and you can ask us to take it down at any time.'
        },
        {
          kind: 'p',
          pt: 'O código deste site é público no GitHub. O nome, o logo e as marcas do Hack SP pertencem ao projeto: use-os para falar sobre nós, não para sugerir um apoio que não existe.',
          en: 'This website\'s source code is public on GitHub. The Hack SP name, logo and brand marks belong to the project: use them to talk about us, not to suggest we endorse something we don\'t.'
        }
      ]
    },
    {
      id: 'limites',
      blocks: [
        {
          kind: 'h2',
          pt: 'Limites e mudanças',
          en: 'Limits and changes'
        },
        {
          kind: 'p',
          pt: 'O Hack SP é uma iniciativa voluntária, liderada por estudantes e com patrocínio fiscal do Hack Club. Fazemos o possível para realizar eventos seguros e bem organizados, mas não podemos garantir que o site estará sempre online ou que um evento ocorrerá exatamente como anunciado.',
          en: 'Hack SP is a volunteer, student-led initiative, fiscally sponsored by Hack Club. We do everything we can to run safe, well-organized events, but we cannot guarantee the site will be always online or that an event will happen exactly as announced.'
        },
        {
          kind: 'p',
          pt: 'Estes documentos mudam conforme o projeto cresce. Quando mudarmos algo importante, atualizamos a data abaixo e avisamos os inscritos por e-mail.',
          en: 'These documents change as the project grows. When we change something important, we update the date below and tell subscribers by e-mail.'
        }
      ]
    },
    {
      id: 'contato',
      blocks: [
        {
          kind: 'h2',
          pt: 'Contato',
          en: 'Contact'
        },
        {
          kind: 'p',
          pt: 'Dúvidas sobre seus dados, sobre esta página ou qualquer outra coisa:',
          en: 'Questions about your data, this page, or anything else:'
        },
        {
          kind: 'p',
          pt: 'Última atualização: agosto de 2026',
          en: 'Last updated: August 2026'
        }
      ]
    }
  ]
};
