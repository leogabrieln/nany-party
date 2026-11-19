import { motion } from 'framer-motion'

export default function Page({ children, className = '' }) {
  return (
    <motion.div className={`page ${className}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: 'easeOut' }}>
      {children}
    </motion.div>
  )
}
