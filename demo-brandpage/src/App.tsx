import { motion } from 'framer-motion'
import CaptureTool from './CaptureTool'
import SalesLanding, { SalesBenefits } from './SalesLanding'

export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <SalesLanding />

      {/* Imediatamente após “Feito para quem vende online”: intro + ferramenta */}
      <section
        id="ferramenta-site-captura"
        className="scroll-mt-0 border-t border-white/10 bg-[#0a0a0a]"
        aria-labelledby="heading-ferramenta"
      >
        <div className="mx-auto w-full max-w-6xl px-4 pt-12 pb-10 sm:px-6 sm:pt-14 sm:pb-12 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.45 }}
            className="mx-auto max-w-2xl text-center"
          >
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#fb923c]">Experimente na prática</span>
            <h2
              id="heading-ferramenta"
              className="mt-3 font-['Space_Grotesk',ui-sans-serif] text-2xl font-extrabold tracking-[-0.5px] text-white sm:text-3xl"
            >
              Crie seu site de captura agora
            </h2>
    
            <p className="mt-4 hidden text-sm leading-relaxed text-white/55 sm:block sm:text-[15px]">
              Preencha os passos, veja o preview atualizar na hora e gere seu link. O mesmo fluxo que você terá dentro
              do app — simples, rápido e sem código.
            </p>
          </motion.div>
        </div>

        <div className="w-full">
          <CaptureTool embedded />
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#0a0a0a] px-4 py-14 sm:px-6 sm:py-16" aria-labelledby="heading-pos-simulacao">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.45 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2
            id="heading-pos-simulacao"
            className="font-['Space_Grotesk',ui-sans-serif] text-2xl font-extrabold tracking-[-0.5px] text-white sm:text-3xl"
          >
            Gostou da página que você simulou?
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-white/55 sm:text-[15px]">
            Não perca mais tempo brigando com ferramentas complicadas. Comece a usar agora a estrutura que os grandes
            afiliados de achadinhos usam para escalar suas vendas.
          </p>
          <img src="7days.webp" alt="Preview da página de captura" className="md:w-32 w-32 mx-auto pt-4" />
          <a
            href="https://pay.kiwify.com.br/Q1eE7t8"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex w-full max-w-md items-center justify-center rounded-full bg-gradient-to-br from-[#e24c30] to-[#ff6b35] px-5 py-4 text-[0.68rem] font-extrabold uppercase leading-snug tracking-[0.04em] text-white shadow-[0_8px_28px_rgba(226,76,48,0.42)] transition-all duration-200 active:scale-[0.98] sm:max-w-xl sm:px-12 sm:py-5 sm:text-sm sm:tracking-wide sm:shadow-[0_10px_40px_rgba(226,76,48,0.48)] sm:hover:-translate-y-0.5"
          >
            <span className="text-balance px-0.5">
              Quero minha página profissional agora
            </span>
          </a>
        </motion.div>
      </section>

      <SalesBenefits />
    </div>
  )
}
