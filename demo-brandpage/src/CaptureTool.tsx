import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  AlertTriangle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Copy,
  Edit,
  ExternalLink,
  Eye,
  EyeOff,
  MousePointerClick,
  Plus,
  Trash2,
  X,
  XCircle,
} from 'lucide-react'
import CapturePreviewCard from './components/CapturePreviewCard'
import type { DemoSite, LayoutVariant } from './types'
import {
  StorageQuotaError,
  deleteSiteById,
  listSites,
  loadSiteById,
  patchSite,
  saveSite,
  slugExists,
} from './lib/storage'
import { fileToDataUrl, uploadBrandpageLogo } from './lib/firebaseLogo'
import {
  DEFAULT_BUTTON_TEXT,
  DOMAIN,
  MAX_LOGO_BYTES,
  isValidHexColor,
  isValidHttpUrl,
  isValidPixelId,
  normalizeHex,
  sanitizeSlug,
  formatDateTimePtBR,
} from './lib/utils'

type Mode = 'empty' | 'view' | 'create' | 'edit'

const labelClass = 'block text-sm font-medium text-text-primary mb-2'
const inputClass =
  'w-full h-11 px-4 bg-dark-bg border border-dark-border rounded-lg text-text-primary ' +
  'placeholder:text-text-secondary/70 transition-colors ' +
  'focus:outline-none focus:ring-2 focus:ring-shopee-orange/60 focus:border-shopee-orange/60'
const inputDisabledClass =
  'w-full h-11 px-4 bg-dark-bg/50 border border-dark-border rounded-lg text-text-secondary cursor-not-allowed'
const textareaClass =
  'w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-text-primary ' +
  'placeholder:text-text-secondary/70 transition-colors ' +
  'focus:outline-none focus:ring-2 focus:ring-shopee-orange/60 focus:border-shopee-orange/60'

const colorPresets = ['#25D366', '#F97316', '#2563EB', '#16A34A', '#DC2626', '#111827']

const SAVINGS_TOTAL_USD = 297 + 2000 + 200

function formatUsd(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}



function realLandingHref(id: string) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '') || ''
  const path = `${base}/landingpage.html?id=${encodeURIComponent(id)}`
  return `${window.location.origin}${path}`
}

function fakePublicUrl(slug: string) {
  const s = slug.trim() || 'seu-slug'
  return `https://${DOMAIN}/${s}`
}

