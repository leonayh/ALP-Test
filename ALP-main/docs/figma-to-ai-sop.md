# Figma × AI 切版 SOP — 給 UI 設計師

> 這份是今天這個專案跑完一輪後整理的經驗 SOP。未來新專案開始前，設計師依照這份文件準備 Figma 與溝通，可以大幅減少來回修改。
>
> 你不需要懂技術，只要照著節奏給東西、照著模板提問即可。

---

## 為什麼需要這份 SOP

今天的流程中，有些改了好幾次才對的地方：

- 字體（body 用 Outfit 還是 Avenir）
- 色票（缺 primary/90、secondary/30）
- H1 黃色螢光筆 line-height（1.2 vs 1）
- News / Solution 卡片圖片對不上設計稿
- Tag 文字是 `Category` 還是 `Events`
- Map 上面漏做小方塊點位
- Logo 顏色（header 該黑、footer 該白）
- Header 要不要隨頁面捲動

這些**大部分都是資訊斷層造成**：AI 看到 Figma 某個 frame，但那個 frame 不一定包含所有必要資訊（例如字體原規在另一個「設計系統」頁、真正的色票在 tokens 頁、動畫意圖在註解裡）。

所以這份 SOP 的核心是：**按順序把「基礎規範 → 元件庫 → 頁面 → 資產 → 互動」一次到位給我，而不是讓我從一張完成圖反推規則**。

---

## 一、Figma 檔案結構（設計師準備）

一份能讓 AI 精準切出來的 Figma，應該有以下 **5 個獨立頁面或章節**：

### 1️⃣ Design Tokens（設計代幣）
**必要，先交。**
- 🎨 **Color Palette**：所有色階 swatch + hex（primary 全階、secondary 全階、overlay、semantic）
- 🔤 **Typography Scale**：H1 / H2 / H3 / Body / Caption / Button — 字體名稱、字重、size、line-height、letter-spacing
- 📏 **Spacing**（如果有自訂）：常用的 gap / padding 數值

### 2️⃣ Component Library（元件庫）
**必要，在頁面之前交。**
- Button（所有變體：primary/secondary、dark bg/light bg、all sizes、default/hover/active）
- Text Link
- Tag / Label / Pill
- Input / Form 元件（若有）
- Icon Button
- Card（news / product / solution）
- Header（所有狀態：default、menu opened、sticky after scroll）
- Footer（variants）

每個元件都要標：用哪個 token、hover 怎麼變、幾種 size。

### 3️⃣ Full-page Layouts（完整頁面）
- Desktop 先（基準 1440）
- Tablet（768–1024）
- Mobile（≤ 480）
- 每個斷點都要有**實際內容**（不要用 lorem ipsum 或「Text Text Text」，AI 會以為那就是最終文字）

### 4️⃣ Interactions & Animations（互動與動畫）
- 用 Figma 的 **Prototype** 或 **Annotations** 標註：
  - scroll-linked 動畫（捲動到哪觸發什麼）
  - hover / click 效果
  - 時序（duration、delay、overlap、ease）
- 有影片示範的話附連結

### 5️⃣ Assets Export（圖片資產）
- 所有實際要用的圖片，獨立存檔給 RD
- **不要依賴 Figma MCP asset URL** — 那個 URL 只活 7 天就失效，會掉圖

---

## 二、溝通順序（第一次開案）

> 按這個順序對話，AI 就能從基礎往上建，錯誤率最低。

1. **「這是字體跟色票」** — 先給 tokens frame 的 Figma URL 或截圖
   > 範例話術：「這個 node 是我的 design tokens，包含所有顏色跟字體。請你先照這個建 CSS 變數。」

2. **「這是 component library」** — 再給元件庫 URL
   > 範例話術：「這個 node 是 button / tag / header 等元件。所有狀態都在這，請你照這個切共用元件。」

3. **「這是完整頁面」** — 最後才給完整的頁面設計
   > 範例話術：「這是 desktop 版本的完整頁，其他區塊請依你剛才建好的元件和 token 套用。」

4. **「這些是圖片」** — 把實際圖片（PNG/JPG/WebP）打包或上傳給 AI / 放進 repo
   > ⚠️ 不要只給 Figma URL，因為會過期。

5. **「這邊有動畫」** — 需要動畫的區塊逐一描述
   > 範例話術：「這段 hero 捲動時要放大到滿版，滿版後頁面才繼續捲動。」

---

## 三、給檔 Checklist（每次對話前自檢）

### 要給 AI 的資訊
- [ ] 這個區塊的 Figma node URL 或 node ID
- [ ] 這個區塊會用到哪些 token（如果不照預設）
- [ ] 這個區塊有沒有用到元件庫裡的元件（告訴 AI 哪個）
- [ ] 有動畫嗎？描述清楚時序
- [ ] 有斷點/RWD 差異嗎？
- [ ] 圖片是最終版還是 placeholder？

### 需要明確告訴 AI 的語句
- 顏色是 **token** 還是 **一次性例外**（例外的話要講明）
- 文字是最終內容還是 placeholder（Tag 用 `Category` 當預設其實很容易被 AI 誤會成最終文字）
- 元件是引用元件庫、還是這次特殊 custom

---

## 四、常見誤差 & 預防

