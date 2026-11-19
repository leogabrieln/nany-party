
import { img } from '../data'

/* ═══════════════════════════════════════════════════════════
   CABINE DE FOTOS — EFEITOS E PROCESSAMENTO
   Prévia CSS + processamento Canvas + exportação JPEG.
   ═══════════════════════════════════════════════════════════ */

export const ASSETS = {
  star1: 'convite/star1.png',
  star3: 'convite/star3.png',
  star4: 'convite/star4.png',
  hat: 'convite/hat.png',
  disco: 'convite/disco.png',
  butterfly: 'convite/butterfly.png',
  camera: 'convite/camera.png',
  bolt: 'convite/bolt.png',
  puppy: 'convite/puppy.png',
}

const STARS = [
  { src: 'star1', x: 0.05, y: 0.07, w: 0.11, r: -10 },
  { src: 'star3', x: 0.83, y: 0.13, w: 0.09, r: 12 },
  { src: 'star4', x: 0.08, y: 0.78, w: 0.09, r: 8 },
  { src: 'star1', x: 0.84, y: 0.75, w: 0.11, r: -6 },
]

const HAT = {
  src: 'hat',
  x: 0.5,
  y: -0.09,
  w: 0.24,
  r: 12,
}


const HEARTS = [
  { src: 'star1', x: 0.08, y: 0.12, w: 0.12, r: -15 },
  { src: 'star3', x: 0.78, y: 0.08, w: 0.14, r: 12 },
  { src: 'star4', x: 0.12, y: 0.72, w: 0.13, r: 8 },
  { src: 'star1', x: 0.8, y: 0.76, w: 0.12, r: -8 },
]

const PARTY = [
  ...confetti(45, 32),
  HAT,
  { src: 'star3', x: 0.08, y: 0.12, w: 0.13, r: 10 },
  { src: 'star4', x: 0.8, y: 0.68, w: 0.14, r: -12 },
]

const DREAMY = [
  ...HEARTS,
  { src: 'butterfly', x: 0.78, y: 0.12, w: 0.17, r: 15 },
  { src: 'butterfly', x: 0.04, y: 0.66, w: 0.16, r: -15 },
]

const RETRO = [
  { src: 'camera', x: 0.75, y: 0.73, w: 0.22, r: -8 },
  { src: 'star1', x: 0.06, y: 0.08, w: 0.13, r: 10 },
  { src: 'bolt', x: 0.8, y: 0.08, w: 0.13, r: 10 },
]


/* ── confetes ── */

function confetti(n, seed) {
  const colors = [
    '#ff4fa3',
    '#ffd43b',
    '#5fd36b',
    '#7db5ff',
    '#ff8a1f',
    '#ffffff',
    '#c9b6ff',
  ]

  let s = seed

  const rnd = () => {
    s = (s * 16807) % 2147483647
    return s / 2147483647
  }

  return Array.from({ length: n }, () => ({
    type: 'rect',
    x: rnd() * 0.96,
    y: rnd() * 0.96,
    w: 0.025 + rnd() * 0.02,
    ar: 0.5 + rnd() * 0.8,
    r: Math.round(rnd() * 360),
    color: colors[Math.floor(rnd() * colors.length)],
  }))
}

/* ── vazamento de luz ── */

export const LEAK_STOPS = [
  [0, 'rgba(255,60,140,0)'],
  [0.22, 'rgba(255,60,140,.75)'],
  [0.42, 'rgba(255,214,0,.65)'],
  [0.6, 'rgba(60,255,170,.55)'],
  [0.8, 'rgba(40,140,255,.75)'],
  [1, 'rgba(120,60,255,0)'],
]

/* ═══════════════════════════════════════════════════════════
   COLEÇÃO DE EFEITOS
   ═══════════════════════════════════════════════════════════ */

