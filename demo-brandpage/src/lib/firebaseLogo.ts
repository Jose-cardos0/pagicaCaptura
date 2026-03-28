import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyBnqCze2y2aW1cEUNResPpGlT3IzYMRSQs',
  authDomain: 'afiliadocdnx.firebaseapp.com',
  projectId: 'afiliadocdnx',
  storageBucket: 'afiliadocdnx.firebasestorage.app',
  messagingSenderId: '760879445698',
  appId: '1:760879445698:web:0bf32bb03cf9e39b73ed5b',
}

let app: FirebaseApp | null = null

function getApp(): FirebaseApp {
  if (!app) app = initializeApp(firebaseConfig)
  return app
}

/** Envia PNG para Storage. Falha silenciosamente se regras do bucket bloquearem — use fallback data URL. */
export async function uploadBrandpageLogo(file: File, siteId: string): Promise<string | null> {
  try {
    const storage = getStorage(getApp())
    const path = `brandpage-demo-logos/${siteId}.png`
    const r = ref(storage, path)
    await uploadBytes(r, file, { contentType: 'image/png' })
    return await getDownloadURL(r)
  } catch {
    return null
  }
}

export async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}
