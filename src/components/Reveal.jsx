import { motion } from 'framer-motion'

const dirs = { up: { y: 40 }, down: { y: -40 }, left: { x: 60 }, right: { x: -60 }, zoom: { scale: 0.85 }, none: {} }

export default function Reveal({ children, dir = 'up', delay = 0, className = '', as = 'div', ...rest }) {
  const Comp = motion[as] || motion.div
  return (
    <Comp className={className} initial={{ opacity: 0, ...dirs[dir] }} whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-10%' }} transition={{ duration: 0.7, delay, ease: [0.2, 0.7, 0.2, 1] }} {...rest}>
      {children}
    </Comp>
  )
}