export const EFFECTS = [
  {
    id: 'natural',
    label: 'Original',
    emoji: '📷',
    swatch: '#cfd8e8',
  },
  {
    id: 'instant',
    label: 'Polaroid',
    emoji: '📸',
    swatch: '#d9bd91',
    filter: {
      sepia: 0.12,
      warmth: 12,
      saturate: 0.88,
      brightness: 1.08,
      contrast: 0.92,
      fade: 0.16,
    },
    tint: {
      color: '#f5d9ad',
      alpha: 0.16,
      mode: 'soft-light',
    },
    vignette: 0.25,
  },
  {
    id: 'silver',
    label: 'Prata',
    emoji: '🪩',
    swatch: '#aebdd2',
    filter: {
      gray: 1,
      contrast: 1.22,
      brightness: 1.1,
      shadows: 0.12,
    },
    tint: {
      color: '#a9c9ef',
      alpha: 0.2,
      mode: 'soft-light',
    },
    vignette: 0.25,
    items: STARS,
  },
  {
    id: 'confete',
    label: 'Confete',
    emoji: '🎉',
    swatch: '#ffd43b',
    filter: {
      saturate: 1.25,
      brightness: 1.05,
    },
    items: confetti(60, 21),
  },
  {
    id: 'vivid',
    label: 'Vívido',
    emoji: '🌈',
    swatch: '#ff6b8a',
    filter: {
      saturate: 1.45,
      vibrance: 0.35,
      contrast: 1.08,
      brightness: 1.04,
    },
  },
  {
    id: 'warm',
    label: 'Dourado',
    emoji: '☀️',
    swatch: '#e9a45b',
    filter: {
      warmth: 24,
      saturate: 1.12,
      brightness: 1.08,
      highlights: 0.12,
    },
    tint: {
      color: '#ffbd69',
      alpha: 0.12,
      mode: 'soft-light',
    },
  },
  {
    id: 'cool',
    label: 'Gelado',
    emoji: '🧊',
    swatch: '#8ab9e8',
    filter: {
      warmth: -22,
      saturate: 0.92,
      contrast: 1.08,
      brightness: 1.04,
    },
    tint: {
      color: '#8dbfff',
      alpha: 0.16,
      mode: 'soft-light',
    },
  },
  {
    id: 'portrait',
    label: 'Retrato',
    emoji: '✨',
    swatch: '#f3c5ad',
    filter: {
      brightness: 1.08,
      contrast: 0.94,
      shadows: 0.28,
      highlights: -0.12,
      vibrance: 0.18,
    },
    tint: {
      color: '#ffd8c2',
      alpha: 0.13,
      mode: 'soft-light',
    },
    vignette: 0.18,
  },
  {
    id: 'soft',
    label: 'Soft',
    emoji: '🌸',
    swatch: '#f5b9d2',
    filter: {
      brightness: 1.12,
      contrast: 0.86,
      saturate: 0.88,
      fade: 0.12,
      warmth: 8,
    },
    tint: {
      color: '#ffd6e7',
      alpha: 0.18,
      mode: 'soft-light',
    },
  },
  {
    id: 'dramatic',
    label: 'Dramático',
    emoji: '🎬',
    swatch: '#38445c',
    filter: {
      contrast: 1.35,
      saturate: 1.12,
      brightness: 0.94,
      shadows: -0.12,
      highlights: -0.2,
    },
    vignette: 0.52,
  },
  {
    id: 'matte',
    label: 'Fosco',
    emoji: '🪞',
    swatch: '#a7b5aa',
    filter: {
      contrast: 0.9,
      fade: 0.28,
      saturate: 0.82,
      shadows: 0.18,
      brightness: 1.04,
    },
  },
  {
    id: 'vintage',
    label: 'Vintage',
    emoji: '📼',
    swatch: '#c28b59',
    filter: {
      sepia: 0.25,
      warmth: 16,
      saturate: 1.18,
      contrast: 0.94,
      fade: 0.12,
    },
    tint: {
      color: '#e6a45e',
      alpha: 0.2,
      mode: 'soft-light',
    },
    vignette: 0.42,
  },
  
  
  {
    id: 'pink',
    label: 'Rosa chiclete',
    emoji: '💗',
    swatch: '#ff4fa3',
    filter: {
      saturate: 1.3,
      vibrance: 0.25,
      brightness: 1.06,
      warmth: 8,
    },
    tint: {
      color: '#ff65ad',
      alpha: 0.25,
      mode: 'soft-light',
    },
    items: STARS,
  },
  {
    id: 'disco',
    label: 'Globo disco',
    emoji: '✨',
    swatch: 'conic-gradient(#ff4fa3,#ffd43b,#5fd36b,#7db5ff,#ff4fa3)',
    filter: {
      saturate: 1.5,
      contrast: 1.1,
    },
    leak: true,
    vignette: 0.3,
    items: [
      { src: 'disco', x: 0.6, y: -0.14, w: 0.44, r: 0 },
      STARS[2],
      STARS[3],
    ],
  },
  {
    id: 'festa',
    label: 'Chapéu de festa',
    emoji: '🥳',
    swatch: '#ff4fa3',
    filter: {
      saturate: 1.2,
    },
    items: [...confetti(30, 7), HAT],
  },
  

]

