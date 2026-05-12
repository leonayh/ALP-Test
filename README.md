# ALP 官網 Demo — 永聯物流

依 Figma 設計稿切版的靜態 HTML demo，用於客戶提報展示。

## 設計來源

- Figma file: `TcWVxG7J06yV1wkM28XvHO` — 2025 官網改版_UI 執行
- Desktop EN: node `3094-6249`
- Mobile EN:  node `2822-8161`

## 技術棧

純 HTML + CSS + Vanilla JS（無框架、無 build step）。
直接用瀏覽器打開 `index.html` 即可。

## 專案結構

```
├── index.html                     單一入口
├── styles/
│   ├── tokens.css                 設計 tokens（顏色 / 字級 / 間距）
│   ├── base.css                   reset + 共用 scroll-reveal / hl-bar
│   ├── header.css                 固定上方 header
│   ├── banner.css                 Hero + scroll-expand 動畫
│   ├── kpi.css                    4 欄 metrics（count-up）
│   ├── highlights.css             DNA 3 slides sticky 切換
│   ├── solution.css               sticky 左標題 + 3 tabs 卡片
│   ├── news.css                   1 + 2 cards
│   ├── map.css                    Rooted in Asia
│   ├── cta.css                    Define the Future
│   ├── footer.css                 黃色 logo + 連結
│   └── rwd.css                    1280 / 1024 / 768 / 480 斷點
├── scripts/
│   └── main.js                    所有動畫邏輯
├── assets/
│   └── images/                    （待 export 本地圖片，目前用 Figma CDN）
├── docs/
│   └── figma-export-checklist.md  要從 Figma export 的素材清單
├── legacy/                        原始 prototype + v1 / v2 舊版封存
└── hero_bn.mp4                    Hero 影片
```

## Figma Comment 動態對照（全部已實作）

| # | 區塊 | 動態需求 | 實作 |
|---|---|---|---|
| 1 | Hero | 往下滾動時 Hero_Frame 放大撐滿畫面 | ✅ scroll phase A |
| 2 | H1 黃底 | 黃塊從左向右展開 → 段落/按鈕淡入 | ✅ `scaleX(0→1)` + stagger |
| 3 | KPI | 數值 0 → 目標（Count-up）| ✅ IntersectionObserver |
| 4 | Highlights | sticky 卡屏、圖片縮小進場、gradient 左滑、title 淡入 | ✅ |
| 5 | Solution | title sticky | ✅ CSS `position: sticky` |
| 6 | Solution Card | hover img scale 1.1 | ✅ |
| 7 | News Card | hover img scale 1.1 | ✅ |
| 8 | Map | Taiwan → 國家 → 線條依序淡入 | ⚠️ 降級版（整塊 fade-in）— 需要分層素材才能做完整版 |

## TODO（待補素材）

1. 依 `docs/figma-export-checklist.md` 從 Figma export 11 張 WebP 放進 `assets/images/`，然後把 `index.html` 裡的 Figma CDN URL 換成本地路徑（CDN 連結 7 天會過期）
2. Map 若要完整動畫，需要「沒有 dots / labels / lines 的乾淨底圖」
