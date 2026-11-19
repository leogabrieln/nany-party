import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Camera, Download, RefreshCw, SwitchCamera, Timer, Check, Images } from 'lucide-react'
import Page from '../components/Page'
import Ransom from '../components/Ransom'
import { img } from '../data'
import { EFFECTS, loadAssets, renderPolaroid } from '../lib/photoEffects'
import { savePhoto } from '../lib/partyService'
import { isCloudEnabled } from '../lib/supabase'

export default function PhotoBooth() {
  const [step, setStep] = useState('start') // start | camera | edit
  const [facing, setFacing] = useState('user')
  const [camState, setCamState] = useState('idle') // loading | ready | error
  const [camError, setCamError] = useState('')
  const [timer, setTimer] = useState(false)
  const [count, setCount] = useState(null)
  const [flash, setFlash] = useState(false)
  const [shot, setShot] = useState(null) // foto crua (Image)
  const [effectId, setEffectId] = useState('natural')
  const [caption, setCaption] = useState('')
  const [preview, setPreview] = useState(null) // { blob, url }
  const [published, setPublished] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState(false)

  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const assetsRef = useRef({})
  const job = useRef(0)
  const effect = EFFECTS.find(e => e.id === effectId) || EFFECTS[0]

  useEffect(() => { loadAssets().then(a => { assetsRef.current = a }) }, [])

  const stopCamera = useCallback(() => { streamRef.current?.getTracks().forEach(t => t.stop()); streamRef.current = null }, [])

  // Liga a câmera ao entrar no passo "camera"
  useEffect(() => {
    if (step !== 'camera') return undefined
    let cancelled = false
    setCamState('loading'); setCamError('')
    ;(async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) throw new Error('unsupported')
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: facing }, width: { ideal: 1280 }, height: { ideal: 1280 } }, audio: false })
        if (cancelled) { stream.getTracks().forEach(t => t.stop()); return }
        streamRef.current = stream
        const v = videoRef.current
        if (v) { v.srcObject = stream; await v.play().catch(() => {}) }
        setCamState('ready')
      } catch (err) {
        if (cancelled) return
        setCamState('error')
        setCamError(err?.name === 'NotAllowedError' ? 'Você não liberou o acesso à câmera. Permita nas configurações do navegador e tente de novo.'
          : err?.message === 'unsupported' || !window.isSecureContext ? 'Este navegador não permite usar a câmera aqui (o site precisa abrir por https).'
          : 'Não encontramos uma câmera disponível.')
      }
    })()
    return () => { cancelled = true; stopCamera() }
  }, [step, facing, stopCamera])

  // Foto da polaroid (com filtro + legenda) refeita sempre que o efeito ou a legenda mudam
  useEffect(() => {
    if (step !== 'edit' || !shot) return undefined
    const id = ++job.current
    const t = setTimeout(async () => {
      try {
        const blob = await renderPolaroid({ source: shot, mirror: false, effect, name: caption.trim(), assets: assetsRef.current })
        if (id !== job.current) return
        setPreview(p => { if (p) URL.revokeObjectURL(p.url); return { blob, url: URL.createObjectURL(blob) } })
      } catch (err) { setError(true); setNotice(err.message || 'Algo deu errado.') }
    }, 200)
    return () => clearTimeout(t)
  }, [step, shot, effect, caption])

  const capture = () => {
    const v = videoRef.current
    if (!v || !v.videoWidth) return
    const c = document.createElement('canvas')
    c.width = v.videoWidth; c.height = v.videoHeight
    const ctx = c.getContext('2d')
    if (facing === 'user') { ctx.translate(c.width, 0); ctx.scale(-1, 1) } // selfie sem espelho invertido
    ctx.drawImage(v, 0, 0)
    const im = new Image()
    im.onload = () => {
      setFlash(true); setTimeout(() => setFlash(false), 280)
      setShot(im); setEffectId('natural'); setCaption(''); setPreview(null); setPublished(false); setNotice(''); setError(false)
      setStep('edit')
    }
    im.src = c.toDataURL('image/jpeg', 0.92)
  }

  const shoot = () => {
    if (!timer) return capture()
    let n = 3
    setCount(n)
    const id = setInterval(() => {
      n -= 1
      if (n === 0) { clearInterval(id); setCount(null); capture() } else setCount(n)
    }, 1000)
  }

  // No celular abre o menu de compartilhar (com "Salvar imagem"); no desktop baixa o arquivo
  const download = async () => {
    if (!preview) return
    const file = new File([preview.blob], `polaroid-nany-${Date.now()}.jpg`, { type: 'image/jpeg' })
    try {
      if (navigator.canShare?.({ files: [file] })) { await navigator.share({ files: [file] }); return }
    } catch (err) { if (err?.name === 'AbortError') return }
    const a = document.createElement('a')
    a.href = preview.url; a.download = file.name; a.click()
  }

  const publish = async () => {
    if (!preview || publishing || published) return
    setPublishing(true); setNotice('')
    try { await savePhoto({ name: caption.trim() || 'Convidado', blob: preview.blob, effect: effect.id }); setPublished(true); setError(false); setNotice('Sua polaroid já está no álbum da festa!') }
    catch (err) { setError(true); setNotice(err.message || 'Não foi possível publicar. Tente novamente.') }
    finally { setPublishing(false) }
  }

  return (
    <Page className="theme-booth">
      <div className="curtain left" /><div className="curtain right" />
      <section className="booth-top">
        <img src={img('convite/camera.png')} alt="" className="sticker b-camera float-a" style={{ '--r': '-8deg' }} />
        <img src={img('convite/star1.png')} alt="" className="sticker b-star twinkle" />
        <span className="eyebrow">cabine de fotos</span>
        <Ransom as="h1" text="Hora da foto!" className="small" />
      </section>

      <div className="booth-stage">
        <AnimatePresence mode="wait">
          {step === 'start' && (
            <motion.div key="start" className="booth-card booth-start" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
              <img src={img('nany/n1.png')} alt="" className="bs-nany" />
              <h2>Bora tirar uma foto?</h2>
              <p>Tire a foto, escolha um filtro maluco, escreva uma legenda e pronto: sai uma polaroid pra você guardar ou colocar no álbum da festa.</p>
              <button className="primary-button" onClick={() => setStep('camera')}><Camera size={17} /> Abrir câmera</button>
            </motion.div>
          )}

          {step === 'camera' && (
            <motion.div key="camera" className="booth-card booth-cam" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="viewfinder">
                <video ref={videoRef} className={`vf-media ${facing === 'user' ? 'mirror' : ''}`} playsInline muted autoPlay />
                {camState === 'loading' && <div className="vf-msg"><Camera size={34} /><span>Abrindo a câmera...</span></div>}
                {camState === 'error' && <div className="vf-msg err"><Camera size={34} /><span>{camError}</span></div>}
                {count !== null && <div className="vf-count" key={count}>{count}</div>}
                {flash && <div className="vf-flash" />}
              </div>
              <div className="cam-controls">
                <button className="round-btn" onClick={() => setTimer(t => !t)} aria-pressed={timer} title="Timer de 3 segundos"><Timer size={20} /><small>{timer ? '3s' : 'off'}</small></button>
                <button className="shutter" onClick={shoot} disabled={count !== null || camState !== 'ready'} aria-label="Tirar foto"><span /></button>
                <button className="round-btn" onClick={() => setFacing(f => (f === 'user' ? 'environment' : 'user'))} title="Trocar câmera"><SwitchCamera size={20} /><small>virar</small></button>
              </div>
              <div className="cam-links"><button className="text-button" onClick={() => { stopCamera(); setStep('start') }}>Voltar</button></div>
            </motion.div>
          )}

          {step === 'edit' && shot && (
            <motion.div key="edit" className="booth-card booth-edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="polaroid-out"><img src={preview?.url || shot.src} alt="Sua polaroid" className={preview ? '' : 'developing'} /></div>

              <label className="eyebrow" htmlFor="caption">Legenda da polaroid</label>
              <input id="caption" className="caption-input" value={caption} onChange={e => setCaption(e.target.value)} placeholder="Escreva algo (opcional)" maxLength={24} />

              <div className="effect-strip" role="listbox" aria-label="Filtros">
                {EFFECTS.map(ef => (
                  <button key={ef.id} role="option" aria-selected={ef.id === effectId} className={`effect-chip ${ef.id === effectId ? 'on' : ''}`} onClick={() => setEffectId(ef.id)}>
                    <span className="swatch" style={{ background: ef.swatch }}>{ef.emoji}</span>
                    <small>{ef.label}</small>
                  </button>
                ))}
              </div>

              <div className="result-actions">
                <button className="primary-button" onClick={publish} disabled={!preview || publishing || published}>
                  {published ? <><Check size={17} /> No álbum</> : <><Images size={17} /> {publishing ? 'Publicando...' : 'Publicar no álbum'}</>}
                </button>
                <button className="secondary-button" onClick={download} disabled={!preview}><Download size={17} /> Baixar polaroid</button>
                <button className="text-button" onClick={() => { setNotice(''); setStep('camera') }}><RefreshCw size={14} /> Tirar outra</button>
                {published && <Link to="/album" className="text-button">Ver o álbum da festa →</Link>}
                {notice && <p className={error ? 'error-note' : 'success-note'} role="status">{notice}</p>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Page>
  )
}
