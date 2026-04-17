import { lazy, Suspense } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { TooltipProvider } from '@/components/ui/tooltip'
import AppLayout from '@/components/layout/AppLayout'
import LoadingSpinner from '@/components/LoadingSpinner'
import ErrorBoundary from '@/components/ErrorBoundary'
import OnboardingGuide from '@/components/onboarding/OnboardingGuide'

// 路由级懒加载 - 实现代码分割，减小首屏 bundle 体积
const HomePage = lazy(() => import('@/pages/HomePage'))
const ChatPage = lazy(() => import('@/pages/ChatPage'))
const TripPage = lazy(() => import('@/pages/TripPage'))
const FoodPage = lazy(() => import('@/pages/FoodPage'))
const ScenicPage = lazy(() => import('@/pages/ScenicPage'))
const SharedTripPage = lazy(() => import('@/pages/SharedTripPage'))
const DestinationPage = lazy(() => import('@/pages/DestinationPage'))

/**
 * 应用根组件
 * 配置 React Router 路由和全局 Provider
 * 使用 React.lazy + Suspense 实现路由级代码分割
 * 使用 HashRouter 兼容 GitHub Pages 静态托管（无需服务端路由支持）
 */
function App() {
  return (
    <>
      <OnboardingGuide />
      <TooltipProvider>
        <HashRouter>
          <AppLayout>
            <ErrorBoundary>
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/chat" element={<ChatPage />} />
                  <Route path="/trip" element={<TripPage />} />
                  <Route path="/food" element={<FoodPage />} />
                  <Route path="/scenic" element={<ScenicPage />} />
                  <Route path="/shared/:tripId" element={<SharedTripPage />} />
                  <Route path="/destination" element={<DestinationPage />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </AppLayout>
        </HashRouter>
      </TooltipProvider>
    </>
  )
}

export default App
