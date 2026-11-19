import { motion } from 'framer-motion'

const TILT = [-4, 3, -2, 5, -5, 2, -3, 4, -1, 3]

// Texto estilo "recorte de revista" (como o título do convite)
export default function Ransom({ text, as: Tag = 'div', className = '', delay = 0 }) {
  let k = 0
  return (
    <Tag className={`ransom ${className}`} aria-label={text}>
      {text.split(' ').map((word, wi) => (
        <span className="ransom-word" key={wi} aria-hidden="true">
          {[...word].map((ch, ci) => {
            const i = k++
            return (
              <motion.span
                key={ci}
                className={`tile tile-${i % 10}`}
                initial={{ opacity: 0, y: 36, rotate: -24, scale: 0.6 }}
                whileInView={{ opacity: 1, y: 0, rotate: TILT[i % TILT.length], scale: 1 }}
                viewport={{ once: true, margin: '-8%' }}
                transition={{ delay: delay + i * 0.04, type: 'spring', stiffness: 260, damping: 14 }}
              >{ch}</motion.span>
            )
          })}
        </span>
      ))}
    </Tag>
  )
}