/* ═══════════════════════════════════════════════════════════
   MATRIZES DE CORES
   ═══════════════════════════════════════════════════════════ */

export function cssFilter(f = {}) {
  const parts = []

  if (f.sepia) parts.push(`sepia(${f.sepia})`)
  if (f.gray) parts.push(`grayscale(${f.gray})`)
  if (f.saturate) parts.push(`saturate(${f.saturate})`)
  if (f.contrast) parts.push(`contrast(${f.contrast})`)

  const brightness =
    (f.brightness ?? 1) * Math.pow(2, f.exposure ?? 0)

  if (brightness !== 1) {
    parts.push(`brightness(${brightness})`)
  }

  return parts.join(' ') || 'none'
}

const mul = (A, B) =>
  A.map((_, i) =>
    [0, 1, 2].map(j =>
      A[i][0] * B[0][j] +
      A[i][1] * B[1][j] +
      A[i][2] * B[2][j]
    )
  )

function colorMatrix(f) {
  let M = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ]

  if (f.sepia) {
    const a = 1 - f.sepia

    M = mul([
      [
        0.393 + 0.607 * a,
        0.769 - 0.769 * a,
        0.189 - 0.189 * a,
      ],
      [
        0.349 - 0.349 * a,
        0.686 + 0.314 * a,
        0.168 - 0.168 * a,
      ],
      [
        0.272 - 0.272 * a,
        0.534 - 0.534 * a,
        0.131 + 0.869 * a,
      ],
    ], M)
  }

  if (f.gray) {
    const a = 1 - f.gray

    M = mul([
      [
        0.2126 + 0.7874 * a,
        0.7152 - 0.7152 * a,
        0.0722 - 0.0722 * a,
      ],
      [
        0.2126 - 0.2126 * a,
        0.7152 + 0.2848 * a,
        0.0722 - 0.0722 * a,
      ],
      [
        0.2126 - 0.2126 * a,
        0.7152 - 0.7152 * a,
        0.0722 + 0.9278 * a,
      ],
    ], M)
  }

  if (f.saturate) {
    const s = f.saturate

    M = mul([
      [
        0.213 + 0.787 * s,
        0.715 - 0.715 * s,
        0.072 - 0.072 * s,
      ],
      [
        0.213 - 0.213 * s,
        0.715 + 0.285 * s,
        0.072 - 0.072 * s,
      ],
      [
        0.213 - 0.213 * s,
        0.715 - 0.715 * s,
        0.072 + 0.928 * s,
      ],
    ], M)
  }

  return M
}

/* ═══════════════════════════════════════════════════════════
   PROCESSAMENTO DA FOTOGRAFIA
   ═══════════════════════════════════════════════════════════ */

