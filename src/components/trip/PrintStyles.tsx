/**
 * 打印专用样式工具
 *
 * 提供 injectPrintStyles 函数，用于向新窗口注入 @media print CSS，
 * 优化 A4 纸张尺寸、页边距、品牌色保持和分页控制。
 */

/**
 * 向目标 document 注入打印样式
 * 用于 TripPDFExport 打开的新窗口
 */
export function injectPrintStyles(doc: Document) {
  const styleId = 'gonow-print-styles'

  // 避免重复注入
  if (doc.getElementById(styleId)) return

  const style = doc.createElement('style')
  style.id = styleId
  style.textContent = `
    /* ====== 全局打印基础 ====== */
    @page {
      size: A4;
      margin: 15mm;
    }

    @media print {
      /* 隐藏非打印元素 */
      .no-print {
        display: none !important;
      }

      /* 保持背景色和颜色精确打印 */
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
      }

      /* 页面基础样式 */
      html, body {
        width: 210mm;
        margin: 0;
        padding: 0;
        font-family: 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Noto Sans SC', sans-serif;
        font-size: 12px;
        line-height: 1.6;
        color: #1A1A2E;
        background: #FFFFFF !important;
      }

      /* 确保内容不溢出页面 */
      .print-container {
        max-width: 100%;
        overflow: hidden;
      }

      /* ====== 标题区域 ====== */
      .print-header {
        text-align: center;
        padding-bottom: 16px;
        margin-bottom: 20px;
        border-bottom: 2px solid #FF6B35;
        page-break-after: avoid;
      }

      .print-header h1 {
        font-size: 24px;
        font-weight: 800;
        color: #FF6B35;
        margin: 0 0 4px 0;
        letter-spacing: 1px;
      }

      .print-header .subtitle {
        font-size: 14px;
        color: #6B7280;
        margin: 0;
      }

      /* ====== 概览卡片 ====== */
      .print-overview {
        display: flex;
        justify-content: space-around;
        padding: 12px 16px;
        background: #FFF0EB;
        border-radius: 12px;
        margin-bottom: 20px;
        page-break-inside: avoid;
      }

      .print-overview-item {
        text-align: center;
      }

      .print-overview-item .value {
        font-size: 18px;
        font-weight: 700;
        color: #FF6B35;
      }

      .print-overview-item .label {
        font-size: 11px;
        color: #6B7280;
        margin-top: 2px;
      }

      /* ====== 每日行程 ====== */
      .print-day-section {
        margin-bottom: 20px;
        page-break-inside: avoid;
      }

      .print-day-header {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 14px;
        background: linear-gradient(135deg, #FF6B35, #FF8F65);
        color: white;
        border-radius: 10px;
        margin-bottom: 12px;
        page-break-after: avoid;
      }

      .print-day-number {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.25);
        font-weight: 700;
        font-size: 13px;
      }

      .print-day-title {
        font-size: 14px;
        font-weight: 600;
      }

      .print-day-date {
        font-size: 11px;
        opacity: 0.85;
        margin-left: auto;
      }

      /* 活动时间线 */
      .print-activity-list {
        padding-left: 20px;
        position: relative;
      }

      .print-activity-list::before {
        content: '';
        position: absolute;
        left: 7px;
        top: 8px;
        bottom: 8px;
        width: 2px;
        background: linear-gradient(180deg, #FF6B35, #FFD166);
        border-radius: 1px;
      }

      .print-activity-item {
        position: relative;
        padding: 8px 12px 8px 20px;
        margin-bottom: 8px;
        background: #FAFAF8;
        border-radius: 8px;
        border-left: 3px solid #FF6B35;
        page-break-inside: avoid;
      }

      .print-activity-item::before {
        content: '';
        position: absolute;
        left: -7px;
        top: 14px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #FF6B35;
        border: 2px solid #FFFFFF;
        box-shadow: 0 0 0 2px #FF6B35;
      }

      .print-activity-name {
        font-size: 13px;
        font-weight: 600;
        color: #1A1A2E;
        margin-bottom: 2px;
      }

      .print-activity-meta {
        font-size: 11px;
        color: #6B7280;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
      }

      .print-activity-cost {
        color: #FF6B35;
        font-weight: 600;
      }

      .print-activity-desc {
        font-size: 11px;
        color: #7B8794;
        margin-top: 4px;
        line-height: 1.5;
      }

      /* 红旗标签 */
      .print-red-flag {
        display: inline-block;
        font-size: 10px;
        padding: 1px 8px;
        border-radius: 10px;
        margin-top: 4px;
        margin-right: 4px;
        border: 1px solid #FFB899;
        color: #E55A25;
        background: #FFF5F0;
      }

      .print-black-flag {
        display: inline-block;
        font-size: 10px;
        padding: 1px 8px;
        border-radius: 10px;
        margin-top: 4px;
        margin-right: 4px;
        border: 1px solid #FFB8B8;
        color: #EF476F;
        background: #FFF0F2;
      }

      /* 当日小计 */
      .print-day-subtotal {
        text-align: right;
        font-size: 12px;
        color: #6B7280;
        padding: 6px 12px;
        margin-top: 4px;
      }

      .print-day-subtotal strong {
        color: #FF6B35;
        font-size: 14px;
      }

      /* ====== 预算汇总表格 ====== */
      .print-budget-section {
        margin-bottom: 20px;
        page-break-inside: avoid;
      }

      .print-budget-title {
        font-size: 16px;
        font-weight: 700;
        color: #1A1A2E;
        margin-bottom: 10px;
        padding-left: 12px;
        border-left: 4px solid #FF6B35;
      }

      .print-budget-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 12px;
      }

      .print-budget-table th {
        background: #FFF0EB;
        color: #FF6B35;
        font-weight: 600;
        padding: 8px 12px;
        text-align: left;
        border-bottom: 2px solid #FF6B35;
      }

      .print-budget-table td {
        padding: 8px 12px;
        border-bottom: 1px solid #F0F0F0;
        color: #1A1A2E;
      }

      .print-budget-table tr:last-child td {
        border-bottom: none;
      }

      .print-budget-table .total-row td {
        font-weight: 700;
        background: #FFF0EB;
        color: #FF6B35;
        border-top: 2px solid #FF6B35;
      }

      /* ====== 温馨提示 ====== */
      .print-tips-section {
        margin-bottom: 20px;
        page-break-inside: avoid;
      }

      .print-tips-title {
        font-size: 16px;
        font-weight: 700;
        color: #1A1A2E;
        margin-bottom: 10px;
        padding-left: 12px;
        border-left: 4px solid #FFD166;
      }

      .print-tip-item {
        font-size: 11px;
        color: #6B7280;
        padding: 6px 12px;
        margin-bottom: 4px;
        background: #FFFBF0;
        border-radius: 6px;
        border-left: 3px solid #FFD166;
      }

      /* ====== 页脚 ====== */
      .print-footer {
        text-align: center;
        padding-top: 16px;
        margin-top: 24px;
        border-top: 1px solid #E5E5E5;
        font-size: 11px;
        color: #9CA3AF;
        page-break-inside: avoid;
      }

      .print-footer .brand {
        font-weight: 700;
        color: #FF6B35;
      }

      /* ====== 分页控制 ====== */
      .print-page-break {
        page-break-before: always;
      }

      /* 避免孤行 */
      h1, h2, h3, h4 {
        page-break-after: avoid;
      }

      /* 避免表格行内分页 */
      tr {
        page-break-inside: avoid;
      }
    }
  `

  doc.head.appendChild(style)
}
