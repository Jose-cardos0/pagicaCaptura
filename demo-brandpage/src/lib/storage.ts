import type { DemoSite } from '../types'
import { STORAGE_INDEX_KEY, storageSiteKey } from '../types'

function readIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_INDEX_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : []
  } catch {
    return []
  }
}

function writeIds(ids: string[]) {
  localStorage.setItem(STORAGE_INDEX_KEY, JSON.stringify(ids))
}

export function loadSiteById(id: string): DemoSite | null {
  try {
    const raw = localStorage.getItem(storageSiteKey(id))
    if (!raw) return null
    return JSON.parse(raw) as DemoSite
  } catch {
    return null
  }
}

export function saveSite(site: DemoSite) {
  localStorage.setItem(storageSiteKey(site.id), JSON.stringify(site))
  const ids = readIds()
  if (!ids.includes(site.id)) {
    writeIds([...ids, site.id])
  }
}

export function deleteSiteById(id: string) {
  localStorage.removeItem(storageSiteKey(id))
  writeIds(readIds().filter((x) => x !== id))
}

export function listSites(): DemoSite[] {
  return readIds()
    .map((id) => loadSiteById(id))
    .filter((s): s is DemoSite => !!s)
}

export function slugExists(slug: string, exceptId?: string): boolean {
  const s = slug.trim().toLowerCase()
  return listSites().some((row) => row.slug.toLowerCase() === s && row.id !== exceptId)
}

export function patchSite(id: string, patch: Partial<DemoSite>) {
  const cur = loadSiteById(id)
  if (!cur) return null
  const next: DemoSite = { ...cur, ...patch, updated_at: new Date().toISOString() }
  saveSite(next)
  return next
}

export function recordView(id: string) {
  const cur = loadSiteById(id)
  if (!cur || !cur.active) return
  patchSite(id, { view_count: (cur.view_count ?? 0) + 1 })
}

export function recordClick(id: string) {
  const cur = loadSiteById(id)
  if (!cur || !cur.active) return
  patchSite(id, { cta_click_count: (cur.cta_click_count ?? 0) + 1 })
}