function applyFilter(ctx, size, f) {
  if (!f || !Object.keys(f).length) return

  const data = ctx.getImageData(0, 0, size, size)
  const px = data.data
  const M = colorMatrix(f)

  const clamp = v => Math.max(0, Math.min(255, v))

  const contrast = f.contrast ?? 1
  const brightness =
    (f.brightness ?? 1) * Math.pow(2, f.exposure ?? 0)

  const warmth = f.warmth ?? 0
  const shadows = f.shadows ?? 0
  const highlights = f.highlights ?? 0
  const fade = f.fade ?? 0
  const vibrance = f.vibrance ?? 0

  for (let i = 0; i < px.length; i += 4) {
    let r = px[i]
    let g = px[i + 1]
    let b = px[i + 2]

    // Matriz de cores
    let nr = M[0][0] * r + M[0][1] * g + M[0][2] * b
    let ng = M[1][0] * r + M[1][1] * g + M[1][2] * b
    let nb = M[2][0] * r + M[2][1] * g + M[2][2] * b

    // Exposição e brilho
    nr *= brightness
    ng *= brightness
    nb *= brightness

    // Temperatura
    nr += warmth
    ng += warmth * 0.12
    nb -= warmth

    // Sombras e realces
    const luminance = (
      nr * 0.2126 +
      ng * 0.7152 +
      nb * 0.0722
    ) / 255

    const shadowWeight = Math.pow(1 - luminance, 2)
    const highlightWeight = Math.pow(luminance, 2)

    const shadowAmount = shadows * 90 * shadowWeight
    const highlightAmount = highlights * 75 * highlightWeight

    nr += shadowAmount + highlightAmount
    ng += shadowAmount + highlightAmount
    nb += shadowAmount + highlightAmount

    // Vibração inteligente
    if (vibrance !== 0) {
      const gray = nr * 0.299 + ng * 0.587 + nb * 0.114
      const max = Math.max(nr, ng, nb)
      const min = Math.min(nr, ng, nb)
      const saturation = max === 0 ? 0 : (max - min) / max
      const amount = vibrance * (1 - saturation) * 1.5

      nr += (nr - gray) * amount
      ng += (ng - gray) * amount
      nb += (nb - gray) * amount
    }

    // Contraste
    nr = (nr - 127.5) * contrast + 127.5
    ng = (ng - 127.5) * contrast + 127.5
    nb = (nb - 127.5) * contrast + 127.5

    // Filme fosco
    if (fade > 0) {
      nr = nr * (1 - fade) + (nr * 0.82 + 28) * fade
      ng = ng * (1 - fade) + (ng * 0.82 + 28) * fade
      nb = nb * (1 - fade) + (nb * 0.82 + 28) * fade
    }

    px[i] = clamp(nr)
    px[i + 1] = clamp(ng)
    px[i + 2] = clamp(nb)
  }

  ctx.putImageData(data, 0, 0)
}

/* ═══════════════════════════════════════════════════════════
   CARREGAMENTO DOS ADESIVOS
   ═══════════════════════════════════════════════════════════ */

export function loadAssets() {
  return Promise.all(
    Object.entries(ASSETS).map(([key, path]) =>
      new Promise(resolve => {
        const im = new Image()

        im.onload = () => resolve([key, im])
        im.onerror = () => resolve([key, null])

        im.src = img(path)
      })
    )
  ).then(entries => Object.fromEntries(entries))
}

/* ═══════════════════════════════════════════════════════════
   CAMADAS VISUAIS
   ═══════════════════════════════════════════════════════════ */

function drawLayers(ctx, size, effect, assets) {
  if (effect.leak) {
    const g = ctx.createLinearGradient(0, 0, size, size)

    LEAK_STOPS.forEach(([p, col]) => {
      g.addColorStop(p, col)
    })

    ctx.save()
    ctx.globalCompositeOperation = 'screen'
    ctx.globalAlpha = 0.6
    ctx.fillStyle = g
    ctx.fillRect(0, 0, size, size)
    ctx.restore()
  }

  if (effect.tint) {
    ctx.save()
    ctx.globalCompositeOperation = effect.tint.mode
    ctx.globalAlpha = effect.tint.alpha
    ctx.fillStyle = effect.tint.color
    ctx.fillRect(0, 0, size, size)
    ctx.restore()
  }

  if (effect.vignette) {
    const g = ctx.createRadialGradient(
      size / 2,
      size / 2,
      size * 0.7071 * 0.55,
      size / 2,
      size / 2,
      size * 0.7071
    )

    g.addColorStop(0, 'rgba(0,0,0,0)')
    g.addColorStop(1, `rgba(0,0,0,${effect.vignette})`)

    ctx.fillStyle = g
    ctx.fillRect(0, 0, size, size)
  }

  for (const it of effect.items || []) {
    ctx.save()

    if (it.type === 'rect') {
      const w = it.w * size
      const h = w * it.ar

      ctx.translate(
        it.x * size + w / 2,
        it.y * size + h / 2
      )

      ctx.rotate(it.r * Math.PI / 180)
      ctx.fillStyle = it.color
      ctx.fillRect(-w / 2, -h / 2, w, h)
    } else {
      const im = assets[it.src]

      if (im) {
        const w = it.w * size
        const h = w * (im.naturalHeight / im.naturalWidth)

        ctx.translate(
          it.x * size + w / 2,
          it.y * size + h / 2
        )

        ctx.rotate(it.r * Math.PI / 180)

        ctx.shadowColor = 'rgba(0,0,0,.35)'
        ctx.shadowBlur = size * 0.012
        ctx.shadowOffsetY = size * 0.006

        ctx.drawImage(im, -w / 2, -h / 2, w, h)
      }
    }

    ctx.restore()
  }
}