export default function CaptureTool({ embedded = false }: { embedded?: boolean }) {
  const [sites, setSites] = useState<DemoSite[]>([])
  const [mode, setMode] = useState<Mode>('empty')
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [slug, setSlug] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [buttonText, setButtonText] = useState('')
  const [whatsappUrl, setWhatsappUrl] = useState('')
  const [buttonColor, setButtonColor] = useState('#25D366')
  const [metaPixelId, setMetaPixelId] = useState('')
  const [layoutVariant, setLayoutVariant] = useState<LayoutVariant>('icons')

  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoLocalPreviewUrl, setLogoLocalPreviewUrl] = useState<string | null>(null)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [logoPendingRemove, setLogoPendingRemove] = useState(false)

  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<DemoSite | null>(null)
  /** Prévia da landing embutida abaixo do card (sem abrir nova aba) */
  const [inlinePreviewSiteId, setInlinePreviewSiteId] = useState<string | null>(null)
  /** No mobile o preview fica oculto por padrão para liberar espaço e ações no rodapé fixo */
  const [showMobilePreview, setShowMobilePreview] = useState(false)

  const pageHeaderRef = useRef<HTMLDivElement | null>(null)
  const inlinePreviewRef = useRef<HTMLDivElement | null>(null)

  const refreshList = useCallback(() => {
    setSites(listSites())
  }, [])

  useEffect(() => {
    const rows = listSites()
    setSites(rows)
    setMode(rows.length > 0 ? 'view' : 'empty')
  }, [])

  useEffect(() => {
    if (!logoFile) {
      setLogoLocalPreviewUrl(null)
      return
    }
    const u = URL.createObjectURL(logoFile)
    setLogoLocalPreviewUrl(u)
    return () => URL.revokeObjectURL(u)
  }, [logoFile])

  useEffect(() => {
    if (mode !== 'create' && mode !== 'edit') return
    requestAnimationFrame(() => {
      const el = pageHeaderRef.current
      if (!el) return
      const top = el.getBoundingClientRect().top + window.scrollY
      window.scrollTo({ top, behavior: 'smooth' })
    })
  }, [step, mode])

  useEffect(() => {
    if (!inlinePreviewSiteId) return
    const t = window.setTimeout(() => {
      inlinePreviewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }, 80)
    return () => window.clearTimeout(t)
  }, [inlinePreviewSiteId])

  const previewLogoSrc = logoLocalPreviewUrl ?? (logoPendingRemove ? null : logoUrl)

  const previewButtonText = buttonText.trim() || DEFAULT_BUTTON_TEXT

  const startCreate = () => {
    setError(null)
    setInlinePreviewSiteId(null)
    setStep(1)
    setEditingId(null)
    setSlug('')
    setTitle('')
    setDescription('')
    setButtonText('')
    setWhatsappUrl('')
    setButtonColor('#25D366')
    setMetaPixelId('')
    setLayoutVariant('icons')
    setLogoFile(null)
    setLogoUrl(null)
    setLogoPendingRemove(false)
    setShowMobilePreview(false)
    setMode('create')
  }

  const startEdit = (row: DemoSite) => {
    setError(null)
    setInlinePreviewSiteId(null)
    setStep(1)
    setEditingId(row.id)
    setSlug(row.slug)
    setTitle(row.title ?? '')
    setDescription(row.description ?? '')
    setButtonText(row.buttonText || DEFAULT_BUTTON_TEXT)
    setWhatsappUrl(row.buttonUrl ?? '')
    setButtonColor(row.buttonColor ?? '#25D366')
    setMetaPixelId(row.metaPixelId ?? '')
    setLayoutVariant(row.layoutVariant ?? 'icons')
    setLogoFile(null)
    setLogoUrl(row.logoUrl)
    setLogoPendingRemove(false)
    setShowMobilePreview(false)
    setMode('edit')
  }

  const cancelWizard = () => {
    setError(null)
    setStep(1)
    setLogoFile(null)
    setLogoPendingRemove(false)
    setEditingId(null)
    setMode(listSites().length ? 'view' : 'empty')
    setLogoUrl(null)
    setShowMobilePreview(false)
  }

  const goNext = () => {
    setError(null)
    if (step === 1) {
      if (mode === 'create') {
        const clean = sanitizeSlug(slug)
        if (!clean) {
          setError('Slug obrigatório.')
          return
        }
        if (!/^[a-z0-9-]+$/.test(clean)) {
          setError('Slug inválido. Use apenas letras minúsculas, números e hífen.')
          return
        }
        if (slugExists(clean)) {
          setError('Este slug já está em uso. Escolha outro.')
          return
        }
      }
      setStep(2)
      return
    }
    if (step === 2) {
      const bt = buttonText.trim()
      if (!bt) {
        setError('Nome do botão é obrigatório.')
        return
      }
      if (bt.length > 32) {
        setError('Nome do botão muito longo (máx. 32 caracteres).')
        return
      }
      setStep(3)
    }
  }

  const goPrev = () => {
    setError(null)
    if (step === 3) setStep(2)
    else if (step === 2) setStep(1)
  }

  async function resolveLogoUrl(siteId: string): Promise<string | null> {
    if (logoPendingRemove) return null
    if (logoFile) {
      const fromFb = await uploadBrandpageLogo(logoFile, siteId)
      if (fromFb) return fromFb
      try {
        return await fileToDataUrl(logoFile)
      } catch {
        return null
      }
    }
    return logoUrl
  }

  const submitWizard = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step !== 3) return

    setError(null)

    const bt = buttonText.trim()
    if (!bt || bt.length > 32) {
      setError('Nome do botão inválido.')
      return
    }
    const url = whatsappUrl.trim()
    if (!isValidHttpUrl(url)) {
      setError('Link do botão inválido (use uma URL http/https válida).')
      return
    }
    if (!isValidHexColor(buttonColor)) {
      setError('Cor do botão inválida.')
      return
    }
    if (!isValidPixelId(metaPixelId)) {
      setError('Meta Pixel ID inválido.')
      return
    }

    setSaving(true)
    try {
      const now = new Date().toISOString()
      if (mode === 'create') {
        const clean = sanitizeSlug(slug)
        if (slugExists(clean)) {
          setError('Slug já em uso.')
          setSaving(false)
          return
        }
        const id = crypto.randomUUID()
        const logoResolved = await resolveLogoUrl(id)
        const site: DemoSite = {
          id,
          slug: clean,
          title: title.trim(),
          description: description.trim(),
          buttonText: bt,
          buttonUrl: url,
          buttonColor,
          layoutVariant,
          logoUrl: logoResolved,
          metaPixelId: metaPixelId.trim(),
          active: true,
          view_count: 0,
          cta_click_count: 0,
          created_at: now,
          updated_at: now,
        }
        try {
          saveSite(site)
        } catch (err) {
          if (err instanceof StorageQuotaError) {
            setError(
              'O navegador ficou sem espaço para salvar (a logo em alta resolução pesa muito). Tente uma PNG menor (até ~300 KB), ou crie o site sem logo e envie depois pelo Firebase.',
            )
            setSaving(false)
            return
          }
          setError('Não foi possível salvar. Tente novamente.')
          setSaving(false)
          return
        }
        toast.success('Site criado! A prévia abre logo abaixo; use «Ver prévia aqui» no card para abrir de novo.')
        setInlinePreviewSiteId(id)
      } else if (mode === 'edit' && editingId) {
        const cur = loadSiteById(editingId)
        if (!cur) {
          setError('Site não encontrado.')
          setSaving(false)
          return
        }
        let nextLogo = cur.logoUrl
        if (logoPendingRemove) nextLogo = null
        else if (logoFile) nextLogo = await resolveLogoUrl(editingId)
        const next: DemoSite = {
          ...cur,
          title: title.trim(),
          description: description.trim(),
          buttonText: bt,
          buttonUrl: url,
          buttonColor,
          layoutVariant,
          logoUrl: nextLogo,
          metaPixelId: metaPixelId.trim(),
          updated_at: now,
        }
        try {
          saveSite(next)
        } catch (err) {
          if (err instanceof StorageQuotaError) {
            setError(
              'Armazenamento do navegador cheio. Reduza o tamanho da logo (PNG menor) ou remova a logo e salve de novo.',
            )
            setSaving(false)
            return
          }
          setError('Não foi possível salvar. Tente novamente.')
          setSaving(false)
          return
        }
        toast.success('Alterações salvas.')
      }

      setLogoFile(null)
      setLogoPendingRemove(false)
      setStep(1)
      setMode('view')
      refreshList()
    } finally {
      setSaving(false)
    }
  }

  const copyToClipboard = async (text: string, rowId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(rowId)
      toast.success('Link copiado!')
      setTimeout(() => setCopiedId(null), 1600)
    } catch {
      toast.error('Não foi possível copiar.')
    }
  }

  const toggleActive = (row: DemoSite) => {
    const next = patchSite(row.id, { active: !row.active })
    if (!next) {
      toast.error('Não foi possível salvar. Armazenamento do navegador pode estar cheio.')
      return
    }
    refreshList()
    toast.success(row.active ? 'Site desativado.' : 'Site ativado.')
  }

  const confirmDelete = () => {
    if (!deleteTarget) return
    const tid = deleteTarget.id
    const wasEditingThis = mode === 'edit' && editingId === tid
    deleteSiteById(tid)
    if (inlinePreviewSiteId === tid) setInlinePreviewSiteId(null)
    setDeleteTarget(null)
    if (wasEditingThis) {
      setStep(1)
      setEditingId(null)
      setLogoFile(null)
      setLogoUrl(null)
      setLogoPendingRemove(false)
      setError(null)
    }
    const rows = listSites()
    setSites(rows)
    if (wasEditingThis) setMode(rows.length ? 'view' : 'empty')
    else refreshList()
    toast.success('Site apagado.')
  }

  const displayMode = useMemo(() => {
    if (mode === 'create' || mode === 'edit') return 'wizard' as const
    if (sites.length === 0) return 'empty' as const
    return 'list' as const
  }, [sites.length, mode])

  const inWizard = mode === 'create' || mode === 'edit'

  return (
    <div
      className={`bg-[#0a0a0a] text-text-primary scrollbar-shopee overflow-x-hidden ${
        embedded
          ? `min-h-0 px-4 pt-2 sm:px-6 ${inWizard ? 'pb-28 sm:pb-16 lg:pb-16' : 'pb-14 sm:pb-16'}`
          : `${inWizard ? 'min-h-screen px-4 pb-28 pt-8 sm:px-6 sm:pb-8 lg:pb-8' : 'min-h-screen px-4 py-8 sm:px-6'}`
      }`}
    >
      <div className="mx-auto w-full max-w-6xl lg:px-2">
        <div
          ref={pageHeaderRef}
          className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0 max-md:hidden">
            <h1 className="font-heading text-2xl font-bold text-text-primary sm:text-3xl">Site de Captura</h1>
            <p className="mt-1.5 max-w-xl text-sm text-text-secondary">
              Crie uma página simples com botão e acompanhe visitas e cliques.
            </p>
          </div>
          <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row max-md:hidden">
            {(displayMode === 'empty' || displayMode === 'list') && (
              <button
                type="button"
                onClick={startCreate}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-shopee-orange text-white rounded-lg hover:opacity-90 transition-opacity font-semibold shadow-lg shadow-shopee-orange/20"
              >
                <Plus className="h-5 w-5" />
                {sites.length ? 'Criar outro site' : 'Criar site'}
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3 sm:p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {displayMode === 'empty' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-dark-card p-5 sm:p-12 rounded-xl border border-dark-border text-center"
          >
            <h2 className="text-lg sm:text-xl font-semibold text-text-primary mb-2">Nenhum site criado ainda</h2>
            <p className="text-sm sm:text-base text-text-secondary/80 mb-6">
              Clique abaixo para criar seu primeiro site de captura e gerar seu link com slug.
            </p>
            <button
              type="button"
              onClick={startCreate}
              className="hero-cta-shine relative inline-flex items-center justify-center gap-2 rounded-lg bg-shopee-orange px-6 py-3 font-semibold text-white shadow-lg shadow-shopee-orange/20 transition-opacity hover:opacity-90"
            >
              <span className="relative z-[1] inline-flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Criar meu primeiro site
              </span>
            </button>
          </motion.div>
        )}

        {displayMode === 'list' && mode !== 'create' && mode !== 'edit' && (
          <div className="space-y-4">
            {sites.map((row) => {
              const fakeUrl = fakePublicUrl(row.slug)
              const realUrl = realLandingHref(row.id)
              const previewOpen = inlinePreviewSiteId === row.id
              return (
                <motion.div
                  key={row.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-dark-border overflow-hidden bg-dark-card"
                >
                  <div className="flex flex-col gap-4 p-4 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-grow min-w-0 space-y-3">
                      <div className="flex items-start gap-3">
                        {row.logoUrl ? (
                          <div className="h-12 w-12 shrink-0 rounded-md border border-dark-border bg-white overflow-hidden flex items-center justify-center">
                            <img src={row.logoUrl} alt="" className="max-h-full max-w-full object-contain" />
                          </div>
                        ) : (
                          <div className="h-12 w-12 shrink-0 rounded-md bg-dark-bg border border-dark-border" />
                        )}
                        <div className="min-w-0 flex-grow">
                          <h3 className="text-base sm:text-lg font-semibold text-text-primary break-words">
                            {row.title?.trim() || 'Site de Captura'}
                          </h3>
                          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                            <span className="text-text-secondary shrink-0">Link</span>
                            <span className="text-shopee-orange font-mono text-xs sm:text-sm break-all">{fakeUrl}</span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(realUrl, row.id)}
                              className="inline-flex items-center gap-1.5 rounded-md border border-dark-border bg-dark-bg px-2 py-1 text-xs text-text-secondary hover:text-text-primary hover:border-shopee-orange/40 transition-colors"
                              title="Copiar link da sua página"
                            >
                              {copiedId === row.id ? (
                                <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                              Copiar link
                            </button>
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <MousePointerClick className="h-4 w-4 text-text-secondary" />
                              <span className="text-emerald-400 font-semibold">{row.cta_click_count}</span>
                              <span className="text-text-secondary">cliques</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Eye className="h-4 w-4 text-text-secondary" />
                              <span className="text-sky-400 font-semibold">{row.view_count}</span>
                              <span className="text-text-secondary">views</span>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-text-secondary">Criado em</span>
                              <span className="text-text-secondary">{formatDateTimePtBR(row.created_at)}</span>
                            </div>
                          </div>
                          <div className="mt-2 text-xs text-text-secondary">
                            Slug não pode ser alterado. Para mudar o slug, apague o site e crie outro.
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-shrink-0 flex-col gap-3 border-t border-dark-border pt-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end lg:border-t-0 lg:pt-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleActive(row)}
                          className={`rounded-lg p-2 transition-colors ${
                            row.active
                              ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                              : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                          }`}
                          aria-label={row.active ? 'Desativar site' : 'Ativar site'}
                          title={row.active ? 'Desativar' : 'Ativar'}
                        >
                          {row.active ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => startEdit(row)}
                          className="rounded-lg bg-dark-bg p-2 text-text-secondary transition-colors hover:bg-zinc-800 hover:text-shopee-orange"
                          aria-label="Editar site"
                          title="Editar"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setInlinePreviewSiteId(previewOpen ? null : row.id)}
                          className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                            previewOpen
                              ? 'bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/50'
                              : 'bg-dark-bg text-text-secondary hover:bg-zinc-800 hover:text-sky-300'
                          }`}
                          aria-expanded={previewOpen}
                          aria-controls={`site-preview-${row.id}`}
                        >
                          <ExternalLink className="h-4 w-4 shrink-0" />
                          {previewOpen ? 'Fechar prévia' : 'Ver prévia aqui'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(row)}
                          className="rounded-lg bg-dark-bg p-2 text-text-secondary transition-colors hover:bg-red-500/10 hover:text-red-500"
                          aria-label="Apagar site"
                          title="Apagar"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {previewOpen && (
                    <div
                      ref={inlinePreviewRef}
                      id={`site-preview-${row.id}`}
                      className="border-t border-dark-border bg-[#0c0c0e]"
                      role="region"
                      aria-label="Prévia da página pública"
                    >
                      <div className="px-4 py-4 sm:px-6 sm:py-5">
                        <p className="mb-3 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-text-secondary/90">
                          Prévia da sua página
                        </p>
                        <iframe
                          key={`${row.id}-${realUrl}`}
                          title={`Prévia do site ${row.slug}`}
                          src={realUrl}
                          className="min-h-[420px] h-[min(72vh,680px)] w-full rounded-xl border border-dark-border bg-[#FEFDFC] shadow-[inset_0_2px_8px_rgba(0,0,0,0.06)]"
                        />
                        <p className="mt-3 text-center text-xs text-text-secondary/70">
                          Prévia em branco?{' '}
                          <a
                            href={realUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-shopee-orange underline-offset-2 hover:underline"
                          >
                            Abrir em nova aba
                          </a>{' '}
                          (mesmo link).
                        </p>
                      </div>
                      <div className="space-y-6 border-t border-dark-border bg-dark-bg/90 px-4 py-8 sm:px-8 sm:py-10 ">
                      
                        <div className="relative mx-auto max-w-md rounded-xl border border-shopee-orange/35 bg-gradient-to-b from-shopee-orange/12 to-shopee-orange/[0.06] px-4 py-4 text-center">
                        <div className="text-center text-sm  absolute -top-5 left-0 bg-red-500/80 py-1 px-4 rounded-full font-bold">
                        ECONOMIA DE VERDADE
                      </div>
                          
                          
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-shopee-orange/95">
                            OLHA O QUANTO VOCÊ PODE ECONOMIZAR
                          </p>
                          <p className="mt-1 font-['Space_Grotesk',ui-sans-serif] text-2xl font-extrabold tabular-nums text-green-500 sm:text-3xl ">
                           + {formatUsd(SAVINGS_TOTAL_USD)}
                            <span className="ml-1 text-sm font-semibold text-text-secondary/90">em seu bolso!</span>
                          </p>
                          <p className="mt-2 text-[11px] leading-relaxed text-text-secondary/80">
                            Você economiza esse valor por mao usar nossa ferramenta.
                          </p>
                        
                        </div>
                        <div className="flex flex-col items-center gap-3">
                          <a
                            href="https://pay.kiwify.com.br/Q1eE7t8"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-[#e24c30] to-[#ff6b35] px-10 py-3.5 text-base font-extrabold text-white shadow-[0_8px_32px_rgba(226,76,48,0.45)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_40px_rgba(226,76,48,0.5)]"
                          >
                            COMPRAR AGORA
                            <span className="text-lg leading-none">→</span>
                          </a>
                          <button
                            type="button"
                            onClick={() => setInlinePreviewSiteId(null)}
                            className="text-xs font-medium text-text-secondary/80 underline-offset-2 hover:text-text-primary hover:underline"
                          >
                            Fechar prévia
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        )}

        {inWizard && (
          <>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
            <div className="flex min-w-0 flex-col gap-3 lg:contents">
              <div className="space-y-3 lg:hidden">
                <button
                  type="button"
                  onClick={() => setShowMobilePreview((v) => !v)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-dark-border bg-dark-card px-4 py-3 text-sm font-semibold text-text-primary active:bg-dark-bg"
                >
                  {showMobilePreview ? (
                    <>
                      <EyeOff className="h-4 w-4 text-text-secondary" />
                      Ocultar prévia
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 text-shopee-orange" />
                      Ver como ficará a página
                    </>
                  )}
                </button>
                {showMobilePreview && (
                  <CapturePreviewCard
                    title={title}
                    description={description}
                    buttonColor={buttonColor}
                    layoutVariant={layoutVariant}
                    logoSrc={previewLogoSrc}
                    buttonText={previewButtonText}
                    buttonUrl={whatsappUrl}
                    compact
                  />
                )}
              </div>

            <div className="bg-dark-card p-3 sm:p-6 rounded-xl border border-dark-border lg:order-none">
              <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4">
                <h2 className="text-base sm:text-xl font-semibold text-text-primary font-heading">
                  <span className="lg:hidden">{mode === 'create' ? 'Novo site' : 'Editar site'}</span>
                  <span className="hidden lg:inline">
                    {mode === 'create' ? 'Criar Site de Captura' : 'Editar Site de Captura'}
                  </span>
                </h2>
                {mode === 'edit' && (
                  <button
                    type="button"
                    onClick={() => {
                      const cur = editingId ? loadSiteById(editingId) : null
                      if (cur) setDeleteTarget(cur)
                    }}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors text-sm font-semibold"
                  >
                    <Trash2 className="h-4 w-4" />
                    Apagar site
                  </button>
                )}
              </div>

              <form
                id="capture-wizard-form"
                onSubmit={(e) => {
                  if (step !== 3) {
                    e.preventDefault()
                    goNext()
                    return
                  }
                  void submitWizard(e)
                }}
                className="space-y-4 sm:space-y-5"
              >
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="s1"
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 12 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-5"
                    >
                      {mode === 'create' ? (
                        <div>
                          <label className={labelClass}>Slug (imutável)</label>
                          <div className="flex gap-2 items-center flex-wrap">
                            <span className="text-xs text-text-secondary whitespace-nowrap">{DOMAIN}/</span>
                            <input
                              value={slug}
                              onChange={(e) => setSlug(sanitizeSlug(e.target.value))}
                              placeholder="meu-slug"
                              className={`${inputClass} flex-1 min-w-[140px]`}
                              required
                            />
                          </div>
                          <p className="mt-1.5 hidden text-xs text-text-secondary/80 sm:block">
                            Apenas letras minúsculas, números e hífen. Esse trecho entra no endereço público do seu site (
                            {DOMAIN}/…).
                          </p>
                          <p className="mt-1.5 text-xs text-text-secondary/80 sm:hidden">Letras minúsculas, números e hífen.</p>
                        </div>
                      ) : (
                        <div>
                          <label className={labelClass}>Slug (imutável)</label>
                          <input value={slug} disabled className={inputDisabledClass} />
                          <p className="mt-1.5 text-xs text-text-secondary/80">
                            Para mudar o slug, apague o site e crie outro.
                          </p>
                        </div>
                      )}

                      <div className="bg-dark-bg border border-dark-border rounded-lg p-4">
                        <div className="text-sm font-medium text-text-primary mb-2">Layout do card</div>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
                            <input
                              type="radio"
                              name="layout_variant"
                              checked={layoutVariant === 'icons'}
                              onChange={() => setLayoutVariant('icons')}
                            />
                            Layout com Ícones
                          </label>
                          <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
                            <input
                              type="radio"
                              name="layout_variant"
                              checked={layoutVariant === 'scarcity'}
                              onChange={() => setLayoutVariant('scarcity')}
                            />
                            Layout com Escassez
                          </label>
                        </div>
                        <div className="mt-2 hidden text-xs text-text-secondary/80 sm:block">
                          A escolha afeta o conteúdo abaixo do título/descrição na página pública.
                        </div>
                      </div>

                      <div className="bg-dark-bg border border-dark-border rounded-lg p-4">
                        <div className="text-sm font-medium text-text-primary mb-2">Logo (opcional)</div>
                        {mode === 'edit' && logoUrl && !logoPendingRemove && !logoFile && (
                          <div className="mb-3 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setLogoPendingRemove(true)
                                setLogoFile(null)
                              }}
                              className="text-xs px-2.5 py-1.5 rounded-md bg-dark-bg border border-dark-border text-text-secondary hover:text-red-400 hover:border-red-500/30"
                            >
                              Remover logo (ao salvar)
                            </button>
                          </div>
                        )}
                        {logoPendingRemove && mode === 'edit' && (
                          <button
                            type="button"
                            onClick={() => {
                              setLogoPendingRemove(false)
                              const cur = editingId ? loadSiteById(editingId) : null
                              setLogoUrl(cur?.logoUrl ?? null)
                            }}
                            className="mb-3 text-xs px-2.5 py-1.5 rounded-md bg-dark-border text-text-primary"
                          >
                            Desfazer remoção
                          </button>
                        )}
                        {(logoLocalPreviewUrl || (mode === 'edit' && logoUrl && !logoPendingRemove)) && (
                          <div className="mb-3 flex items-center gap-3">
                            <div className="relative h-12 w-20 rounded-md border border-dark-border bg-white overflow-hidden flex items-center justify-center">
                              {logoLocalPreviewUrl ? (
                                <img src={logoLocalPreviewUrl} alt="" className="max-h-full max-w-full object-contain" />
                              ) : logoUrl ? (
                                <img src={logoUrl} alt="" className="max-h-full max-w-full object-contain" />
                              ) : null}
                            </div>
                            {logoLocalPreviewUrl && (
                              <button
                                type="button"
                                onClick={() => setLogoFile(null)}
                                className="inline-flex items-center gap-2 px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-text-secondary hover:text-text-primary text-sm"
                              >
                                <X className="h-4 w-4" />
                                Remover seleção
                              </button>
                            )}
                          </div>
                        )}
                        <label className="block cursor-pointer rounded-lg border border-dashed border-dark-border bg-dark-bg/40 hover:bg-dark-bg/60 transition-colors p-4">
                          <input
                            type="file"
                            accept="image/png"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0] ?? null
                              e.target.value = ''
                              setError(null)
                              if (!f) return
                              if (f.type !== 'image/png') {
                                setError('A logo deve ser um arquivo PNG.')
                                return
                              }
                              if (f.size > MAX_LOGO_BYTES) {
                                setError('A logo deve ter no máximo 1MB.')
                                return
                              }
                              setLogoFile(f)
                              setLogoPendingRemove(false)
                            }}
                          />
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-md bg-dark-card border border-dark-border flex items-center justify-center">
                              <Plus className="h-5 w-5 text-text-secondary" />
                            </div>
                            <div className="min-w-0 text-left">
                              <div className="text-sm font-semibold text-text-primary">Selecionar logo</div>
                              <div className="text-xs text-text-secondary truncate">PNG até 1MB</div>
                            </div>
                          </div>
                        </label>
                      </div>

                      <div>
                        <label className={labelClass}>Cor do botão</label>
                        <div className="flex items-center gap-3 flex-wrap">
                          <input
                            type="color"
                            value={buttonColor}
                            onChange={(e) => setButtonColor(e.target.value)}
                            className="h-11 w-14 rounded-lg border border-dark-border bg-transparent"
                            aria-label="Selecionar cor"
                          />
                          <input
                            value={buttonColor}
                            onChange={(e) => setButtonColor(normalizeHex(e.target.value))}
                            onBlur={() => {
                              if (!isValidHexColor(buttonColor)) setButtonColor('#25D366')
                            }}
                            className="h-11 px-4 bg-dark-bg border border-dark-border rounded-lg text-text-primary font-mono text-sm w-44 focus:outline-none focus:ring-2 focus:ring-shopee-orange/60"
                            placeholder="#25D366"
                          />
                          <div className="flex items-center gap-2">
                            {colorPresets.map((c) => (
                              <button
                                key={c}
                                type="button"
                                onClick={() => setButtonColor(c)}
                                className="h-9 w-9 rounded-lg border border-dark-border hover:opacity-90 transition-opacity"
                                style={{ backgroundColor: c }}
                                title={c}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="s2"
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 12 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-5"
                    >
                      <div>
                        <label className={labelClass}>Título</label>
                        <input
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className={inputClass}
                          placeholder="Ex: Entre no meu grupo VIP"
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Descrição</label>
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className={textareaClass}
                          placeholder="Ex: Clique no botão abaixo para acessar o conteúdo."
                          rows={3}
                          style={{ minHeight: '5.5rem' }}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Nome do botão</label>
                        <input
                          value={buttonText}
                          onChange={(e) => setButtonText(e.target.value)}
                          className={inputClass}
                          placeholder="Ex: Acessar Grupo Vip"
                          maxLength={32}
                          required
                        />
                        <p className="mt-1.5 hidden text-xs text-text-secondary/80 sm:block">
                          Esse texto aparece dentro do botão na página de captura.
                        </p>
                        <p className="mt-1.5 text-xs text-text-secondary/80 sm:hidden">Texto do botão na página.</p>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      key="s3"
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 12 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-5"
                    >
                      <div>
                        <label className={labelClass}>Link do botão (URL)</label>
                        <input
                          value={whatsappUrl}
                          onChange={(e) => setWhatsappUrl(e.target.value)}
                          className={inputClass}
                          placeholder="https://exemplo.com/..."
                          required
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Meta Pixel ID (opcional)</label>
                        <input
                          value={metaPixelId}
                          onChange={(e) => {
                            const v = e.target.value.trim()
                            if (!v || /^\d+$/.test(v)) setMetaPixelId(v)
                          }}
                          className={inputClass}
                          placeholder="123456789012345"
                          maxLength={20}
                        />
                        <p className="mt-1.5 hidden text-xs text-text-secondary/80 sm:block">
                          Cole apenas o número do Pixel. Deixe vazio para não usar tracking.
                        </p>
                        <p className="mt-1.5 text-xs text-text-secondary/80 sm:hidden">Opcional — só o número.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="hidden pt-4 border-t border-dark-border lg:flex lg:items-center lg:justify-between lg:gap-3 lg:flex-wrap">
                  <div className="text-xs text-text-secondary">{step} de 3</div>
                  <div className="flex items-center gap-2">
                    {step > 1 && (
                      <button
                        type="button"
                        onClick={goPrev}
                        className="h-9 px-3 rounded-lg bg-dark-bg border border-dark-border text-text-secondary hover:text-text-primary transition-colors inline-flex items-center gap-2"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Voltar
                      </button>
                    )}
                    {step < 3 && (
                      <button
                        type="button"
                        onClick={goNext}
                        className="h-9 px-3 rounded-lg bg-dark-bg border border-dark-border text-text-secondary hover:text-text-primary transition-colors inline-flex items-center gap-2"
                      >
                        Avançar
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                {step === 3 && (
                  <div className="hidden pt-3 lg:flex lg:flex-wrap lg:items-center lg:justify-end lg:gap-2">
                    <button
                      type="submit"
                      disabled={saving}
                      className="h-10 px-4 bg-shopee-orange text-white rounded-lg hover:opacity-90 transition-opacity font-semibold text-sm disabled:opacity-50 shadow-md shadow-shopee-orange/25"
                    >
                      {saving ? 'Salvando…' : mode === 'create' ? 'Criar site' : 'Salvar alterações'}
                    </button>
                    <button
                      type="button"
                      onClick={cancelWizard}
                      disabled={saving}
                      className="h-10 px-4 bg-dark-bg border border-dark-border text-text-secondary rounded-lg hover:border-shopee-orange hover:text-shopee-orange transition-colors font-semibold text-sm"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </form>
            </div>
            </div>

            <div className="hidden lg:block lg:sticky lg:top-6 lg:self-start">
              <CapturePreviewCard
                title={title}
                description={description}
                buttonColor={buttonColor}
                layoutVariant={layoutVariant}
                logoSrc={previewLogoSrc}
                buttonText={previewButtonText}
                buttonUrl={whatsappUrl}
              />
            </div>
          </div>

          <div
            className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-dark-border bg-[#121212]/95 backdrop-blur-md px-3 pt-2 pb-[max(0.65rem,env(safe-area-inset-bottom))] shadow-[0_-10px_36px_rgba(0,0,0,0.5)]"
            role="region"
            aria-label="Navegação do assistente"
          >
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-2">
              <p className="text-center text-[11px] font-medium text-text-secondary/90">Passo {step} de 3</p>
              <div className="flex gap-2">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={goPrev}
                    disabled={saving}
                    className="flex h-12 min-w-[5.5rem] shrink-0 items-center justify-center gap-1 rounded-xl border border-dark-border bg-dark-bg text-sm font-semibold text-text-primary disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Voltar
                  </button>
                )}
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={goNext}
                    className="hero-cta-shine relative flex h-12 min-h-[48px] flex-1 items-center justify-center gap-1 rounded-xl bg-shopee-orange text-base font-bold text-white shadow-lg shadow-shopee-orange/30"
                  >
                    <span className="relative z-[1] inline-flex items-center gap-1">
                      Avançar
                      <ChevronRight className="h-5 w-5" />
                    </span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    form="capture-wizard-form"
                    disabled={saving}
                    className="hero-cta-shine relative flex h-12 min-h-[48px] flex-1 items-center justify-center rounded-xl bg-shopee-orange text-base font-bold text-white shadow-lg shadow-shopee-orange/30 disabled:opacity-50"
                  >
                    <span className="relative z-[1]">
                      {saving ? 'Salvando…' : mode === 'create' ? 'Criar site' : 'Salvar'}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
          </>
        )}
      </div>

      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDeleteTarget(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-xl border border-dark-border bg-dark-card p-6 shadow-xl"
            >
              <h3 className="text-lg font-semibold text-text-primary font-heading">Apagar site?</h3>
              <p className="mt-2 text-sm text-text-secondary">
                O site{' '}
                <span className="text-shopee-orange font-mono text-xs break-all">{fakePublicUrl(deleteTarget.slug)}</span>{' '}
                será apagado. Esta ação não pode ser desfeita.
              </p>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  className="px-4 py-2 rounded-lg bg-dark-bg border border-dark-border text-text-secondary hover:text-text-primary text-sm font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-500 text-sm font-semibold"
                >
                  Apagar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-10" />
    </div>
  )
}
