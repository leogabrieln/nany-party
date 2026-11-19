import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Camera, Download, RefreshCw, X } from 'lucide-react'
import Page from '../components/Page'
import Ransom from '../components/Ransom'
import { EFFECTS } from '../lib/photoEffects'
import { img } from '../data'
import { listPhotos } from '../lib/partyService'
import { isCloudEnabled } from '../lib/supabase'

const tilts = [-3, 2, -1, 3.5, -2.5, 1.5, -4, 2]
const effectLabel = (id) => EFFECTS.find(e => e.id === id)?.label

async function downloadPhoto(photo) {
  const filename = `polaroid-${(photo.name || 'nany').replace(/\W+/g, '-').toLowerCase()}.jpg`
  try {
    const blob = await (await fetch(photo.url)).blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = filename; a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1500)
  } catch {
    window.open(photo.url, '_blank', 'noopener')
  }
}

export default function Album() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)
  const [open, setOpen] = useState(null)

  const refresh = useCallback(() => listPhotos().then(p => { setPhotos(p); setFailed(false) }).catch(() => setFailed(true)).finally(() => setLoading(false)), [])
  useEffect(() => {
    refresh()
    const id = setInterval(() => { if (!document.hidden) refresh() }, 10000) // novas fotos aparecem sozinhas
    return () => clearInterval(id)
  }, [refresh])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => { if (e.key === 'Escape') setOpen(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <Page className="theme-album">
      <section className="album-top">
        <img src={img('convite/star1.png')} alt="" className="sticker al-star a twinkle" />
        <img src={img('convite/star4.png')} alt="" className="sticker al-star b twinkle" />
        <img src={img('convite/puppy.png')} alt="" className="sticker al-puppy float-b" style={{ '--r': '4deg' }} />
        <span className="eyebrow">álbum da festa</span>
        <Ransom as="h1" text="Nossas memórias" className="small" />
        <p className="lead">Todas as polaroids tiradas pelos convidados, juntas num só lugar.</p>
        <div className="album-actions">
          <Link to="/cabine" className="primary-button"><Camera size={17} /> Tirar minha foto</Link>
          <button className="secondary-button" onClick={() => { setLoading(true); refresh() }}><RefreshCw size={15} /> Atualizar</button>
        </div>
        {photos.length > 0 && <p className="album-count">{photos.length} {photos.length === 1 ? 'foto' : 'fotos'} no álbum</p>}
      </section>

      <section className="album-wall">
        <div className="string" />
        {loading && photos.length === 0 ? <p className="empty-state">Revelando as fotos...</p>
          : failed && photos.length === 0 ? <p className="empty-state">Não foi possível carregar o álbum agora. Tente atualizar.</p>
          : photos.length === 0 ? <p className="empty-state">O álbum ainda está vazio. Que tal tirar a primeira foto?</p>
          : <div className="album-grid">
            {photos.map((p, i) => (
              <motion.button key={p.id} className="hang"
                initial={{ opacity: 0, y: -50, rotate: 0 }} whileInView={{ opacity: 1, y: 0, rotate: tilts[i % tilts.length] }} whileHover={{ rotate: 0, scale: 1.05, zIndex: 5 }} viewport={{ once: true, margin: '-5%' }}
                transition={{ type: 'spring', stiffness: 80, damping: 11, delay: (i % 4) * 0.06 }}
                onClick={() => setOpen(p)} aria-label={`Abrir foto de ${p.name}`}>
                <i className="clip" />
                <img src={p.url} alt={`Polaroid de ${p.name}`} loading="lazy" />
              </motion.button>
            ))}
          </div>}
      </section>

      <AnimatePresence>
        {open && (
          <motion.div className="lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(null)} role="dialog" aria-modal="true" aria-label={`Foto de ${open.name}`}>
            <motion.div className="lb-card" initial={{ scale: 0.8, rotate: -6 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0.8, opacity: 0 }} onClick={e => e.stopPropagation()}>
              <img src={open.url} alt={`Polaroid de ${open.name}`} />
              <div className="lb-bar">
                <span>{open.name || 'Convidado'}{effectLabel(open.effect) ? ` · ${effectLabel(open.effect)}` : ''}</span>
                <button className="primary-button" onClick={() => downloadPhoto(open)}><Download size={16} /> Baixar</button>
              </div>
              <button className="lb-close" onClick={() => setOpen(null)} aria-label="Fechar"><X size={20} /></button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Page>
  )
}