/* ═══════════════════════════════════════════════════════════
   GERAÇÃO DA POLAROID
   ═══════════════════════════════════════════════════════════ */

const sizeOf = src => (
  src instanceof HTMLVideoElement
    ? [src.videoWidth, src.videoHeight]
    : [src.naturalWidth, src.naturalHeight]
)

export async function renderPolaroid({
  source,
  mirror,
  effect,
  name,
  assets,
}) {
  const PHOTO = 900
  const W = 1000
  const H = 1250
  const M = 50

  const photo = document.createElement('canvas')
  photo.width = photo.height = PHOTO

  const pctx = photo.getContext('2d', {
    willReadFrequently: true,
  })

  if (!pctx) {
    throw new Error('Não foi possível criar a fotografia.')
  }

  const [sw, sh] = sizeOf(source)

  if (!sw || !sh) {
    throw new Error('A câmera ainda não está pronta.')
  }

  // Recorte quadrado centralizado
  const side = Math.min(sw, sh)
  const sx = (sw - side) / 2
  const sy = (sh - side) / 2

  pctx.save()

  if (mirror) {
    pctx.translate(PHOTO, 0)
    pctx.scale(-1, 1)
  }

  pctx.drawImage(
    source,
    sx,
    sy,
    side,
    side,
    0,
    0,
    PHOTO,
    PHOTO
  )

  pctx.restore()

  // Aplica os ajustes de cor
  applyFilter(pctx, PHOTO, effect.filter)

  // Aplica os elementos decorativos
  drawLayers(pctx, PHOTO, effect, assets)

  // Aguarda a fonte da legenda
  try {
    await document.fonts.load('700 64px Caveat')
  } catch {
    // Usa fonte alternativa
  }

  // Monta a polaroid
  const out = document.createElement('canvas')
  out.width = W
  out.height = H

  const ctx = out.getContext('2d')

  if (!ctx) {
    throw new Error('Não foi possível montar a polaroid.')
  }

  // Papel com textura visual suave
  const paper = ctx.createLinearGradient(0, 0, W, H)

  paper.addColorStop(0, '#fdfcf8')
  paper.addColorStop(1, '#f1efe6')

  ctx.fillStyle = paper
  ctx.fillRect(0, 0, W, H)

  // Fotografia
  ctx.drawImage(photo, M, M)

  // Borda da fotografia
  ctx.strokeStyle = 'rgba(0,0,0,.12)'
  ctx.lineWidth = 3
  ctx.strokeRect(M, M, PHOTO, PHOTO)

  // Legenda
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = '#16275f'
  ctx.font = '700 70px Caveat, cursive'

  ctx.fillText(
    (name || '').slice(0, 24),
    W / 2,
    1065,
    W - 160
  )

  // Assinatura da festa
  ctx.fillStyle = '#5d6b95'
  ctx.font = '500 44px Caveat, cursive'

  ctx.fillText(
    'aniversário da Nany',
    W / 2,
    1140,
    W - 160
  )

  // Estrela decorativa
  if (assets.star1) {
    ctx.drawImage(
      assets.star1,
      W - 150,
      H - 150,
      80,
      80
    )
  }

  // Exportação JPEG
  return new Promise((resolve, reject) => {
    out.toBlob(
      blob => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Não foi possível gerar a foto.'))
        }
      },
      'image/jpeg',
      0.92
    )
  })
}
