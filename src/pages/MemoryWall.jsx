import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ImagePlus, Send, Heart } from 'lucide-react'
import Page from '../components/Page'
import Ransom from '../components/Ransom'
import useGuestName from '../hooks/useGuestName'
import { img } from '../data'
import { createMemory, listMemories } from '../lib/partyService'
import { isCloudEnabled } from '../lib/supabase'

const tilts = [-3, 2, -1.5, 3, -2.5, 1.5, -4, 2.5]

export default function MemoryWall() {
  const [posts, setPosts] = useState([])
  const [name, setName] = useGuestName()
  const [message, setMessage] = useState('')
  const [photo, setPhoto] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState(false)

  useEffect(() => {
    // Carrega ao abrir e atualiza sozinho: recados de outros convidados aparecem em ~10s
    const load = (first) => listMemories().then(setPosts).catch(() => { if (first) { setError(true); setNotice('Não foi possível carregar o mural. Tente novamente.') } }).finally(() => setLoading(false))
    load(true)
    const id = setInterval(() => { if (!document.hidden) load(false) }, 10000)
    return () => clearInterval(id)
  }, [])

  const say = (text, isError = false) => { setNotice(text); setError(isError) }

  const selectPhoto = (file) => {
    if (!file) return setPhoto(null)
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return say('Use uma imagem JPEG, PNG ou WebP.', true)
    if (file.size > 5 * 1024 * 1024) return say('A imagem deve ter no máximo 5 MB.', true)
    say(''); setPhoto(file)
  }

  const save = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    if (!name.trim() || !message.trim() || saving) return
    setSaving(true); say('')
    try {
      setPosts(await createMemory({ name: name.trim(), message: message.trim(), photo }))
      setMessage(''); setPhoto(null); form.reset()
      say('Sua lembrança foi pregada no mural. ♡')
    } catch (err) {
      say(err.message || 'Não foi possível publicar. Verifique sua conexão e tente novamente.', true)
    } finally { setSaving(false) }
  }

  return (
    <Page className="theme-mural">
      <section className="mural-top">
        <img src={img('convite/butterfly.png')} alt="" className="sticker m-butterfly float-a" style={{ '--r': '-10deg' }} />
        <img src={img('convite/star1.png')} alt="" className="sticker m-star twinkle" />
        <span className="eyebrow">mural de memórias</span>
        <Ransom as="h1" text="Deixe seu recado" className="small" />
        <p className="lead">Um mural coletivo para guardar recados, fotos e carinho. Prenda a sua lembrança!</p>
      </section>

      <form className="note-form" onSubmit={save}>
        <div className="tape" />
        <span className="hand-title">Novo recadinho</span>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Seu nome" maxLength={35} required />
        <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Escreva uma mensagem para a Nany..." maxLength={240} required />
        <div className="compose-bottom">
          <label className="upload-label"><ImagePlus size={17} /> {photo ? photo.name : 'Adicionar foto'}
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => selectPhoto(e.target.files?.[0] || null)} hidden />
          </label>
          <button className="primary-button" type="submit" disabled={saving}>{saving ? 'Prendendo...' : 'Pregar no mural'} <Send size={15} /></button>
        </div>
        {notice && <p className={error ? 'error-note' : 'success-note'} role="status">{notice}</p>}
      </form>

      <div className="wall-grid">
        {loading ? <p className="empty-state">Carregando lembranças...</p> : posts.length === 0 ? <p className="empty-state">O mural está vazio. Seja o primeiro a deixar um recado!</p> :
          posts.map((p, i) => (
            <motion.article key={p.id || `${p.name}-${i}`} className={`memory-note note-${p.color}`}
              initial={{ opacity: 0, y: 60, rotate: 0 }} whileInView={{ opacity: 1, y: 0, rotate: tilts[i % tilts.length] }} whileHover={{ rotate: 0, scale: 1.04, zIndex: 5 }} viewport={{ once: true, margin: '-5%' }} transition={{ type: 'spring', stiffness: 90, damping: 14 }}>
              <i className="pin" />
              {p.photo && <img src={p.photo} alt={`Foto compartilhada por ${p.name}`} loading="lazy" />}
              <p>{p.text}</p>
              <footer><b>— {p.name}</b><span>{p.date}</span><Heart size={15} /></footer>
            </motion.article>
          ))}
      </div>
    </Page>
  )
}
