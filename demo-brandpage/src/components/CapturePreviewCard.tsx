import { motion } from 'framer-motion'
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
  /** Preview menor para telas estreitas (ex.: mobile expandido) */
  compact?: boolean
}) {
  const { title, description, buttonColor, layoutVariant, logoSrc, buttonText, buttonUrl, compact = false } = props

  const safeTitle = title.trim() || 'Grupo VIP'
  const safeDesc = description.trim() || 'Clique no botão abaixo para acessar.'
  const safeColor = buttonColor || '#25D366'
  const safeButtonText = buttonText.trim() || DEFAULT_BUTTON_TEXT
  const showWhatsIcon = isWhatsAppLink(buttonUrl)
  const { r, g, b } = parseColorToRgb(safeColor)

  return (
    <div className="rounded-lg border border-dark-border overflow-hidden bg-dark-card shadow-lg shadow-black/20">
      <div className="px-3 py-2.5 sm:px-4 sm:py-3 border-b border-dark-border flex items-center justify-between gap-2">
        <div className="text-xs font-semibold text-text-primary font-heading sm:text-sm">
          {compact ? 'Prévia' : 'Preview (igual ao público)'}
        </div>
        <motion.span
          className="text-[10px] text-emerald-400/90 font-medium sm:text-xs"
          animate={{ opacity: [0.65, 1, 0.65] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          Tempo real
        </motion.span>
      </div>

      <div className={compact ? 'p-3 bg-dark-bg' : 'p-6 bg-dark-bg'}>
        <div className="flex justify-center">
          <motion.div
            className={compact ? 'origin-top scale-[0.62] sm:scale-[0.72]' : 'origin-top scale-[0.88]'}
            initial={false}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          >
            <div
              className={
                compact
                  ? 'w-[440px] max-w-[calc(100vw-2.5rem)] px-3 py-6 sm:px-9 sm:py-11'
                  : 'w-[440px] max-w-[calc(100vw-3rem)] px-4 sm:px-9 py-9 sm:py-11'
              }
              style={{
                backgroundColor: '#FEFDFC',
                border: '1px solid rgba(0,0,0,0.04)',
                borderRadius: '32px',
                boxShadow: 'rgba(31, 38, 135, 0.12) 0px 8px 32px 0px',
              }}
            >
              {logoSrc ? (
                <div className={compact ? 'mb-3 flex justify-center sm:mb-6' : 'mb-6 flex justify-center'}>
                  <div
                    className={
                      compact
                        ? 'flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-xl bg-white sm:h-[130px] sm:w-[130px] sm:rounded-2xl'
                        : 'flex h-[130px] w-[130px] items-center justify-center overflow-hidden rounded-2xl bg-white'
                    }
                    aria-label="Logo"
                  >
                    <img src={logoSrc} alt="Logo" className="h-full w-full object-contain" loading="eager" />
                  </div>
                </div>
              ) : null}

              <motion.h1
                key={safeTitle}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={
                  compact
                    ? 'text-center font-extrabold leading-tight text-[#1f1f1f] text-[1.15rem] sm:text-[32px]'
                    : 'text-center font-extrabold leading-tight text-[#1f1f1f] text-[28px] sm:text-[32px]'
                }
              >
                {safeTitle}
              </motion.h1>

              <motion.p
                key={safeDesc}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 }}
                className={
                  compact
                    ? 'text-center mt-2 leading-snug max-w-sm mx-auto font-semibold text-[#3c3c3c] text-[12px] sm:mt-4 sm:text-[17px]'
                    : 'text-center mt-4 leading-snug max-w-sm mx-auto font-semibold text-[#3c3c3c] text-[16px] sm:text-[17px]'
                }
              >
                {safeDesc}
              </motion.p>

              {layoutVariant === 'scarcity' ? (
                <ScarcityPreview />
              ) : (
                <div className={compact ? 'grid grid-cols-3 gap-1.5 mt-3 sm:mt-7 sm:gap-4' : 'grid grid-cols-3 gap-3 sm:gap-4 mt-6 sm:mt-7'}>
                  {[
                    { Icon: Zap, label: 'Ofertas Relâmpago' },
                    { Icon: Tag, label: 'Descontos Reais' },
                    { Icon: Gift, label: 'Cupons Diários' },
                  ].map(({ Icon, label }) => (
                    <div key={label} className="flex flex-col items-center text-center gap-1 sm:gap-2">
                      <div
                        className={
                          compact
                            ? 'h-8 w-8 rounded-full flex items-center justify-center sm:h-11 sm:w-11'
                            : 'h-11 w-11 rounded-full flex items-center justify-center'
                        }
                        style={{ background: 'rgb(235, 235, 235)' }}
                      >
                        <Icon size={compact ? 14 : 20} color="rgb(238, 77, 45)" />
                      </div>
                      <span
                        className={
                          compact
                            ? 'text-[8px] font-semibold text-neutral-600 leading-tight sm:text-[12.8px] sm:whitespace-nowrap'
                            : 'text-[11px] sm:text-[12.8px] font-semibold text-neutral-600 whitespace-nowrap'
                        }
                      >
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className={compact ? 'flex justify-center mt-4 sm:mt-8' : 'flex justify-center mt-7 sm:mt-8'}>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={
                    compact
                      ? 'w-full sm:w-[420px] inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-extrabold text-white rounded-xl cursor-default sm:gap-2 sm:px-6 sm:py-4 sm:text-base sm:rounded-2xl'
                      : 'w-full sm:w-[420px] inline-flex items-center justify-center gap-2 px-6 py-4 font-extrabold text-white rounded-2xl cursor-default'
                  }
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
