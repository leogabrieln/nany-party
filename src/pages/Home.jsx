import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import Page from '../components/Page'
import Ransom from '../components/Ransom'
import Reveal from '../components/Reveal'
import { experiences, img, nanyPics } from '../data'

/* ───────────── 1. Capa ───────────── */
// Adesivo com parallax (wrapper) + flutuação CSS (imagem) para não haver conflito de transform
function Par({ cls, src, y, anim, r }) {
  return (
    <motion.div className={`par ${cls}`} style={{ y }}>
      <img src={src} alt="" className={`sticker-in ${anim}`} style={{ '--r': r }} />
    </motion.div>
  )
}

function Hero() {
  const { scrollY } = useScroll()
  const ballY = useTransform(scrollY, [0, 700], [0, 140])
  const ballRot = useTransform(scrollY, [0, 1200], [0, 200])
  const up = useTransform(scrollY, [0, 700], [0, -90])
  const down = useTransform(scrollY, [0, 700], [0, 110])
  const fade = useTransform(scrollY, [0, 420], [1, 0])

  return (
    <section className="hero">
      <div className="stars-bg" />
      <div className="hero-glow" />

      <motion.div className="hero-ball" style={{ y: ballY, rotate: ballRot }}>
        <img src={img('convite/disco.png')} alt=""/>
      </motion.div>

      <Par cls="hero-butterfly" src={img('convite/butterfly.png')} y={up} anim="float-a" r="-12deg" />
      <Par cls="hero-camera" src={img('convite/camera.png')} y={down} anim="float-b" r="10deg" />
      <Par cls="hero-bolt" src={img('convite/bolt.png')} y={down} anim="float-a" r="6deg" />
      <img src={img('convite/star1.png')} alt="" className="sticker hero-star s1 twinkle" />
      <img src={img('convite/star3.png')} alt="" className="sticker hero-star s2 twinkle" />
      <img src={img('convite/star4.png')} alt="" className="sticker hero-star s3 twinkle" />
      <Par cls="hero-hat" src={img('convite/hat.png')} y={up} anim="float-b" r="-14deg" />

      <motion.img src={nanyPics[6]} alt="Nany de óculos escuros e maiô da Marie" className="hero-nany left" style={{ y: up }}
        initial={{ x: -160, opacity: 0, rotate: -12 }} animate={{ x: 0, opacity: 1, rotate: -6 }} transition={{ delay: 0.5, type: 'spring', stiffness: 70, damping: 12 }} />
      <motion.img src={nanyPics[3]} alt="Nany com a peruca verde e amarela" className="hero-nany right" style={{ y: up }}
        initial={{ x: 160, opacity: 0, rotate: 12 }} animate={{ x: 0, opacity: 1, rotate: 5 }} transition={{ delay: 0.7, type: 'spring', stiffness: 70, damping: 12 }} />

      <div className="hero-copy">
        <motion.p className="hero-kicker" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          ✦ hoje é dia de festa ✦
        </motion.p>
        <Ransom as="h1" text="Happy Birthday" className="hero-title" delay={0.3} />
        <Ransom text="Nany!" className="hero-title hero-name" delay={0.9} />
      </div>

      <motion.div className="scroll-hint" style={{ opacity: fade }}>
        <span>role para ver</span><ArrowDown size={18} />
      </motion.div>
    </section>
  )
}

/* ───────────── 2. Faixas em movimento ───────────── */
function Ribbons() {
  const words = ['FELIZ ANIVERSÁRIO NANY', 'VAI TER FESTA', 'BORA CURTIR', 'HAPPY BIRTHDAY']
  const row = (n) => [...Array(2)].map((_, k) => (
    <div className="ribbon-set" key={k} aria-hidden={k === 1 || undefined}>
      {words.map((w, i) => <span key={i + n}>{w}<em>✦</em></span>)}
    </div>
  ))
  return (
    <div className="ribbons" aria-label="Feliz aniversário Nany">
      <div className="ribbon r-chrome"><div className="ribbon-track">{row('a')}</div></div>
      <div className="ribbon r-pink"><div className="ribbon-track reverse">{row('b')}</div></div>
    </div>
  )
}


/* ───────────── 4. Galeria de polaroids com parallax ───────────── */

