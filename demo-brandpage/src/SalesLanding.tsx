import { createElement, useState, useEffect, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  BarChart3,
  ChevronRight,
  Crosshair,
  Link2,
  RefreshCw,
  Smartphone,
  Sparkles,
} from 'lucide-react'

export const OFFICIAL_SITE_MARKETING_URL = 'https://afiliadoanalytics.com.br'

const integrations = ['Shopee', 'Meta Ads', 'WhatsApp']

const benefits = [
  {
    icon: Sparkles,
    title: 'Mais Cliques e Confiança',
    body: 'Suas postagens ganham uma cara profissional. As pessoas sentem muito mais segurança em clicar no seu link e entrar no seu grupo.',
  },
  {
    icon: Link2,
    title: 'Funciona Direto (Sem Gastos Extras)',
    body: 'Você não precisa comprar um endereço de site (.com ou .com.br). Nós já te damos o link pronto para usar agora mesmo.',
  },
  {
    icon: Smartphone,
    title: 'Feito para o Celular',
    body: '99% dos seus clientes compram pelo celular. Nossa página é ultra-leve e abre instantaneamente, sem travar e sem fazer o cliente desistir.',
  },
  {
    icon: BarChart3,
    title: 'Rastreio de Vendas',
    body: 'Saiba exatamente qual postagem, story ou vídeo trouxe mais gente para o grupo. Chega de trabalhar no escuro!',
  },
  {
    icon: Crosshair,
    title: 'Instalação de Pixel (Meta/Facebook)',
    body: 'Coloque seu Pixel de forma simples para o Facebook entender quem é o seu público e te ajudar a encontrar mais compradores.',
  },
  {
    icon: RefreshCw,
    title: 'Recuperação de Cliques (Remarketing)',
    body: 'Se a pessoa clicar para sair da página sem querer ou por distração, a ferramenta tem uma função inteligente para segurar esse visitante e dar uma segunda chance dele entrar no seu grupo. Você não perde nenhum interessado!',
  },
]

const VTURB_PLAYER_ID = '69c880945610b6167ac52699'
const VTURB_SCRIPT_SRC = `https://scripts.converteai.net/1a08de6e-5582-4e59-9343-8ad1f2dfcbb5/players/${VTURB_PLAYER_ID}/v4/player.js`

/** Player ConverteAI / VTurb: script não pode ir como `<script>` no JSX (não roda); estilo tem que ser objeto. */
function ConverteAiVturbPlayer() {
  useEffect(() => {
    const scriptId = `vturb-player-js-${VTURB_PLAYER_ID}`
    if (document.getElementById(scriptId)) return
    const s = document.createElement('script')
    s.id = scriptId
    s.src = VTURB_SCRIPT_SRC
    s.async = true
    document.head.appendChild(s)
  }, [])

  return createElement('vturb-smartplayer', {
    id: `vid-${VTURB_PLAYER_ID}`,
    style: { display: 'block', margin: '0 auto', width: '100%', maxWidth: 400 },
  })
}

function BrandLogo() {
  const [src, setSrc] = useState('/logo.png')

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="mb-7 flex w-full justify-center sm:mb-8"
    >
      <img
        src={src}
        alt="Afiliado Analytics"
        className="h-[44px] w-auto max-w-[min(100%,320px)] object-contain object-center 
        opacity-95 sm:h-[52px] sm:max-w-[380px] md:h-[60px] md:max-w-[420px]"
        width={420}
        height={60}
        onError={() => setSrc('/favicon.svg')}
      />
    </motion.div>
  )
}

