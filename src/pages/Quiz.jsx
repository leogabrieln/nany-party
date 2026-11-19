import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Trophy, RotateCcw, ArrowRight, Crown, Play } from 'lucide-react'
import Page from '../components/Page'
import Ransom from '../components/Ransom'
import useGuestName from '../hooks/useGuestName'
import { img, quizQuestions } from '../data'
import { listQuizRanking, saveQuizScore } from '../lib/partyService'
import { isCloudEnabled } from '../lib/supabase'

const total = quizQuestions.length
const medals = ['🥇', '🥈', '🥉']
const fmtTime = (ms) => (ms ? `${(ms / 1000).toFixed(1)}s` : '—')
const verdict = (s) => s === total ? 'Você é praticamente da família! 🎉' : s >= total * 0.7 ? 'Você conhece mesmo a Nany!' : s >= total * 0.4 ? 'Quase lá! Dá para melhorar.' : 'Hmm... precisa passar mais tempo com a Nany!'

function Ranking({ rows, loading, me }) {
  return (
    <div className="ranking">
      <div className="ranking-title"><Crown size={20} /> Ranking dos que mais acertaram</div>
      {loading ? <p className="empty-state">Carregando ranking...</p> : rows.length === 0 ? <p className="empty-state">Ninguém jogou ainda. Seja o primeiro!</p> : (
        <ol>
          {rows.slice(0, 20).map((r, i) => (
            <motion.li key={r.name + i} className={`rank-row ${me && r.name.trim().toLowerCase() === me.trim().toLowerCase() ? 'is-me' : ''} ${i < 3 ? 'top' : ''}`}
              initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: Math.min(i, 10) * 0.05 }}>
              <span className="rank-pos">{medals[i] || i + 1}</span>
              <span className="rank-name">{r.name}</span>
              <span className="rank-time">{fmtTime(r.timeMs)}</span>
              <b className="rank-score">{r.score}/{r.total}</b>
            </motion.li>
          ))}
        </ol>
      )}
    </div>
  )
}

export default function Quiz() {
  const [name, setName] = useGuestName()
  const [stage, setStage] = useState('start') // start | play | result
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [picked, setPicked] = useState(null)
  const [ranking, setRanking] = useState([])
  const [loadingRank, setLoadingRank] = useState(true)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState(false)
  const startedAt = useRef(0)
  const timeMs = useRef(0)

  const loadRanking = () => listQuizRanking().then(setRanking).catch(() => setRanking([])).finally(() => setLoadingRank(false))
  useEffect(() => {
    loadRanking()
    const id = setInterval(() => { if (!document.hidden) loadRanking() }, 10000) // ranking ao vivo
    return () => clearInterval(id)
  }, [])

  const current = quizQuestions[index]
  const score = answers.reduce((n, a, i) => n + (a === quizQuestions[i].answer ? 1 : 0), 0)

  const start = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setIndex(0); setAnswers([]); setPicked(null); setNotice(''); setError(false)
    startedAt.current = Date.now()
    setStage('play')
  }

  const choose = (n) => {
    if (picked !== null) return
    setPicked(n)
    setTimeout(async () => {
      const next = [...answers, n]
      setAnswers(next); setPicked(null)
      if (index === total - 1) {
        timeMs.current = Date.now() - startedAt.current
        const finalScore = next.reduce((s, a, i) => s + (a === quizQuestions[i].answer ? 1 : 0), 0)
        setStage('result')
        try { await saveQuizScore({ guestName: name.trim(), score: finalScore, total, timeMs: timeMs.current }); setNotice('Sua pontuação entrou no ranking!') }
        catch (err) { setError(true); setNotice(err.message || 'Não foi possível salvar sua pontuação no ranking.') }
        loadRanking()
      } else setIndex(index + 1)
    }, 1100)
  }

  return (
    <Page className="theme-quiz">
      <div className="spotlights"><i /><i /><i /></div>
      <section className="quiz-top">
        <img src={img('convite/bolt.png')} alt="" className="sticker q-bolt float-a" style={{ '--r': '8deg' }} />
        <img src={img('nany/n6.png')} alt="" className="q-nany" />
        <span className="eyebrow">quiz da festa</span>
        <Ransom as="h1" text="Quem conhece a Nany?" className="small" />
      </section>

      <div className="quiz-layout">
        <div className="quiz-shell">
          <AnimatePresence mode="wait">
            {stage === 'start' && (
              <motion.form key="start" className="quiz-start" onSubmit={start} initial={{ opacity: 0, scale: .94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .94 }}>
                <h2>Antes de começar...</h2>
                <p>Digite seu nome para aparecer no ranking. Quem acerta mais (e mais rápido) leva a coroa!</p>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Seu nome" maxLength={35} required autoFocus />
                <button className="primary-button" type="submit"><Play size={16} /> Começar o quiz</button>
              </motion.form>
            )}

            {stage === 'play' && (
              <motion.div key={`q${index}`} className="quiz-play" initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}>
                <div className="quiz-meta"><span>Pergunta {index + 1} / {total}</span><span>✦ {score} {score === 1 ? 'acerto' : 'acertos'}</span></div>
                <div className="progress-track"><span style={{ width: `${(index / total) * 100}%` }} /></div>
                <h2>{current.question}</h2>
                <div className="quiz-options">
                  {current.options.map((o, i) => {
                    const state = picked === null ? '' : i === current.answer ? 'right' : i === picked ? 'wrong' : 'dim'
                    return <button key={o} className={state} disabled={picked !== null} onClick={() => choose(i)}><span>{String.fromCharCode(65 + i)}</span>{o}<ArrowRight size={16} /></button>
                  })}
                </div>
              </motion.div>
            )}

            {stage === 'result' && (
              <motion.div key="result" className="quiz-result" initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }}>
                <Trophy size={52} />
                <span className="eyebrow">{name.trim()}, sua pontuação</span>
                <strong>{score}/{total}</strong>
                <h2>{verdict(score)}</h2>
                <p className="fine-print">Tempo total: {fmtTime(timeMs.current)}</p>
                {notice && <p className={error ? 'error-note' : 'success-note'} role="status">{notice}</p>}
                <button className="primary-button" onClick={() => { setStage('start'); setNotice('') }}><RotateCcw size={16} /> Jogar de novo</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <Ranking rows={ranking} loading={loadingRank} me={name} />
      </div>
    </Page>
  )
}