const polaroids = [
  {
    id: 1,
    image: img('../img/nany/n1.png'),
    caption: 'ㅤ',
    background: '#ffb3d6',
    rotation: -4,
  },
  {
    id: 2,
    image: img('../img/nany/n2.png'),
    caption: 'ㅤ',
    background: '#ffd43b',
    rotation: 3,
  },
  {
    id: 3,
    image: img('../img/nany/n7.png'),
    caption: 'ㅤ',
    background: '#7db5ff',
    rotation: -3,
  },
  {
    id: 4,
    image: img('../img/nany/n4.png'),
    caption: 'ㅤ',
    background: '#b4e5ae',
    rotation: 4,
  },
  {
    id: 5,
    image: img('../img/nany/n5.png'),
    caption: 'ㅤ',
    background: '#ffb77a',
    rotation: -2,
  },
  {
    id: 6,
    image: img('../img/nany/n8.png'),
    caption: 'ㅤ',
    background: '#cfd8e8',
    rotation: 3,
  },
  {
    id: 7,
    image: img('../img/nany/n3.png'),
    caption: 'cara de travessa',
    background: '#c9b6ff',
    rotation: -4,
  },
  {
    id: 8,
    image: img('../img/nany/n6.png'),
    caption: 'ㅤ',
    background: '#ffb3d6',
    rotation: 2,
  },
]

function Polaroid({ item }) {
  return (
    <figure
      className="polaroid"
      style={{ '--r': `${item.rotation}deg` }}
    >
      <div
        className="polaroid-photo"
        style={{ background: item.background }}
      >
        <img
          src={item.image}
          alt={item.caption}
          loading="lazy"
        />
      </div>

      <figcaption>{item.caption}</figcaption>
    </figure>
  )
}

function Gallery() {
  const ref = useRef(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const c1 = useTransform(scrollYProgress, [0, 1], [90, -170])
  const c2 = useTransform(scrollYProgress, [0, 1], [-40, 80])
  const c3 = useTransform(scrollYProgress, [0, 1], [150, -230])

  const cols = [
    polaroids.slice(0, 3),
    polaroids.slice(3, 6),
    polaroids.slice(6, 8),
  ]

  return (
    <section className="gallery" ref={ref}>
      <Reveal className="gallery-head">
        <span className="eyebrow">Conheça o</span>
        <Ransom text="Álbum da Nany!" delay={0.1} className="small" />
      </Reveal>

      <div className="gallery-cols">
        {[c1, c2, c3].map((y, ci) => (
          <motion.div
            className={`gcol gcol-${ci}`}
            style={{ y }}
            key={ci}
          >
            {cols[ci].map(item => (
              <Polaroid item={item} key={item.id} />
            ))}
          </motion.div>
        ))}
      </div>
    </section>
  )
}


/* ───────────── 6. Explorar ───────────── */
function Explore() {
  return (
    <section className="explore">
      <Reveal className="explore-head">
        <span className="eyebrow">tem muita coisa rolando</span>
        <h2>Escolha uma <i>sessão</i></h2>
      </Reveal>
      <div className="explore-grid">
        {experiences.map((item, i) => (
          <Reveal key={item.path} delay={(i % 3) * 0.1} dir={i % 2 ? 'left' : 'right'}>
            <Link to={item.path} className={`xcard xc-${item.color}`}>
              <span className="xnum">{item.number}</span>
              <img src={img(item.art)} alt="" className="xart" />
              <div><h3>{item.title}</h3><p>{item.description}</p></div>
              <span className="xgo"><ArrowUpRight size={20} /></span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ───────────── 7. Despedida ───────────── */
function Outro() {
  return (
    <section className="outro">
      <div className="stars-bg" />
      <motion.img src={img('convite/puppy.png')} alt="" className="outro-puppy" style={{ x: '-50%' }} initial={{ y: 140, rotate: 8 }} whileInView={{ y: 0, rotate: -3 }} viewport={{ once: true }} transition={{ type: 'spring', stiffness: 60, damping: 11 }} />
      <Reveal className="outro-copy">
        <p className="hero-hand">que bom que você veio!</p>
        <Ransom text="Bora curtir!" className="small" />
        <Link to="/cabine" className="primary-button">Tirar uma foto <ArrowUpRight size={17} /></Link>
      </Reveal>
    </section>
  )
}

export default function Home() {
  return (
    <Page className="home-page">
      <Hero />
      <Ribbons />
      <Gallery />
      <Explore />
      <Outro />
    </Page>
  )
}
