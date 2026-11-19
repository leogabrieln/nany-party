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
  { question: 'Qual personagem aparece no maiô cor-de-rosa da Nany?', options: ['Marie (Aristogatas)', 'Hello Kitty', 'Minnie', 'Mulan'], answer: 0 },
  { question: 'Qual comida a Nany está devorando em uma das fotos?', options: ['Pipoca', 'Milho', 'Pastel', 'Melancia'], answer: 1 },
  { question: 'De que cores é a peruca que a Nany usa?', options: ['Rosa e roxo', 'Azul e prata', 'Verde e amarelo', 'Vermelho e laranja'], answer: 2 },
  { question: 'Que acessório a Nany adora usar nas fotos?', options: ['Luvas', 'Óculos escuros', 'Gravata', 'Bigode de mentira'], answer: 1 },
  { question: 'A camiseta amarela da Nany é de qual seleção?', options: ['Argentina', 'França', 'Portugal', 'Brasil'], answer: 3 },
  { question: 'Qual item brilhante é a cara do convite?', options: ['Bola de espelhos', 'Lustre', 'Estrela do mar', 'Árvore de Natal'], answer: 0 },
]