| 誤差種類 | 今天的實例 | 預防方法 |
|---|---|---|
| 色票缺失 | `primary-90`、`secondary-30` 沒在 palette frame 但實際元件有用 | Palette frame 必須列出**所有實際會用到的色階**，包括僅用於單一元件的 |
| 字體錯誤 | Body 該用 Avenir，我一開始全站用 Outfit | Typography frame 必須**分開寫** Title（Outfit）和 Body（Avenir），不要讓 AI 猜 |
| Line-height | 黃底螢光筆文字該用 `1`，規格寫 `1.2` | 如果規格是 1.2 但視覺上要貼緊，**註明**「黃底緊貼文字」或「line-height 1」 |
| Tag 文字 | `Category` 我以為是真的要顯示「Category」 | Placeholder 要標`[placeholder]`，最終文字就寫真的文字 |
| 圖片對不上 | Solution 7 張卡片我用錯圖、Q-Silver 跟 Omega 重複 | 每張卡片的 Figma image 旁邊標：「這是最終圖/這是 placeholder」 |
| Logo 顏色 | Header 黑、Footer 白，但 SVG inline 時不知道改哪 | 提供兩份 SVG（header 版、footer 版）或明確說「Header 版 logo 用 #000」 |
| Header sticky 還是 absolute | 我猜 fixed，其實要隨頁面捲動 | 明確說「Header 要跟頁面一起捲走」或「Header 永遠釘在頂端」 |
| News card 被裁切 | Card 用固定 px 高度但寬度隨視窗 → 比例跑掉 | 告訴 AI「卡片要依設計稿比例縮放」，或提供 `aspect-ratio: w/h` |
| Dot / 小元素漏做 | Map 5 個點位我只做了部份 | 每個元件都檢查 **Figma 圖層 Tree**，別只看視覺 |

---

## 五、溝通禁忌（會讓 AI 出錯的說法）

❌ **「就照這個」** — 太模糊，AI 不知道是指顏色、字體、還是版型
✅ 「這張的顏色照 node X，字體照元件庫 token，版型照目前」

❌ **「這裡有問題」** — AI 不知道哪裡
✅ 「右邊 Solution 區塊第三張卡，圖片是錯的，應該是 X」+ Figma URL

❌ **「跟設計稿不一樣」** — 要指出「哪裡」「應該是怎樣」
✅ 截圖 A（現狀）+ 截圖 B（Figma）+ 指出差異點

❌ 在聊天裡面貼**一張沒 URL 的縮圖**要 AI 照做 — 圖片模糊就看不清細節
✅ 給 Figma URL，AI 可以看到原始向量尺寸與 token

❌ **只給截圖，不給 Figma URL** — AI 看不到 hex、字體名、像素精確值
✅ Figma URL + 截圖，雙管齊下

---

## 六、給圖片（Assets）的正確方式

**Figma MCP 的 asset URL 會在 7 天內過期** — 所以不能依賴它。

正確做法（擇一）：
1. **Figma export**：右鍵圖層 → Export → PNG/WebP 2x → 打包成 zip 給 RD
2. **雲端共用**：統一放 Google Drive / Dropbox 連結
3. **命名規則**：檔名要能對應設計稿，例如 `news-card-main.webp`、`sol-card-omega.webp`

命名規範建議：
```
{區塊}-{用途}-{識別}.{格式}
例：
hero-bg-video.mp4
news-card-main.webp
sol-card-omega.webp
map-taiwan-dot.svg
```

---

## 七、新專案第一次開案的完整溝通模板

```
Hi Claude，要開始新專案。

📂 Figma 檔案：[URL]

1. 設計代幣在這裡：[node URL]
   請先照這個建 CSS 變數（顏色、字體、spacing）

2. 元件庫在這裡：[node URL]
   包含 button / tag / header / footer / card 各狀態
   請切成共用 class

3. 第一個要做的頁面：[node URL]（Desktop 1440 基準）
   這頁用到上面元件庫的哪些元件：[列出]
   動畫需求：
   - Hero 捲動放大 → [連結動畫說明]
   - Map 分層淡入 → [連結說明]

4. 圖片資產：
   我會另外把 assets.zip 給你，裡面有：
   - /images/hero/...
   - /images/news/...
   - /images/solution/...
   檔名已按規範命名，直接放 assets/images/ 即可

5. RWD 斷點：
   Desktop 1440 / Tablet 768 / Mobile 375
   Tablet 的版型在這：[URL]
   Mobile 版型在這：[URL]

有不確定的地方先問我，不要猜。
```

---

## 八、FAQ

**Q：我不是每次都能準備這麼完整，能簡化嗎？**
A：可以。最低要求是第一第二點（tokens + 元件庫）要先到位，否則後面每一頁都會踩同樣的坑。頁面可以分批給。

**Q：如果設計還在改，要每改一次都重新給 AI 嗎？**
A：重大改動（新增元件、改動 token）需要；小改動（挪位置、換文字）說一聲就好。**改動 token 尤其重要**，因為影響全站。

**Q：AI 看不懂 Figma 某個細節怎麼辦？**
A：截圖 + 指出要看的元素 + 告訴 AI 你希望它怎麼理解。範例：「這個黃色區塊的 padding 在 Figma 顯示是 px-8 py-2，請照這個數值。」

**Q：動畫要怎麼描述才清楚？**
A：用「階段時間軸」的語言：
- Phase A (0–1s)：X fade in
- Phase B (0.5–1.5s)：Y slide up（overlap A 0.5s）
- Phase C (1–2s)：Z clip-path 展開

**Q：怎麼確認 AI 真的照 Figma 做了？**
A：切好後，開瀏覽器截圖 + Figma 原圖並排比對。若需要 AI 協助對比，把兩張圖都給它，叫它列差異。

---

## 附錄：今天這個專案專屬備忘

- 圖片現在是 Figma MCP asset URL，**7 天內會掉圖**，需要重新 export 放 `assets/images/`
- 需要 export 的清單詳見 `figma-export-checklist.md`
- Map 的 bg / lines 已下載到本地（`assets/images/map-bg.png`、`map-lines.svg`）不會掉
- 字體目前是 Avenir（商用）+ Nunito Sans（開源 fallback），要正式上線時確認授權
