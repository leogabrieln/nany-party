import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Layout from './components/Layout'
import Home from './pages/Home'
import MemoryWall from './pages/MemoryWall'
import Quiz from './pages/Quiz'
import PhotoBooth from './pages/PhotoBooth'
import Playlist from './pages/Playlist'
import Album from './pages/Album'

export default function App() {
  const location = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [location.pathname])
  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/mural" element={<MemoryWall />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/cabine" element={<PhotoBooth />} />
          <Route path="/trilha" element={<Playlist />} />
          <Route path="/album" element={<Album />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </Layout>
  )
}
