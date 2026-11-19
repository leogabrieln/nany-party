// ─────────────────────────────────────────────────────────────
//  Dados da festa — edite aqui para personalizar o site
// ─────────────────────────────────────────────────────────────
const base = import.meta.env.BASE_URL || '/'
export const img = (path) => `${base}img/${path}`

export const event = { name: 'Nany' }

// Cole aqui o link da playlist do Spotify (ex.: https://open.spotify.com/playlist/XXXXXXXX)
export const spotifyUrl = ''

export const experiences = [
  { path: '/mural', number: '01', label: 'Mural', title: 'Mural de recados', description: 'deixa um recado e uma foto pra Nany', color: 'yellow', art: 'convite/butterfly.png' },
  { path: '/quiz', number: '02', label: 'Quiz', title: 'Quem conhece a Nany?', description: 'responde, sobe no ranking e prova que é amigo', color: 'orange', art: 'convite/bolt.png' },
  { path: '/cabine', number: '03', label: 'Cabine', title: 'Cabine de fotos', description: 'tira foto com efeito e ganha uma polaroid', color: 'blue', art: 'convite/camera.png' },
  { path: '/trilha', number: '04', label: 'Trilha', title: 'A trilha da festa', description: 'a playlist oficial da festa no Spotify', color: 'green', art: 'convite/disco.png' },
  { path: '/album', number: '05', label: 'Álbum', title: 'Álbum da festa', description: 'todas as polaroids da galera', color: 'silver', art: 'convite/puppy.png' },
]

export const nanyPics = ['n1', 'n2', 'n3', 'n4', 'n5', 'n6', 'n7', 'n8'].map(n => img(`nany/${n}.png`))

// Perguntas do quiz — troque/adicione as suas! `answer` é o índice (começando em 0) da opção correta.
export const quizQuestions = [
  { question: 'Qual o dia oficial em que eu nasci?', options: ['11 de novembro', '20 de novembro', '10 de novembro', '17 de novembro'], answer: 2 },
  { question: 'Qual bebida seria ideal para acompanhar uma refeição', options: ['Água', 'Coca-Cola Zero', 'Suco de Laranja', 'Sprite'], answer: 0 },
  { question: 'Qual os nomes dos meus cachorros?', options: ['Luna e Luck', 'Nina e Mike', 'Hanna e Luck', 'Luna e Mike'], answer: 2 },
  { question: 'Qual meu curso no Senai?', options: ['Mecânica', 'Mecatrônica', 'Elétrica', 'Eletromecânica'], answer: 3 },
  { question: 'Qual curso da faculdade eu gostaria de fazer?', options: ['Engenharia de Automação', 'Engenharia de Produção', 'Engenharia da Pesca', 'Engenharia de Software'], answer: 0 },
  { question: 'Se eu ganhasse uma passagem de avião agora, para onde eu iria?', options: ['Nova Iorque', 'França', 'Itália', 'Canadá'], answer: 2},
  { question: 'Se eu pudesse ter 2 carros na garagem, quais seriam?', options: ['BMW e Ferrari', 'Fusca e Porsche', 'Mustang e Lamborghini', 'Camaro e Tesla'], answer: 1 },
  { question: 'Como costumo demostrar que gosto de alguém?', options: ['Com presentes', 'Com palavras', 'Passando tempo junto', 'Com atitudes'], answer: 2 },
  { question: 'Qual profissão eu queria seguir na infância?', options: ['Professora', 'Veterinária', 'Estilista', 'Arquiteta'], answer: 1 },
  { question: 'Em qual setor eu atuo no meu trabalho?', options: ['Administração', 'Manutenção', 'Ferramentaria', 'Recursos Humanos'], answer: 2 },
]