export function scrollToTool() {
  document.getElementById('ferramenta-site-captura')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const heroStoryCards: { title: string; body: ReactNode }[] = [
  {
    title: 'Link direto não converte?',
    body: (
      <>
        Você vive postando o link direto do grupo, mas sente que o Instagram ou o Facebook “barram” seu alcance? Ou
        pior: você queria uma página bonita para passar confiança, mas desiste só de pensar em ter que contratar um
        programador ou aprender a mexer em sites difíceis?
      </>
    ),
  },
  {
    title: 'A gente resolve por você',
    body: (
      <>
        O <strong className="font-semibold text-white">Afiliado Analytics</strong> faz todo o trabalho duro para você.
        Nós criamos uma estrutura pronta, testada e aprovada para quem quer uma única coisa: colocar gente interessada
        dentro do grupo de WhatsApp.
      </>
    ),
  },
]

function HeroStoryCards({ reducedMotion }: { reducedMotion: boolean }) {
  const [mobileIdx, setMobileIdx] = useState(0)
  const goNext = () => setMobileIdx((i) => (i + 1) % heroStoryCards.length)

  const cardShell =
    'rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-left shadow-[0_16px_48px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:p-6'

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.18, ease: 'easeOut' }}
      className="mb-8 w-full max-w-4xl sm:mb-10 hidden"
    >
      {/* Desktop: dois cards lado a lado */}
      <div className="hidden gap-4 md:grid md:grid-cols-2">
        {heroStoryCards.map(({ title, body }) => (
          <div key={title} className={cardShell}>
            <p className="mb-2 font-['Space_Grotesk',ui-sans-serif] text-xs font-bold uppercase tracking-[0.12em] text-[#fb923c]/90">
              {title}
            </p>
            <p className="text-[0.95rem] font-normal leading-[1.85] text-white/65 sm:text-[1.02rem] sm:leading-[1.8]">{body}</p>
          </div>
        ))}
      </div>

      {/* Mobile: card com seta sobreposta (canto superior direito) */}
      <div className="md:hidden">
        <div className="relative min-h-[11rem]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={mobileIdx}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: reducedMotion ? 0 : 0.22, ease: 'easeOut' }}
              className={`${cardShell} pr-[3.25rem]`}
            >
              <p className="mb-2 font-['Space_Grotesk',ui-sans-serif] text-xs font-bold uppercase tracking-[0.12em] text-[#fb923c]/90">
                {heroStoryCards[mobileIdx].title}
              </p>
              <p className="text-[0.95rem] font-normal leading-[1.85] text-white/65">{heroStoryCards[mobileIdx].body}</p>
            </motion.div>
          </AnimatePresence>

          <button
            type="button"
            onClick={goNext}
            aria-label={mobileIdx === 0 ? 'Próximo cartão' : 'Voltar ao primeiro cartão'}
            className="absolute right-3 top-3 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/45 text-[#ff8a65] shadow-lg shadow-black/40 backdrop-blur-md transition-colors active:bg-black/60 active:text-[#ffb59a]"
          >
            {!reducedMotion ? (
              <motion.span
                className="inline-flex"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
                aria-hidden
              >
                <ChevronRight className="h-7 w-7" strokeWidth={2.5} />
              </motion.span>
            ) : (
              <span className="inline-flex" aria-hidden>
                <ChevronRight className="h-7 w-7" strokeWidth={2.5} />
              </span>
            )}
          </button>
        </div>

        <div className="mt-4 flex justify-center gap-2" role="tablist" aria-label="Cartões">
          {heroStoryCards.map((c, i) => (
            <button
              key={c.title}
              type="button"
              role="tab"
              aria-selected={i === mobileIdx}
              onClick={() => setMobileIdx(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === mobileIdx ? 'w-6 bg-[#e24c30]' : 'w-2 bg-white/20 hover:bg-white/35'
              }`}
              aria-label={`Cartão ${i + 1}: ${c.title}`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

/** Benefícios — renderizado depois da ferramenta */
export function SalesBenefits() {
  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-[#12121a] py-16 sm:py-20">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[min(700px,90vw)] w-[min(700px,90vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(226,76,48,0.08)_0%,transparent_62%)]" />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <span className="mb-3 block text-xs font-bold uppercase tracking-[0.2em] text-[#fb923c]">
            Achadinhos & WhatsApp
          </span>
          <h2 className="font-['Space_Grotesk',ui-sans-serif] text-[clamp(1.5rem,4vw,2.5rem)] font-extrabold leading-[1.15] tracking-[-0.5px] text-white">
            Por que usar o Afiliado Analytics para{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b35] to-[#e24c30]">
              seus Achadinhos?
            </span>
          </h2>
        </motion.div>

        <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {benefits.map(({ icon: Icon, title, body }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-left shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-sm transition-colors hover:border-[#e24c30]/25 sm:p-7"
            >
              <div className="mb-4 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#e24c30]/25 to-[#a855f7]/20 text-[#ff8a65]">
                <Icon className="h-5 w-5" strokeWidth={2} />
              </div>
              <h3 className="mb-2 font-['Space_Grotesk',ui-sans-serif] text-lg font-bold leading-snug text-white">{title}</h3>
              <p className="text-sm leading-relaxed text-white/58">{body}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 flex justify-center sm:mt-14"
        >
          <a
            href={OFFICIAL_SITE_MARKETING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-[#e24c30] to-[#ff6b35] px-8 py-3.5 text-sm font-extrabold text-white shadow-[0_8px_28px_rgba(226,76,48,0.42)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_40px_rgba(226,76,48,0.5)] active:scale-[0.98] sm:px-10 sm:text-base"
          >
            Quero saber mais
            <span className="text-lg leading-none" aria-hidden>
              →
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}

export default function SalesLanding() {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const fn = () => setReducedMotion(mq.matches)
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])

  return (
    <div className="relative bg-[#18181b] text-[#e9e9e9]">
      {/* Hero: sem flex na section — evita altura “fantasma” com vários filhos absolute; fundos isolados num shell */}
      <section className="relative m-0 overflow-hidden pt-12 pb-16 sm:pt-16 sm:pb-20 md:pt-20 md:pb-24">
        <div
          className="pointer-events-none absolute inset-0 isolate overflow-hidden"
          aria-hidden="true"
        >
          <div className="animate-sales-aurora1 absolute left-[15%] top-[10%] h-[min(600px,90vw)] w-[min(600px,90vw)] rounded-full bg-[radial-gradient(circle,rgba(226,76,48,0.18)_0%,transparent_65%)] blur-[40px]" />
          <div className="animate-sales-aurora2 absolute right-[10%] top-[30%] h-[min(500px,85vw)] w-[min(500px,85vw)] rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.18)_0%,transparent_65%)] blur-[50px]" />
          <div className="animate-sales-aurora3 absolute bottom-[8%] left-[35%] h-[min(400px,80vw)] w-[min(400px,80vw)] rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.12)_0%,transparent_65%)] blur-[45px]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.65)_100%)]" />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center px-5 sm:max-w-4xl sm:px-8">
          <BrandLogo />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={`mb-7 flex w-full justify-center sm:mb-9 ${reducedMotion ? '' : 'animate-sales-float'}`}
          >
            <span
              className={`inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-4 py-2.5 text-[12px] font-semibold text-white/85 backdrop-blur-[16px] sm:px-5 sm:text-[13px]`}
            >
              <span className="h-2 w-2 shrink-0 rounded-full bg-[#e24c30] shadow-[0_0_10px_#e24c30]" />
              Grupos WhatsApp · Afiliado Analytics
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            className="mb-6 w-full text-center font-['Space_Grotesk',ui-sans-serif] font-extrabold leading-[1.12] tracking-[-1.5px] sm:mb-8 sm:tracking-[-2px]"
          >
            <span className="block text-[clamp(1.45rem,5.2vw,2.75rem)] text-white/95">
              Crie sua página profissional para encher grupos de WhatsApp
            </span>
            <span className="mt-2 block text-[clamp(1.35rem,4.5vw,2.35rem)] text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b35] via-[#e24c30] to-[#ff9a6c]">
              em poucos cliques
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={`mb-7 flex w-full justify-center sm:mb-9 ${reducedMotion ? '' : 'animate-sales-float'}`}
          >
            <div className="w-full max-w-[400px]">
              <ConverteAiVturbPlayer />
            </div>
          </motion.div>

          <HeroStoryCards reducedMotion={reducedMotion} />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.28, ease: 'easeOut' }}
            className="mb-4 w-full text-center text-[0.95rem] font-medium text-white/80 sm:text-[1.05rem]"
          >
            Veja como é fácil. Faça um teste agora:
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.34, ease: 'easeOut' }}
            className="mb-10 flex w-full justify-center px-1 sm:mb-12 sm:px-0"
          >
            <button
              type="button"
              onClick={scrollToTool}
              className="hero-cta-shine relative inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-full bg-gradient-to-br from-[#e24c30] to-[#ff6b35] px-6 py-3.5 text-[0.95rem] font-extrabold leading-snug text-white shadow-[0_8px_28px_rgba(226,76,48,0.42)] transition-all duration-200 active:scale-[0.98] sm:max-w-xl sm:gap-3 sm:px-14 sm:py-6 sm:text-xl sm:shadow-[0_10px_40px_rgba(226,76,48,0.48)] sm:hover:-translate-y-0.5 sm:hover:shadow-[0_14px_48px_rgba(226,76,48,0.55)]"
            >
              <span className="relative z-[1] inline-flex flex-col items-center gap-1 text-center sm:flex-row sm:gap-3">
                <span>
                  <span className="sm:hidden">CRIAR PÁGINA AGORA</span>
                  <span className="hidden sm:inline">CRIAR MINHA PÁGINA DE CAPTURA </span>
                </span>
                <span className="text-xl leading-none sm:text-3xl">↓</span>
              </span>
            </button>
          </motion.div>

          {!reducedMotion && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.45 }}
              transition={{ duration: 1, delay: 0.9 }}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/40">Role para experimentar</span>
              <div className="flex h-9 w-6 justify-center rounded-xl border-2 border-white/25 pt-1.5">
                <div className="h-2 w-1 rounded-sm bg-[#ee4d2d]" />
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Integrações */}
      <section className="relative overflow-hidden border-y border-white/5 bg-[linear-gradient(90deg,#1f1f26b7_0%,#23232a4a_20%,#2b24318b_50%,#23232a4f_80%,#1f1f2680_100%)] py-10 sm:py-11">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.018)_0%,rgba(255,255,255,0.005)_45%,rgba(0,0,0,0.1)_100%)]" />
        <div className="relative mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="mb-6 text-center text-[11px] font-semibold uppercase tracking-[0.28em] text-white/55">
            Feito para quem vende online
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 sm:gap-x-14">
            {integrations.map((brand, i) => (
              <motion.span
                key={brand}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.1 }}
                className="cursor-default text-[15px] font-extrabold text-white/45 transition-all duration-200 hover:text-white/90 hover:drop-shadow-[0_0_20px_rgba(226,76,48,0.4)]"
              >
                {brand}
              </motion.span>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
