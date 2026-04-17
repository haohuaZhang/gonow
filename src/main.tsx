import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    // 新内容可用，自动刷新页面
    if (confirm('有新版本可用，是否立即刷新？')) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.log('App is ready for offline use')
  },
})
