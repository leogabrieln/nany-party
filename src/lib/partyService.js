import { supabase } from './supabase'

const WALL_KEY = 'nany-wall'
const RSVP_KEY = 'nany-rsvp'
const QUIZ_KEY = 'nany-quiz-scores'
const PHOTOS_KEY = 'nany-photos'

const palette = ['pink', 'yellow', 'blue', 'green', 'orange']
const readLocal = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback }
  catch { return fallback }
}
const writeLocal = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)); return true }
  catch { return false }
}

/* ───────────── Mural de memórias ───────────── */
export async function listMemories() {
  if (!supabase) return readLocal(WALL_KEY, [
    { name: 'Nany', text: 'Que esse dia seja inesquecível! ♡', color: 'pink', date: 'UMA LEMBRANÇA' },
    { name: 'A festa', text: 'Música boa, pessoas especiais e muita diversão.', color: 'yellow', date: 'BOAS VIBRAÇÕES' },
  ])

  const { data, error } = await supabase
    .from('memory_posts')
    .select('id, guest_name, message, image_url, created_at')
    .order('created_at', { ascending: false })
    .limit(60)
  if (error) throw error
  return data.map((post, index) => ({
    id: post.id,
    name: post.guest_name,
    text: post.message,
    photo: post.image_url,
    color: palette[index % palette.length],
    date: new Date(post.created_at).toLocaleDateString('pt-BR'),
  }))
}

export async function createMemory({ name, message, photo }) {
  if (!supabase) {
    const posts = readLocal(WALL_KEY, [])
    const next = [{ name, text: message, photo: photo ? await fileToDataUrl(photo) : '', color: palette[posts.length % palette.length], date: 'AGORA MESMO' }, ...posts]
    if (!writeLocal(WALL_KEY, next)) throw new Error('A foto é grande demais para o modo de demonstração. Tente uma menor.')
    return next
  }

  let imageUrl = null
  if (photo) {
    const extension = photo.name.split('.').pop()?.toLowerCase() || 'jpg'
    const path = `${crypto.randomUUID()}.${extension}`
    const { error: uploadError } = await supabase.storage.from('memory-photos').upload(path, photo, { contentType: photo.type, upsert: false })
    if (uploadError) throw uploadError
    imageUrl = supabase.storage.from('memory-photos').getPublicUrl(path).data.publicUrl
  }

  const { error } = await supabase.from('memory_posts').insert({ guest_name: name, message, image_url: imageUrl })
  if (error) throw error
  return listMemories()
}

/* ───────────── Confirmação de presença ───────────── */
export async function saveRsvp(guestName) {
  if (!supabase) { try { localStorage.setItem(RSVP_KEY, guestName) } catch { /* ignore */ } return }
  const { error } = await supabase.from('rsvps').insert({ guest_name: guestName })
  if (error) throw error
}

/* ───────────── Quiz + ranking ───────────── */
export async function saveQuizScore({ guestName, score, total, timeMs }) {
  if (!supabase) {
    const scores = readLocal(QUIZ_KEY, [])
    writeLocal(QUIZ_KEY, [{ guestName, score, total, timeMs, createdAt: new Date().toISOString() }, ...scores])
    return
  }
  const { error } = await supabase.from('quiz_scores').insert({ guest_name: guestName, score, total, time_ms: timeMs })
  if (error) throw error
}

// Ranking: melhor resultado de cada pessoa (mais acertos; empate = mais rápido)
export async function listQuizRanking() {
  let rows
  if (!supabase) {
    rows = readLocal(QUIZ_KEY, []).map(r => ({ name: r.guestName, score: r.score, total: r.total, timeMs: r.timeMs ?? 0, at: r.createdAt }))
  } else {
    const { data, error } = await supabase
      .from('quiz_scores')
      .select('guest_name, score, total, time_ms, created_at')
      .order('score', { ascending: false })
      .order('time_ms', { ascending: true })
      .limit(500)
    if (error) throw error
    rows = data.map(r => ({ name: r.guest_name, score: r.score, total: r.total, timeMs: r.time_ms ?? 0, at: r.created_at }))
  }
  const best = new Map()
  for (const r of rows) {
    const key = r.name.trim().toLowerCase()
    const prev = best.get(key)
    if (!prev || r.score > prev.score || (r.score === prev.score && r.timeMs < prev.timeMs)) best.set(key, r)
  }
  return [...best.values()].sort((a, b) => b.score - a.score || a.timeMs - b.timeMs)
}

/* ───────────── Álbum da festa (polaroids) ───────────── */
export async function listPhotos() {
  if (!supabase) return readLocal(PHOTOS_KEY, [])
  const { data, error } = await supabase
    .from('party_photos')
    .select('id, guest_name, image_url, effect, created_at')
    .order('created_at', { ascending: false })
    .limit(200)
  if (error) throw error
  return data.map(p => ({ id: p.id, name: p.guest_name, url: p.image_url, effect: p.effect, createdAt: p.created_at }))
}

export async function savePhoto({ name, blob, effect }) {
  if (!supabase) {
    const url = await blobToDataUrl(blob)
    const photos = readLocal(PHOTOS_KEY, [])
    const ok = writeLocal(PHOTOS_KEY, [{ id: crypto.randomUUID(), name, url, effect, createdAt: new Date().toISOString() }, ...photos])
    if (!ok) throw new Error('O armazenamento do navegador está cheio. Configure o Supabase para guardar mais fotos.')
    return
  }
  const path = `${crypto.randomUUID()}.jpg`
  const { error: uploadError } = await supabase.storage.from('party-photos').upload(path, blob, { contentType: 'image/jpeg', upsert: false })
  if (uploadError) throw uploadError
  const { data } = supabase.storage.from('party-photos').getPublicUrl(path)
  const { error } = await supabase.from('party_photos').insert({ guest_name: name, image_url: data.publicUrl, effect })
  if (error) throw error
}

/* ───────────── utilidades ───────────── */
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
const blobToDataUrl = fileToDataUrl
