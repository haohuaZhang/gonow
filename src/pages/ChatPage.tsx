/**
 * 对话页面 - AI 旅行规划对话入口
 * 引入 ChatPanel 组件，提供页面标题和布局
 * 设计风格：温暖、现代、品牌色统一
 */
import ChatPanel from '@/components/chat/ChatPanel'

export default function ChatPage() {
  return (
    <div className="flex flex-col gap-4 h-full animate-fade-in-up">
      {/* 页面标题 - 带品牌色装饰 */}
      <div className="page-title-bar flex items-center justify-between">
        <div>
          <h1
            className="text-2xl md:text-3xl font-extrabold tracking-tight"
            style={{ color: 'var(--gonow-text)' }}
          >
            规划你的旅行
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: 'var(--gonow-text-secondary)' }}
          >
            和 AI 对话，快速生成专属行程方案
          </p>
        </div>
      </div>

      {/* 对话面板 */}
      <ChatPanel />
    </div>
  )
}
