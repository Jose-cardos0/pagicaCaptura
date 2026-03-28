import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Gift, Tag, Zap } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import type { LayoutVariant } from '../types'
import { DEFAULT_BUTTON_TEXT, isWhatsAppLink, parseColorToRgb } from '../lib/utils'
import ScarcityPreview from './ScarcityPreview'

export default function CapturePreviewCard(props: {
  title: string
  description: string
  buttonColor: string
  layoutVariant: LayoutVariant
  logoSrc: string | null
  buttonText: string
  buttonUrl: string
}) {
  const { title, description, buttonColor, layoutVariant, logoSrc, buttonText, buttonUrl } = props

  const safeTitle = title.trim() || 'Grupo VIP'
  const safeDesc = description.trim() || 'Clique no botão abaixo para acessar.'
  const safeColor = buttonColor || '#25D366'
  const safeButtonText = buttonText.trim() || DEFAULT_BUTTON_TEXT
  const showWhatsIcon = isWhatsAppLink(buttonUrl)
  const { r, g, b } = parseColorToRgb(safeColor)

  return (
    <div className="rounded-lg border border-dark-border overflow-hidden bg-dark-card shadow-lg shadow-black/20">
      <div className="px-4 py-3 border-b border-dark-border flex items-center justify-between">
        <div className="text-sm font-semibold text-text-primary font-heading">Preview (igual ao público)</div>
        <motion.span
          className="text-xs text-emerald-400/90 font-medium"
          animate={{ opacity: [0.65, 1, 0.65] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          Tempo real
        </motion.span>
      </div>

      <div className="p-6 bg-dark-bg">
        <div className="flex justify-center">
          <motion.div
            className="origin-top scale-[0.88]"
            initial={false}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          >
            <div
              className="w-[440px] max-w-[calc(100vw-3rem)] px-4 sm:px-9 py-9 sm:py-11"
              style={{
                backgroundColor: '#FEFDFC',
                border: '1px solid rgba(0,0,0,0.04)',
                borderRadius: '32px',
                boxShadow: 'rgba(31, 38, 135, 0.12) 0px 8px 32px 0px',
              }}
            >
              <AnimatePresence mode="wait">
                {logoSrc && (
                  <motion.div
                    key={logoSrc}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex justify-center mb-6"
                  >
                    <div
                      className="h-[130px] w-[130px] rounded-2xl flex items-center justify-center overflow-hidden bg-white"
                      aria-label="Logo"
                    >
                      <img src={logoSrc} alt="Logo" className="h-full w-full object-contain" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.h1
                key={safeTitle}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center font-extrabold leading-tight text-[#1f1f1f] text-[28px] sm:text-[32px]"
              >
                {safeTitle}
              </motion.h1>

              <motion.p
                key={safeDesc}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 }}
                className="text-center mt-4 leading-snug max-w-sm mx-auto font-semibold text-[#3c3c3c] text-[16px] sm:text-[17px]"
              >
                {safeDesc}
              </motion.p>

              {layoutVariant === 'scarcity' ? (
                <ScarcityPreview />
              ) : (
                <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-6 sm:mt-7">
                  {[
                    { Icon: Zap, label: 'Ofertas Relâmpago' },
                    { Icon: Tag, label: 'Descontos Reais' },
                    { Icon: Gift, label: 'Cupons Diários' },
                  ].map(({ Icon, label }) => (
                    <div key={label} className="flex flex-col items-center text-center gap-2">
                      <div
                        className="h-11 w-11 rounded-full flex items-center justify-center"
                        style={{ background: 'rgb(235, 235, 235)' }}
                      >
                        <Icon size={20} color="rgb(238, 77, 45)" />
                      </div>
                      <span className="text-[11px] sm:text-[12.8px] font-semibold text-neutral-600 whitespace-nowrap">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-center mt-7 sm:mt-8">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full sm:w-[420px] inline-flex items-center justify-center gap-2 px-6 py-4 font-extrabold text-white rounded-2xl cursor-default"
                  style={{
                    backgroundColor: safeColor,
                    boxShadow: `0 16px 34px rgba(${r}, ${g}, ${b}, 0.28)`,
                  }}
                >
                  {showWhatsIcon ? <FaWhatsapp size={25} color="#fff" aria-hidden /> : <ExternalLink size={20} aria-hidden />}
                  {safeButtonText}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
