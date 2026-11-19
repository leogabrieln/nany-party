import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import Page from '../components/Page'
import Ransom from '../components/Ransom'
import Reveal from '../components/Reveal'
import { img } from '../data'

const spotifyUrl = 'https://open.spotify.com/playlist/5AiSP8qRHIfApad4a1aZ75?si=g4Kgg0SrSuuFF1hx9UhlLQ'

function parseSpotify(url) {
  const match = /open\.spotify\.com\/(?:intl-[a-z-]+\/)?(playlist|album|track|artist|show|episode)\/([A-Za-z0-9]+)/.exec(url || '')
  return match ? { kind: match[1], id: match[2] } : null
}

const bars = Array.from({ length: 28 }, (_, i) => i)

const words = [
  'DANÇAR',
  'CANTAR',
  'GRITAR',
  'FESTEJAR',
  'SORRIR',
  'CURTIR',
]

export default function Playlist() {
  const spotify = parseSpotify(spotifyUrl)

  const openUrl = spotify
    ? `https://open.spotify.com/${spotify.kind}/${spotify.id}`
    : ''

  const embed = spotify
    ? `https://open.spotify.com/embed/${spotify.kind}/${spotify.id}?utm_source=generator&theme=0`
    : ''

  return (
    <Page className="theme-trilha">
      <div className="eq-bg" aria-hidden="true">
        {bars.map(i => (
          <i
            key={i}
            style={{
              animationDelay: `${(i * 0.13) % 1.6}s`,
              animationDuration: `${0.9 + ((i * 37) % 10) / 10}s`,
            }}
          />
        ))}
      </div>

      <section className="trilha-top">
        <span className="eyebrow">a trilha da festa</span>
        <Ransom
          as="h1"
          text="Aumenta o som!"
          className="small"
        />
        <p className="lead">
          A playlist oficial do aniversário da Nany!
        </p>
      </section>

      <section className="trilha-main">
        <Reveal dir="right" className="vinyl-wrap">
          <div className="vinyl">
            <div className="grooves" />

            <div className="vinyl-label">
              <img src={img('nany/n5.png')} alt="Nany" />
              <span>NANY MIX</span>
            </div>
          </div>

          <div className="tonearm" />

          <img
            src={img('convite/star1.png')}
            alt=""
            className="sticker v-star twinkle"
          />

          <img
            src={img('convite/bolt.png')}
            alt=""
            className="sticker v-bolt float-a"
            style={{ '--r': '10deg' }}
          />
        </Reveal>

        <Reveal dir="left" className="player-card">
          <div className="player-head">
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="12" fill="#1ed760" />
              <path
                d="M5.5 9.2c4.2-1.2 8.7-.9 12.6 1.2M6.3 12.6c3.5-.9 7.1-.6 10.2 1.1M7 15.8c2.8-.7 5.6-.4 8.1.9"
                stroke="#0b1220"
                strokeWidth="1.8"
                strokeLinecap="round"
                fill="none"
              />
            </svg>

            <span>Tocando agora na festa</span>
          </div>

          {spotify ? (
            <>
              <iframe
                title="Playlist oficial do aniversário da Nany no Spotify"
                src={embed}
                width="100%"
                height="352"
                style={{
                  border: 0,
                  borderRadius: '12px',
                  display: 'block',
                }}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              />

              <a
                className="primary-button spotify-btn"
                href={openUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink size={16} />
                Abrir no Spotify
              </a>
            </>
          ) : (
            <div className="player-empty">
              <motion.span
                animate={{ rotate: [0, -8, 8, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 2.4,
                }}
              >
                🎧
              </motion.span>

              <h3>A playlist está sendo preparada</h3>
              <p>Em breve o player do Spotify aparece aqui.</p>

              <div className="sp-skeleton" aria-hidden="true">
                {[0, 1, 2].map(i => (
                  <i key={i}>
                    <b>{i + 1}</b>
                    <u />
                    <s />
                  </i>
                ))}
              </div>
            </div>
          )}
        </Reveal>
      </section>

      <div className="trilha-marquee" aria-hidden="true">
        <div>
          {[...words, ...words, ...words, ...words].map((word, i) => (
            <span key={i}>
              {word} <em>♫</em>
            </span>
          ))}
        </div>
      </div>
    </Page>
  )
}