export type LayoutVariant = 'icons' | 'scarcity'

export type DemoSite = {
  id: string
  slug: string
  title: string
  description: string
  buttonText: string
  buttonUrl: string
  buttonColor: string
  layoutVariant: LayoutVariant
  logoUrl: string | null
  metaPixelId: string
  active: boolean
  view_count: number
  cta_click_count: number
  created_at: string
  updated_at: string
}

export const STORAGE_INDEX_KEY = 'capture_demo_brandpage_index_v1'
export const storageSiteKey = (id: string) => `capture_demo_brandpage_site_v1_${id}`
