# ClassMate AI — 教學指南網站

[ai-classmate.com/guide](https://ai-classmate.com/guide) 的教學指南網站原始碼，為 [ClassMate AI 智慧班級經營系統](https://ai-classmate.com) 提供功能教學與操作說明。

## Tech Stack

- React 19 + TypeScript + Vite
- Tailwind CSS 4
- React Router（頁面路由）
- Puppeteer（自動截圖腳本）

## 開發

請使用 Node.js 20。

```bash
# 安裝依賴
cd guide
npm ci

# 啟動開發伺服器 (localhost:3001)
npm run dev

# 型別檢查、capture guard 測試與建置
npm run verify
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

Capture 會清除並重建示範資料，因此只能連到本機 Firebase Emulator。全新 emulator 的完整流程如下：

1. 在主 App checkout 使用 Node.js 20 安裝依賴，並啟動明確指定 `demo-classmate-ai` 的 Auth、Firestore 與 Functions Emulator：

   ```bash
   npm ci
   npm run emulators
   ```

2. 在主 App checkout 的另一個終端啟動 test mode；頁面必須位於 `http://localhost:3000`，並顯示 development + emulator 標記：

   ```bash
   npm run dev -- --mode test
   ```

3. 在本 Guide checkout 的另一個終端執行 capture：

   ```bash
   cd guide
   npm ci
   npm run capture
   ```

Capture 會先驗證主 App 的安全標記，驗證通過後才向 `http://127.0.0.1:9099` 的 Auth Emulator 建立示範帳號 `test_demo@school.com`（密碼 `123456`）。帳號已存在時會直接沿用；缺少安全標記、遠端 Auth endpoint、provisioning 失敗或任何 capture 錯誤都會讓命令以非零狀態結束。不得以 production 或 remote Firebase 設定執行 capture。

安全檢查完成後，`npm run capture` 會自動：

1. 登入測試帳號
2. 清除所有舊資料（學生、白板）
3. 匯入 8 位示範學生 + 行為紀錄 + 白板內容
4. 逐一截取各功能的操作畫面，產生 animated WebP

## 部署

透過 GitHub Actions 自動部署至 GitHub Pages，部署在主網站的 `/guide` 路徑下。
