import { Component, type ReactNode, type ErrorInfo } from 'react'

/**
 * 错误边界的状态
 */
interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

/**
 * 错误边界的属性
 */
interface ErrorBoundaryProps {
  children: ReactNode
}

/**
 * 全局错误边界组件
 * 使用 React class component 捕获子组件渲染错误
 * 显示友好的错误页面，避免白屏
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  /** 捕获子组件抛出的错误 */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  /** 在开发环境打印错误信息 */
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] 捕获到渲染错误:', error, errorInfo)
  }

  /** 重新加载页面 */
  handleReload = () => {
    window.location.reload()
  }

  /** 返回首页 */
  handleGoHome = () => {
    this.setState({ hasError: false, error: undefined })
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      const isDev = import.meta.env.DEV

      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-background">
          {/* 错误图标 */}
          <div className="text-6xl mb-4">⚠️</div>

          <h1 className="text-2xl font-bold mb-2">页面出了点问题</h1>
          <p className="text-muted-foreground mb-6 max-w-md text-sm leading-relaxed">
            抱歉，页面渲染时遇到了意外错误。你可以尝试重新加载页面，或返回首页。
          </p>

          {/* 操作按钮 */}
          <div className="flex gap-3">
            <button
              onClick={this.handleReload}
              className="inline-flex items-center justify-center h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/80 transition-colors"
            >
              重新加载
            </button>
            <button
              onClick={this.handleGoHome}
              className="inline-flex items-center justify-center h-9 px-4 rounded-lg border border-border bg-background text-sm font-medium hover:bg-muted transition-colors"
            >
              返回首页
            </button>
          </div>

          {/* 开发环境显示错误详情 */}
          {isDev && this.state.error && (
            <div className="mt-8 w-full max-w-lg">
              <p className="text-xs font-semibold text-muted-foreground mb-2 text-left">
                错误详情（仅开发环境可见）：
              </p>
              <pre className="text-xs text-left bg-muted p-4 rounded-lg overflow-auto max-h-48 text-destructive whitespace-pre-wrap break-all">
                {this.state.error.message}
                {'\n\n'}
                {this.state.error.stack}
              </pre>
            </div>
          )}
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
