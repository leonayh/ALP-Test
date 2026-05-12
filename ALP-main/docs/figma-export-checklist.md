# Figma Export Checklist

來源：Figma 檔案 `TcWVxG7J06yV1wkM28XvHO` / node `2822:8168`（`index_desktop_EN`）

Export 設定建議：**WebP @ 2×（@2x scale）**，壓縮 80–85%。
存放路徑：`assets/images/`

---

## DNA / Highlights Slides（3 張）

| 檔名（export 成此名） | Figma Asset ID（目前用的暫時 URL） | 用途 | 建議格式 | 備註 |
|---|---|---|---|---|
| `dna-slide-simple.webp` | `dcc79e85-ce1f-4f51-9f40-ca89b876c7b0` | Slide 1 — Simple / One-stop solutions | WebP | 全螢幕背景，需高解析 |
| `dna-slide-smart.webp` | `56ead6bd-e3e4-4ea2-8bde-7c37b5843b07` | Slide 2 — Smart / Automated warehousing | WebP | 全螢幕背景 |
| `dna-slide-sustainable.webp` | `ad3ec14f-9445-4070-952c-c0ec6dfe5b55` | Slide 3 — Sustainable / Low-carbon operations | WebP | 全螢幕背景 |

---

## Solution Cards（7 張）

> ⚠️ **注意 img/label 對不上的 bug（原始 code 內）：**
> - `a526e945`（alt="O-Link"）的 HTML label 卻是 "Industry Hub"
> - `e9178499`（alt="Industry Hub"）的 HTML label 卻是 "O-Link"
>
> 這兩張圖的 alt 和 label 是**互換的**，export 時請依下表的用途確認正確圖片對應到正確 label。
>
> 另外 `dc9092f2` 被用了兩次（Omega 和 Q-Silver），疑似原始資料有誤，請確認 Q-Silver 是否應該是不同圖。

| 檔名 | Figma Asset ID | 對應 label | 所屬 Tab | 建議格式 |
|---|---|---|---|---|
| `sol-card-omega.webp` | `dc9092f2-2013-44b9-bb59-167c846dc7a0` | Omega | Smart Infrastructure | WebP |
| `sol-card-industry-hub.webp` | `a526e945-3bb1-43ef-a0da-c1c692002ad2` | Industry Hub | Smart Infrastructure | WebP |
| `sol-card-o-link.webp` | `e9178499-4cad-4aad-98ee-d0ca163a8eca` | O-Link | Smart Infrastructure | WebP |
| `sol-card-alpos.webp` | `3121a353-953d-4241-a85a-f59776edaab6` | ALPOS | Technology & Software | WebP |
| `sol-card-q-silver.webp` | `dc9092f2-2013-44b9-bb59-167c846dc7a0` | Q-Silver | Technology & Software | WebP ⚠️ 同 Omega，請確認 |
| `sol-card-mini-mega.webp` | `2faedfd8-0fa6-4cb3-a23a-fc7eb1d9cf44` | Mini Mega | Business Solutions | WebP |
| `sol-card-alp-park.webp` | `9fb76a45-a0ce-4bba-8548-158701bd61d5` | ALP Park | Business Solutions | WebP |

---

## Global Footprint Map（1 張）

| 檔名 | Figma Asset ID | 用途 | 建議格式 | 備註 |
|---|---|---|---|---|
| `map-global-footprint.webp` | `c014956e-cff7-423b-88e4-97c42108176d` | Map section 背景地圖 | WebP | 原始比例 1401×800px，請 export 原始尺寸 |

---

## 不需要 export 的資源

| 資源 | 原因 |
|---|---|
| ALP Logo（header + footer） | 已是 inline SVG，不需要圖片 |
| `hero_bn.mp4` | 已在 repo 本地 |
| News 卡片圖片 | 目前是 Unsplash placeholder URL — 等正式圖片確定後另外處理 |

---

## Export 完成後

把所有圖片放進 `assets/images/`，命名完全符合上表的「檔名」欄，`index.html` 裡的 `src` 已寫好對應路徑，放進去即生效。
