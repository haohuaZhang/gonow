/**
 * 全局加载组件
 * 居中显示 GoNow logo + "加载中..." 文字 + 脉冲动画
 */
export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] gap-3">
      {/* GoNow Logo + 脉冲动画 */}
      <div className="animate-pulse text-3xl font-bold text-primary">
        GoNow
      </div>
      <p className="text-sm text-muted-foreground animate-pulse">加载中...</p>
    </div>
  )
}
