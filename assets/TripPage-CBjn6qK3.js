import{G as e,U as t,j as n}from"./dist-0L0ZExye.js";import{o as r}from"./chunk-OE4NN4TA-Ceq8hGnL.js";import{a as i,n as a,o,r as s,t as c}from"./dialog-DO7DMV-G.js";import{t as l}from"./button-BnYx3NgU.js";import{n as u,r as d}from"./storage-CxoUUtUC.js";import{a as f,i as p,n as m,t as h}from"./card-PQFFFKSw.js";import{n as g,t as _}from"./DayCard-Bg8rJplk.js";import{i as v,n as y,r as b,t as x}from"./tabs-CyQw7qkm.js";import{t as S}from"./tripStore-Uzo-0gST.js";var C=e(t(),1);function w(e){return`${window.location.origin}/shared/${e}`}function T(e,t){let n=new URL(`https://service.weibo.com/share/share.php`);n.searchParams.set(`url`,e),n.searchParams.set(`title`,t),window.open(n.toString(),`_blank`,`width=600,height=500`)}function E(e,t,n){let r=new URL(`https://connect.qq.com/widget/shareqq/index.html`);r.searchParams.set(`url`,e),r.searchParams.set(`title`,t),r.searchParams.set(`summary`,n),window.open(r.toString(),`_blank`,`width=600,height=500`)}function D(e){let t=new Date(e.startDate),n=new Date(e.endDate).getTime()-t.getTime();return Math.max(1,Math.ceil(n/(1e3*60*60*24))+1)}function O(e,t=3){let n=[];for(let r of e.days)for(let e of r.activities){if(n.length>=t)return n;n.push(e.name)}return n}function k(e){let t=new Date(e);return`${t.getMonth()+1}月${t.getDate()}日`}function ee(e){return new Promise((t,n)=>{let r=document.createElement(`canvas`),i=r.getContext(`2d`);if(!i){n(Error(`Canvas 上下文创建失败`));return}let a=1e3;r.width=750,r.height=a;let o=i.createLinearGradient(0,0,750,320);o.addColorStop(0,`#FF6B35`),o.addColorStop(.5,`#FF8F65`),o.addColorStop(1,`#FFD166`),i.fillStyle=o,i.beginPath(),i.roundRect(0,0,750,320,[0,0,40,40]),i.fill(),i.globalAlpha=.1,i.fillStyle=`#FFFFFF`,i.beginPath(),i.arc(670,60,120,0,Math.PI*2),i.fill(),i.beginPath(),i.arc(60,280,80,0,Math.PI*2),i.fill(),i.globalAlpha=1,i.fillStyle=`#FFFFFF`,i.font=`bold 36px "Geist Variable", sans-serif`,i.textAlign=`left`,i.fillText(`GoNow`,50,70),i.font=`20px "Geist Variable", sans-serif`,i.globalAlpha=.9,i.fillText(`AI 智能旅行规划`,50,105),i.globalAlpha=1,i.font=`bold 52px "Geist Variable", sans-serif`,i.textAlign=`center`,i.fillStyle=`#FFFFFF`,i.fillText(e.destination,750/2,200);let s=D(e),c=`${k(e.startDate)} - ${k(e.endDate)}`;i.font=`24px "Geist Variable", sans-serif`,i.globalAlpha=.9,i.fillText(`${c}  |  ${s}天行程`,750/2,260),i.globalAlpha=1;let l=O(e,3);i.fillStyle=`#1A1A2E`,i.font=`bold 28px "Geist Variable", sans-serif`,i.textAlign=`left`,i.fillText(`行程亮点`,50,370),i.fillStyle=`#FF6B35`,i.fillRect(50,382,40,4),i.font=`22px "Geist Variable", sans-serif`,i.fillStyle=`#6B7280`,l.forEach((e,t)=>{let n=425+t*45;i.fillStyle=`#FF6B35`,i.beginPath(),i.arc(68,n-6,5,0,Math.PI*2),i.fill(),i.fillStyle=`#1A1A2E`,i.font=`22px "Geist Variable", sans-serif`,i.fillText(e,88,n)}),a-180;let u=i.createLinearGradient(50,0,700,0);u.addColorStop(0,`#FF6B35`),u.addColorStop(1,`#FFD166`),i.fillStyle=u,i.fillRect(50,820,650,3),i.fillStyle=`#9CA3AF`,i.font=`18px "Geist Variable", sans-serif`,i.textAlign=`center`,i.fillText(`扫码查看完整行程`,750/2,860);let d=w(e.id);i.fillStyle=`#D1D5DB`,i.font=`16px "Geist Variable", sans-serif`,i.fillText(d,750/2,890),i.fillStyle=`#FF6B35`,i.font=`bold 18px "Geist Variable", sans-serif`,i.fillText(`GoNow`,750/2,930),r.toBlob(e=>{if(!e){n(Error(`Canvas 转换 Blob 失败`));return}t(URL.createObjectURL(e))},`image/png`,1)})}function te(e,t){let n=document.createElement(`a`);n.href=e,n.download=t,document.body.appendChild(n),n.click(),document.body.removeChild(n)}var A=n();function j({className:e}){return(0,A.jsx)(`svg`,{className:e,fill:`none`,viewBox:`0 0 24 24`,stroke:`currentColor`,strokeWidth:2,children:(0,A.jsx)(`path`,{strokeLinecap:`round`,strokeLinejoin:`round`,d:`M5 13l4 4L19 7`})})}function ne({className:e}){return(0,A.jsx)(`svg`,{className:e,fill:`none`,viewBox:`0 0 24 24`,stroke:`currentColor`,strokeWidth:2,children:(0,A.jsx)(`path`,{strokeLinecap:`round`,strokeLinejoin:`round`,d:`M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z`})})}function M({className:e}){return(0,A.jsx)(`svg`,{className:e,viewBox:`0 0 24 24`,fill:`currentColor`,children:(0,A.jsx)(`path`,{d:`M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05a6.127 6.127 0 01-.253-1.72c0-3.571 3.354-6.467 7.503-6.467.256 0 .507.013.756.033C16.708 4.882 13.07 2.188 8.691 2.188zm-2.35 4.477a1.06 1.06 0 110 2.12 1.06 1.06 0 010-2.12zm4.7 0a1.06 1.06 0 110 2.12 1.06 1.06 0 010-2.12zM16.835 9.43c-3.59 0-6.503 2.524-6.503 5.635 0 3.11 2.913 5.635 6.503 5.635a7.76 7.76 0 002.272-.337.693.693 0 01.572.079l1.527.89a.262.262 0 00.134.044.236.236 0 00.233-.237c0-.058-.023-.114-.038-.17l-.313-1.188a.473.473 0 01.17-.532C23.024 18.48 24 16.855 24 15.065c0-3.11-2.913-5.635-6.503-5.635h-.662zm-2.6 3.578a.882.882 0 110 1.764.882.882 0 010-1.764zm3.823 0a.882.882 0 110 1.764.882.882 0 010-1.764z`})})}function N({className:e}){return(0,A.jsx)(`svg`,{className:e,viewBox:`0 0 24 24`,fill:`currentColor`,children:(0,A.jsx)(`path`,{d:`M10.098 20.323c-3.977.391-7.414-1.406-7.672-4.02-.259-2.609 2.759-5.047 6.74-5.441 3.979-.394 7.413 1.404 7.671 4.018.259 2.6-2.759 5.049-6.739 5.443zM9.05 17.219c-.384.616-1.208.884-1.829.602-.612-.279-.793-.991-.406-1.593.379-.595 1.176-.861 1.793-.583.631.283.822.991.442 1.574zm1.27-1.627c-.141.237-.449.353-.689.253-.236-.09-.307-.361-.164-.585.14-.227.436-.346.672-.24.239.09.318.36.181.572zm.176-2.719c-1.893-.493-4.033.45-4.857 2.118-.836 1.704-.026 3.591 1.886 4.21 1.983.642 4.318-.341 5.132-2.179.8-1.793-.201-3.642-2.161-4.149zM17.014 2.575c.085-.075.253-.049.373.057.123.108.153.259.068.338-.086.078-.256.052-.377-.057-.121-.107-.151-.259-.064-.338zm-.747-.677c.424-.376 1.17-.336 1.666.089.498.427.543 1.093.119 1.469-.424.376-1.168.336-1.664-.089-.498-.427-.545-1.093-.121-1.469zm2.857 4.958c-.729-1.858-2.857-2.879-4.766-2.287-.322.104-.5.446-.396.768.104.322.446.5.768.396 1.267-.403 2.697.278 3.197 1.527.502 1.248.056 2.632-1.021 3.257-.289.168-.389.539-.221.828.168.289.539.389.828.221 1.59-.925 2.339-2.858 1.611-4.71z`})})}function P({className:e}){return(0,A.jsx)(`svg`,{className:e,viewBox:`0 0 24 24`,fill:`currentColor`,children:(0,A.jsx)(`path`,{d:`M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 13.2c-.18.53-.5 1.05-.97 1.53.04.15.06.3.06.45 0 .97-.71 1.82-1.73 1.82-.46 0-.88-.18-1.2-.48-.26.06-.54.1-.83.1s-.57-.04-.83-.1c-.32.3-.74.48-1.2.48-1.02 0-1.73-.85-1.73-1.82 0-.15.02-.3.06-.45-.47-.48-.79-1-.97-1.53-.2-.58-.2-1.08-.04-1.48.12-.3.32-.53.58-.68-.02-.18-.03-.36-.03-.54 0-2.76 2.24-5 5-5s5 2.24 5 5c0 .18-.01.36-.03.54.26.15.46.38.58.68.16.4.16.9-.04 1.48h-.08z`})})}function F({className:e,style:t}){return(0,A.jsx)(`svg`,{className:e,style:t,fill:`none`,viewBox:`0 0 24 24`,stroke:`currentColor`,strokeWidth:2,children:(0,A.jsx)(`path`,{strokeLinecap:`round`,strokeLinejoin:`round`,d:`M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z`})})}function I({className:e}){return(0,A.jsx)(`svg`,{className:e,fill:`none`,viewBox:`0 0 24 24`,stroke:`currentColor`,strokeWidth:2,children:(0,A.jsx)(`path`,{strokeLinecap:`round`,strokeLinejoin:`round`,d:`M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4`})})}function L({open:e,onOpenChange:t,trip:n}){let[r,u]=(0,C.useState)(!1),[d,f]=(0,C.useState)(!1),[p,m]=(0,C.useState)(!1),[h,_]=(0,C.useState)(!1),[v,y]=(0,C.useState)(null),[b,x]=(0,C.useState)(!1),S=(0,C.useRef)(null),D=(0,C.useRef)(null);(0,C.useEffect)(()=>()=>{S.current&&clearTimeout(S.current),D.current&&URL.revokeObjectURL(D.current)},[]);let O=w(n.id),k=`${n.destination} - GoNow AI 智能旅行规划`,L=`我正在使用 GoNow 规划${n.destination}之旅，${n.days.length}天精彩行程等你来看！`,R=[{id:`copy`,name:`复制链接`,description:`复制行程链接发送给好友`,icon:(0,A.jsx)(ne,{className:`size-6`})},{id:`wechat`,name:`微信分享`,description:`生成卡片，长按保存后分享`,icon:(0,A.jsx)(M,{className:`size-6`})},{id:`weibo`,name:`微博分享`,description:`一键分享到新浪微博`,icon:(0,A.jsx)(N,{className:`size-6`})},{id:`qq`,name:`QQ 分享`,description:`一键分享给 QQ 好友`,icon:(0,A.jsx)(P,{className:`size-6`})}],z=(0,C.useCallback)(async()=>{try{await navigator.clipboard.writeText(O),u(!0),S.current&&clearTimeout(S.current),S.current=setTimeout(()=>u(!1),2e3)}catch{let e=document.createElement(`textarea`);e.value=O,e.style.position=`fixed`,e.style.opacity=`0`,document.body.appendChild(e),e.select(),document.execCommand(`copy`),document.body.removeChild(e),u(!0),S.current&&clearTimeout(S.current),S.current=setTimeout(()=>u(!1),2e3)}},[O]),B=(0,C.useCallback)(async()=>{x(!0);try{D.current&&=(URL.revokeObjectURL(D.current),null);let e=await ee(n);D.current=e,y(e)}catch(e){console.error(`生成分享卡片失败:`,e)}finally{x(!1)}},[n]),V=(0,C.useCallback)(()=>{v&&te(v,`GoNow-${n.destination}-行程分享.png`)},[v,n.destination]),H=(0,C.useCallback)(e=>{switch(e){case`copy`:z();break;case`wechat`:B();break;case`weibo`:T(O,k);break;case`qq`:E(O,k,L);break}},[z,B,O,k,L]),U=(0,C.useCallback)(e=>{_(e),e&&(f(!0),m(!0))},[]);return(0,A.jsx)(c,{open:e,onOpenChange:t,children:(0,A.jsxs)(a,{className:`sm:max-w-md`,children:[(0,A.jsxs)(i,{children:[(0,A.jsxs)(o,{className:`flex items-center gap-2`,children:[(0,A.jsx)(F,{className:`size-5`,style:{color:`var(--gonow-primary)`}}),`分享行程`]}),(0,A.jsxs)(s,{children:[`将「`,n.destination,`」的行程分享给朋友`]})]}),(0,A.jsxs)(`div`,{className:`flex flex-col gap-4`,children:[(0,A.jsx)(`div`,{className:`grid grid-cols-2 gap-3`,children:R.map(e=>(0,A.jsxs)(`button`,{type:`button`,onClick:()=>H(e.id),className:`flex flex-col items-center gap-2 rounded-xl border bg-card p-4 transition-all hover:border-[var(--gonow-primary)] hover:shadow-md active:scale-[0.97]`,children:[(0,A.jsx)(`div`,{className:`flex size-12 items-center justify-center rounded-full`,style:{backgroundColor:e.id===`copy`?`var(--gonow-primary-light)`:e.id===`wechat`?`#E8F5E9`:e.id===`weibo`?`#FFF3E0`:`#E3F2FD`,color:e.id===`copy`?`var(--gonow-primary)`:e.id===`wechat`?`#07C160`:e.id===`weibo`?`#E6162D`:`#12B7F5`},children:e.icon}),(0,A.jsx)(`span`,{className:`text-sm font-medium`,style:{color:`var(--gonow-text)`},children:e.name}),(0,A.jsx)(`span`,{className:`text-xs text-muted-foreground text-center leading-tight`,children:e.description})]},e.id))}),r&&(0,A.jsxs)(`div`,{className:`flex items-center gap-2 rounded-lg px-3 py-2 text-sm`,style:{backgroundColor:`var(--gonow-primary-light)`,color:`var(--gonow-primary)`},children:[(0,A.jsx)(j,{className:`size-4`}),`链接已复制到剪贴板`]}),v&&(0,A.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,A.jsx)(`span`,{className:`text-sm font-medium`,style:{color:`var(--gonow-text)`},children:`分享卡片预览`}),(0,A.jsx)(`div`,{className:`overflow-hidden rounded-xl border`,children:(0,A.jsx)(`img`,{src:v,alt:`分享卡片`,className:`w-full`,style:{aspectRatio:`750 / 1000`}})}),(0,A.jsxs)(l,{onClick:V,className:`w-full gap-2`,style:{backgroundColor:`var(--gonow-primary)`,color:`#fff`},children:[(0,A.jsx)(I,{className:`size-4`}),`保存图片`]}),(0,A.jsx)(`p`,{className:`text-xs text-muted-foreground text-center`,children:`长按保存图片后，在微信中发送给好友`})]}),b&&(0,A.jsxs)(`div`,{className:`flex items-center justify-center gap-2 rounded-lg border p-4`,children:[(0,A.jsx)(`div`,{className:`size-4 animate-spin rounded-full border-2 border-t-transparent`,style:{borderColor:`var(--gonow-primary)`,borderTopColor:`transparent`}}),(0,A.jsx)(`span`,{className:`text-sm text-muted-foreground`,children:`正在生成分享卡片...`})]}),(0,A.jsx)(g,{}),(0,A.jsxs)(`div`,{className:`flex flex-col gap-3`,children:[(0,A.jsx)(`span`,{className:`text-sm font-medium`,style:{color:`var(--gonow-text)`},children:`隐私设置`}),(0,A.jsxs)(`label`,{className:`flex items-center gap-2 cursor-pointer select-none`,children:[(0,A.jsx)(`button`,{type:`button`,role:`checkbox`,"aria-checked":h,onClick:()=>U(!h),className:`relative inline-flex size-4 shrink-0 items-center justify-center rounded-sm border transition-colors`,style:{borderColor:h?`var(--gonow-primary)`:void 0,backgroundColor:h?`var(--gonow-primary)`:`transparent`},children:h&&(0,A.jsx)(j,{className:`size-3 text-white`})}),(0,A.jsx)(`span`,{className:`text-sm text-muted-foreground`,children:`仅显示基本信息`})]}),h&&(0,A.jsx)(`p`,{className:`text-xs text-muted-foreground/70 ml-6`,children:`仅展示目的地和日期，不包含任何行程详情`}),(0,A.jsxs)(`label`,{className:`flex items-center gap-2 cursor-pointer select-none`,children:[(0,A.jsx)(`button`,{type:`button`,role:`checkbox`,"aria-checked":d,onClick:()=>f(!d),className:`relative inline-flex size-4 shrink-0 items-center justify-center rounded-sm border transition-colors`,style:{borderColor:d?`var(--gonow-primary)`:void 0,backgroundColor:d?`var(--gonow-primary)`:`transparent`},children:d&&(0,A.jsx)(j,{className:`size-3 text-white`})}),(0,A.jsx)(`span`,{className:`text-sm text-muted-foreground`,children:`隐藏费用信息`})]}),d&&!h&&(0,A.jsx)(`p`,{className:`text-xs text-muted-foreground/70 ml-6`,children:`分享链接中将不显示任何费用相关内容`}),(0,A.jsxs)(`label`,{className:`flex items-center gap-2 cursor-pointer select-none`,children:[(0,A.jsx)(`button`,{type:`button`,role:`checkbox`,"aria-checked":p,onClick:()=>m(!p),className:`relative inline-flex size-4 shrink-0 items-center justify-center rounded-sm border transition-colors`,style:{borderColor:p?`var(--gonow-primary)`:void 0,backgroundColor:p?`var(--gonow-primary)`:`transparent`},children:p&&(0,A.jsx)(j,{className:`size-3 text-white`})}),(0,A.jsx)(`span`,{className:`text-sm text-muted-foreground`,children:`隐藏红黑榜信息`})]}),p&&!h&&(0,A.jsx)(`p`,{className:`text-xs text-muted-foreground/70 ml-6`,children:`分享链接中将不显示景点的红黑榜评价`})]})]})]})})}function R(e){let t=`gonow-print-styles`;if(e.getElementById(t))return;let n=e.createElement(`style`);n.id=t,n.textContent=`
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
  `,e.head.appendChild(n)}var z={scenic:`🏛️`,food:`🍜`,hotel:`🏨`,transport:`🚗`,culture:`🎭`},B={scenic:`景点`,food:`美食`,hotel:`住宿`,transport:`交通`,culture:`文化`};function V({trip:e}){let{destination:t,startDate:n,endDate:r,travelers:i,budget:a,days:o,weather:s}=e,c=o.length,l=o.reduce((e,t)=>e+t.totalCost,0),u=(0,C.useCallback)(()=>{let e={};for(let t of o)for(let n of t.activities)n.cost>0&&(e[n.type]=(e[n.type]||0)+n.cost);let u=[],d=[];for(let e of o)for(let t of e.activities)t.redBlackFlags?.redFlags&&u.push(...t.redBlackFlags.redFlags),t.redBlackFlags?.blackFlags&&d.push(...t.redBlackFlags.blackFlags);let f=[];if(s&&s.length>0){let e=Math.round(s.reduce((e,t)=>e+t.temperature,0)/s.length);f.push(`行程期间平均气温约 ${e}°C，请根据天气准备合适的衣物。`),s.some(e=>e.description.includes(`雨`)||e.description.includes(`Rain`))&&f.push(`部分日期可能有雨，建议携带雨具。`)}let p=o.map(e=>{let t=e.activities.map(e=>{let t=z[e.type]||`📍`,n=e.startTime&&e.endTime?`${e.startTime} - ${e.endTime}`:``,r=[...e.redBlackFlags?.redFlags?.map(e=>`<span class="print-red-flag">⚠ ${e}</span>`)||[],...e.redBlackFlags?.blackFlags?.map(e=>`<span class="print-black-flag">🚫 ${e}</span>`)||[]].join(`
              `);return`
              <div class="print-activity-item">
                <div class="print-activity-name">${t} ${e.name}</div>
                <div class="print-activity-meta">
                  ${n?`<span>🕐 ${n}</span>`:``}
                  ${e.cost>0?`<span class="print-activity-cost">¥${e.cost}</span>`:``}
                  ${e.rating>0?`<span>★ ${e.rating.toFixed(1)}</span>`:``}
                </div>
                ${e.description?`<div class="print-activity-desc">${e.description}</div>`:``}
                ${r?`\n              <div>${r}</div>`:``}
              </div>`}).join(`
`);return`
          <div class="print-day-section">
            <div class="print-day-header">
              <span class="print-day-number">${e.dayNumber}</span>
              <span class="print-day-title">${e.theme}</span>
              <span class="print-day-date">${e.date}</span>
            </div>
            <div class="print-activity-list">
              ${t}
            </div>
            <div class="print-day-subtotal">
              当日小计：<strong>¥${e.totalCost}</strong>
            </div>
          </div>`}).join(`
`),m=Object.entries(e).filter(([,e])=>e>0).map(([e,t])=>{let n=l>0?Math.round(t/l*100):0;return`
          <tr>
            <td>${z[e]} ${B[e]}</td>
            <td>¥${t}</td>
            <td>${n}%</td>
          </tr>`}).join(`
`),h=[];return f.length>0&&h.push(...f.map(e=>`<div class="print-tip-item">🌤️ ${e}</div>`)),u.length>0&&h.push(`<div class="print-tip-item">⚠️ 行程中有 ${u.length} 项需要注意的红旗提醒，请提前了解详情并做好备选方案。</div>`),d.length>0&&h.push(`<div class="print-tip-item">🚫 行程中有 ${d.length} 项严重警告，请务必确认后再前往。</div>`),h.length===0&&h.push(`<div class="print-tip-item">✨ 祝您旅途愉快！建议提前预订热门景点门票。</div>`),`
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>GoNow 旅行行程单 - ${t}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Noto Sans SC', sans-serif;
            font-size: 12px;
            line-height: 1.6;
            color: #1A1A2E;
            background: #FFFFFF;
            padding: 0;
          }
          .print-container {
            max-width: 180mm;
            margin: 0 auto;
            padding: 10mm 0;
          }
          .no-print {
            display: none;
          }
        </style>
      </head>
      <body>
        <div class="print-container">
          <!-- 标题区域 -->
          <div class="print-header">
            <h1>GoNow 旅行行程单</h1>
            <p class="subtitle">${t} | ${n} ~ ${r}</p>
          </div>

          <!-- 行程概览 -->
          <div class="print-overview">
            <div class="print-overview-item">
              <div class="value">${c}</div>
              <div class="label">行程天数</div>
            </div>
            <div class="print-overview-item">
              <div class="value">${i}</div>
              <div class="label">旅行人数</div>
            </div>
            <div class="print-overview-item">
              <div class="value">¥${a}</div>
              <div class="label">总预算</div>
            </div>
            <div class="print-overview-item">
              <div class="value">¥${l}</div>
              <div class="label">预计花费</div>
            </div>
          </div>

          <!-- 每日行程 -->
          ${p}

          <!-- 预算汇总 -->
          <div class="print-budget-section">
            <div class="print-budget-title">预算汇总</div>
            <table class="print-budget-table">
              <thead>
                <tr>
                  <th>类别</th>
                  <th>花费</th>
                  <th>占比</th>
                </tr>
              </thead>
              <tbody>
                ${m}
                <tr class="total-row">
                  <td>合计</td>
                  <td>¥${l}</td>
                  <td>100%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 温馨提示 -->
          <div class="print-tips-section">
            <div class="print-tips-title">温馨提示</div>
            ${h.join(`
`)}
          </div>

          <!-- 页脚 -->
          <div class="print-footer">
            <span class="brand">GoNow</span> 智能旅行规划 · 由 AI 智能规划生成
          </div>
        </div>

        <!-- 打印控制按钮（不打印） -->
        <div class="no-print" style="
          position: fixed;
          top: 20px;
          right: 20px;
          display: flex;
          gap: 10px;
          z-index: 9999;
        ">
          <button onclick="window.print()" style="
            padding: 10px 24px;
            background: linear-gradient(135deg, #FF6B35, #FF8F65);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
          ">
            🖨️ 打印 / 保存 PDF
          </button>
          <button onclick="window.close()" style="
            padding: 10px 24px;
            background: #F0F0F0;
            color: #666;
            border: none;
            border-radius: 10px;
            font-size: 14px;
            cursor: pointer;
          ">
            关闭
          </button>
        </div>
      </body>
      </html>`},[e,t,n,r,i,a,o,s,l]);return(0,A.jsxs)(`button`,{onClick:(0,C.useCallback)(()=>{let e=u(),t=window.open(``,`_blank`);if(!t){alert(`无法打开打印窗口，请检查浏览器是否阻止了弹出窗口。`);return}t.document.write(e),t.document.close(),t.onload=()=>{R(t.document)},setTimeout(()=>{R(t.document)},500)},[u]),className:`inline-flex items-center gap-1.5 shrink-0 px-3 py-1.5 text-sm font-medium text-white rounded-lg transition-all duration-200 hover:-translate-y-px`,style:{background:`linear-gradient(135deg, #FF6B35, #FF8F65)`,boxShadow:`0 2px 8px rgba(255, 107, 53, 0.25)`},title:`导出行程为 PDF`,children:[(0,A.jsx)(`svg`,{className:`size-4`,fill:`none`,viewBox:`0 0 24 24`,stroke:`currentColor`,strokeWidth:2,children:(0,A.jsx)(`path`,{strokeLinecap:`round`,strokeLinejoin:`round`,d:`M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z`})}),`导出 PDF`]})}var H={scenic:`#3b82f6`,food:`#f97316`,hotel:`#a855f7`,transport:`#9ca3af`,culture:`#ec4899`},U={scenic:`🏛️`,food:`🍜`,hotel:`🏨`,transport:`🚗`,culture:`🎭`},W=`#000000`;function G(){return new Promise((e,t)=>{if(window.AMap){e();return}t(Error(`未配置高德地图 API Key`))})}function K(){return(0,A.jsx)(`div`,{className:`relative w-full animate-pulse`,style:{height:`clamp(300px, 40vw, 400px)`},children:(0,A.jsxs)(`div`,{className:`absolute inset-0 rounded-2xl bg-muted/50`,children:[(0,A.jsxs)(`div`,{className:`absolute inset-0 opacity-20`,children:[Array.from({length:8}).map((e,t)=>(0,A.jsx)(`div`,{className:`absolute left-0 right-0 border-t border-muted-foreground/10`,style:{top:`${(t+1)*12}%`}},`h-${t}`)),Array.from({length:10}).map((e,t)=>(0,A.jsx)(`div`,{className:`absolute top-0 bottom-0 border-l border-muted-foreground/10`,style:{left:`${(t+1)*10}%`}},`v-${t}`))]}),(0,A.jsxs)(`div`,{className:`absolute inset-0 flex flex-col items-center justify-center gap-3`,children:[(0,A.jsx)(`div`,{className:`h-10 w-10 rounded-full border-2 border-muted-foreground/20 border-t-muted-foreground/60 animate-spin`}),(0,A.jsx)(`span`,{className:`text-sm text-muted-foreground`,children:`地图加载中...`})]})]})})}function q({onRetry:e}){return(0,A.jsxs)(`div`,{className:`relative w-full flex flex-col items-center justify-center gap-4 bg-muted/30`,style:{height:`clamp(300px, 40vw, 400px)`},children:[(0,A.jsxs)(`div`,{className:`flex flex-col items-center gap-2 text-muted-foreground`,children:[(0,A.jsx)(`svg`,{className:`size-10`,fill:`none`,viewBox:`0 0 24 24`,stroke:`currentColor`,strokeWidth:1.5,children:(0,A.jsx)(`path`,{strokeLinecap:`round`,strokeLinejoin:`round`,d:`M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z`})}),(0,A.jsx)(`p`,{className:`text-sm font-medium`,children:`地图加载失败`}),(0,A.jsx)(`p`,{className:`text-xs text-muted-foreground/70`,children:`请检查网络连接后重试`})]}),(0,A.jsx)(`button`,{onClick:e,className:`rounded-lg bg-foreground px-4 py-2 text-xs font-medium text-background transition-colors hover:bg-foreground/80`,children:`重新加载`})]})}function J(){return(0,A.jsx)(`div`,{className:`relative w-full flex items-center justify-center bg-muted/20`,style:{height:`clamp(300px, 40vw, 400px)`},children:(0,A.jsxs)(`div`,{className:`flex flex-col items-center gap-2 text-muted-foreground`,children:[(0,A.jsxs)(`svg`,{className:`size-8`,fill:`none`,viewBox:`0 0 24 24`,stroke:`currentColor`,strokeWidth:1.5,children:[(0,A.jsx)(`path`,{strokeLinecap:`round`,strokeLinejoin:`round`,d:`M15 10.5a3 3 0 11-6 0 3 3 0 016 0z`}),(0,A.jsx)(`path`,{strokeLinecap:`round`,strokeLinejoin:`round`,d:`M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z`})]}),(0,A.jsx)(`p`,{className:`text-sm`,children:`暂无行程点位`})]})})}function Y({activities:e,activeIndex:t}){let n=(0,C.useRef)(null),r=(0,C.useRef)(null),i=(0,C.useRef)([]),a=(0,C.useRef)(null),o=(0,C.useRef)(null),[s,c]=(0,C.useState)(`loading`),l=e.filter(e=>e.location?.lat&&e.location?.lng),u=(0,C.useCallback)(()=>{n.current&&(c(`loading`),G().then(()=>{if(!n.current)return;let e=l.length>0?[l[0].location.lng,l[0].location.lat]:[116.397428,39.90923],t=new AMap.Map(n.current,{zoom:12,center:e,mapStyle:`amap://styles/normal`,resizeEnable:!0,viewMode:`2D`});t.addControl(new AMap.Scale),t.addControl(new AMap.Zoom({position:`RB`})),r.current=t,c(`ready`)}).catch(()=>{c(`error`)}))},[l]);return(0,C.useEffect)(()=>(u(),()=>{r.current&&=(r.current.destroy(),null),i.current=[],a.current=null,o.current=null}),[u]),(0,C.useEffect)(()=>{if(!n.current||s!==`ready`)return;let e=new ResizeObserver(()=>{r.current&&r.current.resize()});return e.observe(n.current),()=>{e.disconnect()}},[s]),(0,C.useEffect)(()=>{if(s!==`ready`||!r.current)return;let e=r.current;if(i.current.forEach(e=>e.setMap(null)),i.current=[],a.current&&=(a.current.setMap(null),null),o.current&&=(o.current.close(),null),l.length===0)return;let n=new AMap.InfoWindow({isCustom:!0,offset:new AMap.Pixel(0,-40),autoMove:!0});o.current=n;let c=l.map((r,i)=>{let a=i===t,o=H[r.type],s=U[r.type],c=new AMap.Marker({position:[r.location.lng,r.location.lat],title:r.name,zIndex:a?200:100,content:`
          <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            transform: translate(-50%, -50%);
            cursor: pointer;
          ">
            ${a?`<div style="
              background: ${W};
              color: #fff;
              padding: 3px 10px;
              border-radius: 6px;
              font-size: 12px;
              font-weight: 500;
              white-space: nowrap;
              margin-bottom: 4px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.25);
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            ">${r.name}</div>`:``}
            <div style="
              width: ${a?42:34}px;
              height: ${a?42:34}px;
              border-radius: 50%;
              background-color: ${o};
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: ${a?18:15}px;
              box-shadow: ${a?`0 0 0 4px ${o}33, 0 4px 14px rgba(0,0,0,0.25)`:`0 2px 8px rgba(0,0,0,0.18)`};
              transition: all 0.3s ease;
              border: 2px solid rgba(255,255,255,0.8);
            ">
              ${s}
            </div>
            <div style="
              margin-top: 3px;
              background: rgba(255,255,255,0.95);
              border: 1px solid rgba(0,0,0,0.08);
              border-radius: 9999px;
              padding: 1px 7px;
              font-size: 10px;
              font-weight: 700;
              line-height: 1.4;
              color: ${a?W:`#666`};
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            ">${i+1}</div>
          </div>
        `,offset:new AMap.Pixel(0,0)});return c.on(`click`,()=>{let t=`
          <div style="
            padding: 14px 16px;
            min-width: 200px;
            max-width: 280px;
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.08);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            position: relative;
          ">
            <div style="
              position: absolute;
              bottom: -6px;
              left: 50%;
              transform: translateX(-50%) rotate(45deg);
              width: 12px;
              height: 12px;
              background: #fff;
              box-shadow: 2px 2px 4px rgba(0,0,0,0.08);
            "></div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <span style="font-size: 20px;">${s}</span>
              <h3 style="
                margin: 0;
                font-size: 14px;
                font-weight: 600;
                color: ${W};
                line-height: 1.3;
              ">${r.name}</h3>
            </div>
            ${r.description?`<p style="
              margin: 0 0 8px 0;
              font-size: 12px;
              color: #666;
              line-height: 1.5;
              display: -webkit-box;
              -webkit-line-clamp: 3;
              -webkit-box-orient: vertical;
              overflow: hidden;
            ">${r.description}</p>`:``}
            <div style="
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding-top: 8px;
              border-top: 1px solid #f0f0f0;
            ">
              <span style="
                font-size: 16px;
                font-weight: 700;
                color: ${o};
              ">¥${r.cost}</span>
              ${r.rating?`<span style="
                font-size: 11px;
                color: #999;
              ">${`★`.repeat(Math.round(r.rating))}${`☆`.repeat(5-Math.round(r.rating))} ${r.rating}</span>`:``}
            </div>
          </div>
        `;n.setContent(t),n.open(e,c.getPosition())}),c});if(i.current=c,e.add(c),l.length>=2){let t=l.map(e=>[e.location.lng,e.location.lat]),n=new AMap.Polyline({path:t,strokeColor:W,strokeWeight:3,strokeOpacity:.4,strokeStyle:`solid`,lineJoin:`round`,lineCap:`round`,showDir:!0});a.current=n,e.add(n)}c.length>0&&e.setFitView(c,!1,[60,60,60,60])},[s,l,t]),(0,A.jsxs)(`div`,{className:`relative w-full overflow-hidden`,style:{borderRadius:`16px`,boxShadow:`0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)`},children:[s===`loading`&&(0,A.jsx)(K,{}),s===`error`&&(0,A.jsx)(q,{onRetry:u}),s===`ready`&&(0,A.jsx)(A.Fragment,{children:l.length===0?(0,A.jsx)(J,{}):(0,A.jsx)(`div`,{ref:n,className:`relative w-full`,style:{height:`clamp(300px, 40vw, 400px)`,borderRadius:`16px`,overflow:`hidden`}})})]})}function X(e){switch(e){case`晴`:return`☀️`;case`多云`:return`⛅`;case`阴`:return`☁️`;case`小雨`:return`🌧️`;case`中雨`:return`🌧️`;case`大雨`:return`🌧️`;case`雷阵雨`:return`⛈️`;default:return`🌤️`}}function re(e){return e>=30?`炎热，建议穿短袖短裤，注意防晒`:e>=25?`温暖，建议穿轻薄衣物，可备薄外套`:e>=20?`舒适，建议穿长袖或薄外套`:e>=15?`微凉，建议穿外套或薄毛衣`:e>=10?`较冷，建议穿厚外套或毛衣`:`寒冷，建议穿羽绒服，注意保暖`}function ie(e,t){let n=new Date(t).getMonth()+1,r,i=e.toLowerCase();r=i.includes(`三亚`)||i.includes(`海南`)||i.includes(`海口`)?n>=5&&n<=9?32:25:i.includes(`哈尔滨`)||i.includes(`长春`)||i.includes(`冰雪`)?n>=6&&n<=8?26:n>=12||n<=2?-10:10:i.includes(`拉萨`)||i.includes(`昆明`)||i.includes(`大理`)?n>=5&&n<=9?22:10:i.includes(`北京`)||i.includes(`天津`)||i.includes(`河北`)?n>=6&&n<=8?30:n>=12||n<=2?-2:15:i.includes(`广州`)||i.includes(`深圳`)||i.includes(`汕头`)||i.includes(`潮汕`)?n>=5&&n<=9?30:18:i.includes(`成都`)||i.includes(`重庆`)||i.includes(`长沙`)?n>=6&&n<=8?32:n>=12||n<=2?8:18:n>=5&&n<=9?28:18;let a=[`晴`,`多云`,`阴`,`小雨`],o=t.split(`-`).reduce((e,t)=>e+parseInt(t),0);return{description:a[o%a.length],temperature:r+o%5-2,humidity:60+o%30,wind:`东南风 3-4级`}}function ae(e){return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,`0`)}-${String(e.getDate()).padStart(2,`0`)}`}function oe(e,t){let n=[],r=new Date(e),i=new Date(t),a=new Date(r);for(;a<=i;)n.push(ae(a)),a.setDate(a.getDate()+1);return n}function se(e){let t=new Date(e);return`${t.getMonth()+1}/${t.getDate()}`}function ce(e){return[`周日`,`周一`,`周二`,`周三`,`周四`,`周五`,`周六`][new Date(e).getDay()]}async function le(e,t){try{let n=new URLSearchParams({city:e,date:t}),r=await fetch(`/api/weather?${n}`);if(!r.ok)return console.warn(`天气 API 请求失败: ${r.status}`),null;let i=await r.json();return!i.success||!i.data?(console.warn(`天气 API 返回数据无效`),null):i.data}catch(e){return console.warn(`天气 API 调用异常:`,e),null}}function ue({destination:e,startDate:t,endDate:n}){let r=(0,C.useMemo)(()=>oe(t,n),[t,n]),[i,a]=(0,C.useState)([]),[o,s]=(0,C.useState)(!1);(0,C.useEffect)(()=>{if(!e||r.length===0)return;let t=!1;return s(!0),(async()=>{let n=await Promise.all(r.map(async t=>await le(e,t)||ie(e,t)));t||(a(n),s(!1))})(),()=>{t=!0}},[r,e]);let c=i.map(e=>e.temperature),l=c.length>0?Math.min(...c):0,u=c.length>0?Math.max(...c):0,d=re(c.length>0?Math.round(c.reduce((e,t)=>e+t,0)/c.length):20);return(0,A.jsx)(h,{children:(0,A.jsx)(m,{className:`py-3`,children:(0,A.jsxs)(`div`,{className:`flex flex-col gap-3`,children:[(0,A.jsxs)(`div`,{className:`flex items-center justify-between`,children:[(0,A.jsxs)(`div`,{children:[(0,A.jsxs)(`div`,{className:`text-sm font-medium`,children:[e,` 天气预报`]}),(0,A.jsxs)(`div`,{className:`text-xs text-muted-foreground`,children:[t,` ~ `,n,` | `,l,`°C ~ `,u,`°C`]})]}),(0,A.jsx)(`div`,{className:`text-xs text-muted-foreground bg-muted/50 rounded-md px-2 py-1`,children:d})]}),o&&i.length===0?(0,A.jsx)(`div`,{className:`flex items-center justify-center py-4`,children:(0,A.jsxs)(`div`,{className:`flex items-center gap-2 text-sm text-muted-foreground`,children:[(0,A.jsxs)(`svg`,{className:`animate-spin size-4`,viewBox:`0 0 24 24`,fill:`none`,children:[(0,A.jsx)(`circle`,{className:`opacity-25`,cx:`12`,cy:`12`,r:`10`,stroke:`currentColor`,strokeWidth:`4`}),(0,A.jsx)(`path`,{className:`opacity-75`,fill:`currentColor`,d:`M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z`})]}),`加载天气数据中...`]})}):(0,A.jsx)(`div`,{className:`flex gap-2 overflow-x-auto pb-1 -mx-1 px-1`,children:i.map((e,t)=>(0,A.jsxs)(`div`,{className:`flex-shrink-0 flex flex-col items-center gap-1 bg-muted/40 rounded-lg px-3 py-2 min-w-[72px]`,children:[(0,A.jsx)(`span`,{className:`text-[10px] text-muted-foreground`,children:ce(r[t])}),(0,A.jsx)(`span`,{className:`text-xs font-medium`,children:se(r[t])}),(0,A.jsx)(`span`,{className:`text-xl leading-none`,children:X(e.description)}),(0,A.jsxs)(`span`,{className:`text-xs font-medium`,children:[e.temperature,`°C`]}),(0,A.jsx)(`span`,{className:`text-[10px] text-muted-foreground`,children:e.description})]},r[t]))})]})})})}var Z={scenic:`景点`,food:`美食`,hotel:`住宿`,transport:`交通`,culture:`文化`},Q={food:`🍜`,scenic:`🏛️`,transport:`🚗`,hotel:`🏨`,culture:`🎭`},de={scenic:`bg-blue-500`,food:`bg-orange-500`,hotel:`bg-purple-500`,transport:`bg-gray-400`,culture:`bg-pink-500`},$=`other`,fe=`其他`,pe=`🛒`,me=`bg-emerald-500`;function he(e,t,n){let r=[];if(t===0)return r;(e.food||0)/t*100>50&&r.push(`💰 美食占比超过 50%，可以尝试当地小吃街或平价餐厅，人均 30 元也能吃到地道美食。`),(e.transport||0)/t*100>30&&r.push(`🚗 交通花费偏高，建议使用公共交通或拼车出行，能节省不少费用。`);let i=n-t;return i<n*.2&&i>0&&r.push(`⚠️ 预算剩余不足 20%，建议优先保留核心景点，适当减少非必要消费。`),i<0&&r.push(`🔴 当前已超出预算，建议砍掉部分低评分活动或寻找免费替代景点。`),(!e.hotel||e.hotel===0)&&r.push(`🏨 当前行程未包含住宿费用，记得提前预订酒店并纳入预算哦。`),r.slice(0,2)}function ge({trip:e}){let{budget:t,days:n}=e,r=(0,C.useMemo)(()=>n.reduce((e,t)=>e+t.totalCost,0),[n]),i=t-r,a=(0,C.useMemo)(()=>{let e={};for(let t of n)for(let n of t.activities)n.cost>0&&(e[n.type]=(e[n.type]||0)+n.cost);return e},[n]),o=(0,C.useMemo)(()=>n.map(e=>e.totalCost),[n]),s=Math.max(...o,1),c=(0,C.useMemo)(()=>he(a,r,t),[a,r,t]),l=(0,C.useMemo)(()=>{let e=[];for(let t of Object.keys(Z))(a[t]||0)>0&&e.push(t);return(a[$]||0)>0&&e.push($),e},[a]),u=t>0?Math.min(r/t*100,100):0;return(0,A.jsxs)(h,{children:[(0,A.jsx)(p,{children:(0,A.jsx)(f,{children:`预算分解`})}),(0,A.jsxs)(m,{className:`flex flex-col gap-4`,children:[(0,A.jsxs)(`div`,{className:`grid grid-cols-3 gap-2 text-center`,children:[(0,A.jsxs)(`div`,{children:[(0,A.jsx)(`div`,{className:`text-xs text-muted-foreground`,children:`总预算`}),(0,A.jsxs)(`div`,{className:`text-lg font-bold`,children:[`¥`,t]})]}),(0,A.jsxs)(`div`,{children:[(0,A.jsx)(`div`,{className:`text-xs text-muted-foreground`,children:`已花费`}),(0,A.jsxs)(`div`,{className:`text-lg font-bold text-orange-500`,children:[`¥`,r]})]}),(0,A.jsxs)(`div`,{children:[(0,A.jsx)(`div`,{className:`text-xs text-muted-foreground`,children:i>=0?`剩余`:`超支`}),(0,A.jsxs)(`div`,{className:`text-lg font-bold ${i>=0?`text-green-600`:`text-red-500`}`,children:[i>=0?`¥`:`-¥`,Math.abs(i)]})]})]}),(0,A.jsxs)(`div`,{children:[(0,A.jsxs)(`div`,{className:`flex items-center justify-between mb-1`,children:[(0,A.jsx)(`span`,{className:`text-xs text-muted-foreground`,children:`预算使用率`}),(0,A.jsxs)(`span`,{className:`text-xs font-medium`,children:[Math.round(u),`%`]})]}),(0,A.jsx)(`div`,{className:`h-2.5 w-full rounded-full bg-muted overflow-hidden`,children:(0,A.jsx)(`div`,{className:`h-full rounded-full transition-all duration-500 ${u>85?`bg-red-500`:u>60?`bg-yellow-500`:`bg-green-500`}`,style:{width:`${u}%`}})})]}),(0,A.jsxs)(`div`,{children:[(0,A.jsx)(`div`,{className:`text-sm font-medium mb-2`,children:`分类花费`}),(0,A.jsx)(`div`,{className:`flex flex-col gap-2`,children:l.map(e=>{let t=a[e]||0,n=r>0?Math.round(t/r*100):0,i=e in Z,o=i?Z[e]:fe,s=i?Q[e]:pe,c=i?de[e]:me;return(0,A.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,A.jsx)(`span`,{className:`text-base w-6 text-center shrink-0`,children:s}),(0,A.jsx)(`span`,{className:`text-sm w-10 shrink-0`,children:o}),(0,A.jsx)(`div`,{className:`flex-1 h-2 rounded-full bg-muted overflow-hidden`,children:(0,A.jsx)(`div`,{className:`h-full rounded-full ${c} transition-all duration-300`,style:{width:`${n}%`}})}),(0,A.jsxs)(`span`,{className:`text-xs text-muted-foreground whitespace-nowrap w-16 text-right`,children:[`¥`,t]}),(0,A.jsxs)(`span`,{className:`text-[10px] text-muted-foreground w-8 text-right`,children:[`(`,n,`%)`]})]},e)})})]}),(0,A.jsxs)(`div`,{children:[(0,A.jsx)(`div`,{className:`text-sm font-medium mb-2`,children:`每日花费趋势`}),(0,A.jsx)(`div`,{className:`flex items-end gap-2 h-28`,children:o.map((e,t)=>{let n=s>0?e/s*100:0;return(0,A.jsxs)(`div`,{className:`flex-1 flex flex-col items-center gap-1`,children:[(0,A.jsxs)(`span`,{className:`text-[10px] text-muted-foreground`,children:[`¥`,e]}),(0,A.jsx)(`div`,{className:`w-full flex items-end`,style:{height:`80px`},children:(0,A.jsx)(`div`,{className:`w-full rounded-t-sm bg-primary/80 transition-all duration-300`,style:{height:`${Math.max(n,4)}%`}})}),(0,A.jsxs)(`span`,{className:`text-[10px] text-muted-foreground`,children:[`Day `,t+1]})]},t)})})]}),c.length>0&&(0,A.jsxs)(`div`,{children:[(0,A.jsx)(`div`,{className:`text-sm font-medium mb-2`,children:`省钱建议`}),(0,A.jsx)(`div`,{className:`flex flex-col gap-1.5`,children:c.map((e,t)=>(0,A.jsx)(`div`,{className:`text-xs text-muted-foreground bg-muted/50 rounded-md px-3 py-2`,children:e},t))})]})]})]})}var _e={scenic:`景点`,food:`美食`,hotel:`住宿`,transport:`交通`,culture:`文化`},ve={scenic:`bg-blue-500`,food:`bg-orange-500`,hotel:`bg-purple-500`,transport:`bg-gray-400`,culture:`bg-pink-500`};function ye({trip:e}){let{destination:t,startDate:n,endDate:r,travelers:i,budget:a,days:o,description:s}=e,c=o.length,u=(0,C.useMemo)(()=>o.reduce((e,t)=>e+t.totalCost,0),[o]),d=(0,C.useMemo)(()=>{let e={};for(let t of o)for(let n of t.activities)n.cost>0&&(e[n.type]=(e[n.type]||0)+n.cost);return e},[o]),[f,p]=(0,C.useState)(0),[S,w]=(0,C.useState)(!1),[T,E]=(0,C.useState)(void 0),D=o[f]?.activities??[],O=(0,C.useCallback)(e=>{p(Number(e)),E(void 0)},[]);return(0,A.jsxs)(`div`,{className:`flex flex-col gap-5`,children:[(0,A.jsx)(h,{className:`card-accent-left border-none`,style:{boxShadow:`var(--gonow-shadow)`,borderRadius:`var(--gonow-radius)`,background:`var(--gonow-card)`},children:(0,A.jsx)(m,{className:`py-4 pl-6`,children:(0,A.jsxs)(`div`,{className:`flex flex-col gap-3`,children:[(0,A.jsxs)(`div`,{className:`flex items-start justify-between gap-2`,children:[(0,A.jsxs)(`div`,{className:`flex-1 min-w-0`,children:[(0,A.jsx)(`h2`,{className:`text-xl font-bold tracking-tight`,style:{color:`var(--gonow-text)`},children:t}),s&&(0,A.jsx)(`p`,{className:`text-sm text-muted-foreground mt-0.5`,children:s})]}),(0,A.jsxs)(`div`,{className:`flex items-center gap-2 shrink-0`,children:[(0,A.jsx)(V,{trip:e}),(0,A.jsxs)(l,{size:`sm`,onClick:()=>w(!0),className:`shrink-0 gap-1.5`,style:{backgroundColor:`var(--gonow-primary)`,color:`#fff`,border:`none`},children:[(0,A.jsx)(`svg`,{className:`size-4`,fill:`none`,viewBox:`0 0 24 24`,stroke:`currentColor`,strokeWidth:2,children:(0,A.jsx)(`path`,{strokeLinecap:`round`,strokeLinejoin:`round`,d:`M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z`})}),`分享`]})]})]}),(0,A.jsxs)(`div`,{className:`flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground`,children:[(0,A.jsxs)(`span`,{className:`inline-flex items-center gap-1`,children:[(0,A.jsx)(`svg`,{className:`size-4`,fill:`none`,viewBox:`0 0 24 24`,stroke:`currentColor`,strokeWidth:2,children:(0,A.jsx)(`path`,{strokeLinecap:`round`,strokeLinejoin:`round`,d:`M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z`})}),n,` ~ `,r]}),(0,A.jsxs)(`span`,{className:`inline-flex items-center gap-1`,children:[(0,A.jsx)(`svg`,{className:`size-4`,fill:`none`,viewBox:`0 0 24 24`,stroke:`currentColor`,strokeWidth:2,children:(0,A.jsx)(`path`,{strokeLinecap:`round`,strokeLinejoin:`round`,d:`M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z`})}),i,` 人`]}),(0,A.jsxs)(`span`,{className:`inline-flex items-center gap-1`,children:[(0,A.jsx)(`svg`,{className:`size-4`,fill:`none`,viewBox:`0 0 24 24`,stroke:`currentColor`,strokeWidth:2,children:(0,A.jsx)(`path`,{strokeLinecap:`round`,strokeLinejoin:`round`,d:`M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z`})}),c,` 天`]})]}),(0,A.jsx)(g,{}),(0,A.jsxs)(`div`,{children:[(0,A.jsxs)(`div`,{className:`flex items-center justify-between mb-2`,children:[(0,A.jsx)(`span`,{className:`text-sm font-medium`,style:{color:`var(--gonow-text)`},children:`预算概览`}),(0,A.jsxs)(`span`,{className:`text-sm text-muted-foreground`,children:[`已规划 `,(0,A.jsxs)(`span`,{className:`font-semibold`,style:{color:`var(--gonow-primary)`},children:[`¥`,u]}),` / 总预算 ¥`,a]})]}),(0,A.jsx)(`div`,{className:`h-2.5 w-full rounded-full overflow-hidden`,style:{backgroundColor:`var(--gonow-primary-light)`},children:(0,A.jsx)(`div`,{className:`h-full progress-gonow`,style:{width:`${Math.min(u/a*100,100)}%`}})}),(0,A.jsx)(`div`,{className:`flex flex-wrap gap-3 mt-3`,children:Object.entries(d).map(([e,t])=>{let n=u>0?Math.round(t/u*100):0;return(0,A.jsxs)(`div`,{className:`flex items-center gap-1.5 text-xs text-muted-foreground`,children:[(0,A.jsx)(`span`,{className:`inline-block h-2.5 w-2.5 rounded-sm ${ve[e]}`}),(0,A.jsxs)(`span`,{children:[_e[e],` ¥`,t]}),(0,A.jsxs)(`span`,{className:`text-[10px]`,children:[`(`,n,`%)`]})]},e)})})]})]})})}),(0,A.jsx)(ue,{destination:t,startDate:n,endDate:r}),(0,A.jsx)(Y,{activities:D,activeIndex:T}),(0,A.jsx)(ge,{trip:e}),(0,A.jsxs)(x,{value:String(f),onValueChange:O,children:[(0,A.jsx)(b,{variant:`line`,className:`w-full overflow-x-auto`,children:o.map(e=>(0,A.jsxs)(v,{value:String(e.dayNumber-1),children:[`Day `,e.dayNumber]},e.dayNumber))}),o.map((e,t)=>(0,A.jsx)(y,{value:String(t),children:(0,A.jsx)(h,{className:`border-none`,style:{boxShadow:`var(--gonow-shadow-sm)`,borderRadius:`var(--gonow-radius)`,background:`var(--gonow-card)`},children:(0,A.jsx)(m,{className:`py-4`,children:(0,A.jsx)(_,{day:e,dayIndex:t,onActivityClick:E})})})},e.dayNumber))]}),(0,A.jsx)(L,{open:S,onOpenChange:w,trip:e})]})}function be(){let e=S(e=>e.currentTrip),t=r(),[n,i]=(0,C.useState)(``);return(0,C.useEffect)(()=>{let e=()=>{i(u(d()))};e();let t=setInterval(e,1e4);return()=>clearInterval(t)},[]),(0,A.jsxs)(`div`,{className:`flex flex-col gap-6`,children:[(0,A.jsxs)(`div`,{className:`page-title-bar`,children:[(0,A.jsx)(`h1`,{className:`text-2xl font-bold tracking-tight`,style:{color:`var(--gonow-text)`},children:`我的行程`}),(0,A.jsx)(`p`,{className:`text-sm mt-1`,style:{color:`var(--gonow-text-secondary)`},children:`通过 AI 对话生成你的专属旅行计划`})]}),e?(0,A.jsx)(ye,{trip:e}):(0,A.jsx)(h,{className:`border-none overflow-hidden`,style:{boxShadow:`var(--gonow-shadow)`,borderRadius:`var(--gonow-radius)`,background:`var(--gonow-card)`},children:(0,A.jsxs)(m,{className:`flex flex-col items-center justify-center py-16 gap-5 relative`,children:[(0,A.jsxs)(`div`,{className:`empty-state-illustration flex flex-col items-center gap-4`,children:[(0,A.jsxs)(`div`,{className:`relative`,children:[(0,A.jsx)(`div`,{className:`absolute inset-0 rounded-full animate-pulse-soft`,style:{background:`radial-gradient(circle, rgba(255,107,53,0.15) 0%, transparent 70%)`,transform:`scale(1.5)`}}),(0,A.jsx)(`div`,{className:`relative flex items-center justify-center w-20 h-20 rounded-full`,style:{backgroundColor:`var(--gonow-primary-light)`},children:(0,A.jsx)(`span`,{className:`text-4xl`,children:`✈️`})})]}),(0,A.jsxs)(`div`,{className:`flex items-center gap-3 opacity-40`,children:[(0,A.jsx)(`span`,{className:`text-lg animate-float`,children:`🗺️`}),(0,A.jsx)(`span`,{className:`text-sm animate-float-slow`,children:`📍`}),(0,A.jsx)(`span`,{className:`text-lg animate-float-fast`,children:`🎒`})]})]}),(0,A.jsxs)(`div`,{className:`text-center relative z-10`,children:[(0,A.jsx)(`p`,{className:`font-semibold text-base mb-1`,style:{color:`var(--gonow-text)`},children:`还没有行程`}),(0,A.jsx)(`p`,{className:`text-sm mb-5`,style:{color:`var(--gonow-text-secondary)`},children:`回到首页开始规划你的第一次旅行吧`}),(0,A.jsx)(l,{onClick:()=>t(`/chat`),className:`rounded-xl px-6 h-10 font-semibold`,style:{backgroundColor:`var(--gonow-primary)`,color:`white`},children:`去规划旅行`})]})]})}),(0,A.jsxs)(`div`,{className:`flex items-center justify-center gap-2 pt-2 pb-4`,children:[(0,A.jsx)(`svg`,{className:`w-3.5 h-3.5 shrink-0`,style:{color:`var(--gonow-success)`},fill:`none`,viewBox:`0 0 24 24`,stroke:`currentColor`,strokeWidth:2,children:(0,A.jsx)(`path`,{strokeLinecap:`round`,strokeLinejoin:`round`,d:`M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z`})}),(0,A.jsxs)(`span`,{className:`text-xs`,style:{color:`var(--gonow-text-muted)`},children:[`数据已自动保存到本地`,n&&(0,A.jsxs)(`span`,{className:`ml-1 opacity-70`,children:[`(`,n,`)`]})]})]})]})}export{be as default};