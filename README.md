# ClassMate AI — 教學指南網站

[ai-classmate.com/guide](https://ai-classmate.com/guide) 的教學指南網站原始碼，為 [ClassMate AI 智慧班級經營系統](https://ai-classmate.com) 提供功能教學與操作說明。

## Tech Stack

- React 19 + TypeScript + Vite
- Tailwind CSS 4
- React Router（頁面路由）
- Puppeteer（自動截圖腳本）

## 開發

```bash
# 安裝依賴
cd guide
npm install

# 啟動開發伺服器 (localhost:3001)
npm run dev

# 產生截圖（需要主 App 在 localhost:3000 運行）
npm run capture

# 建置
npm run build
```

## 專案結構

```
guide/
├── pages/              # 頁面
│   ├── LandingPage.tsx       # 首頁
│   ├── QuickStartPage.tsx    # 快速開始
│   ├── FaqPage.tsx           # 常見問題
│   └── tutorials/            # 功能教學頁面
├── components/         # 共用元件
├── scripts/            # Puppeteer 自動截圖腳本
│   ├── capture.ts            # 截圖主流程
│   ├── seedData.ts           # 測試資料 seed / clean
│   ├── captureUtils.ts       # 截圖工具函式
│   └── scenes/               # 各功能截圖場景
└── public/images/      # 產出的 animated WebP 截圖
```

## 截圖流程

`npm run capture` 會自動：

1. 登入測試帳號
2. 清除所有舊資料（學生、白板）
3. 匯入 8 位示範學生 + 行為紀錄 + 白板內容
4. 逐一截取各功能的操作畫面，產生 animated WebP

## 部署

透過 GitHub Actions 自動部署至 GitHub Pages，部署在主網站的 `/guide` 路徑下。
