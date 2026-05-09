# TOEIC 375 to 550 Practice

一個針對目前約 375 分、目標 550 分學習者設計的多益選擇題練習系統。題目以基礎文法、常見商務字彙、短篇閱讀、聽力文字題型為主，作答後會立即顯示正解、詳解與學習重點。

## 功能

- 多益常見題型：Part 2、Part 5、Part 7，並以 375 到 550 分最需要補強的文法、單字與閱讀題為主
- 題型、難度、新題、錯題、收藏題篩選
- 每題四選一，答對或答錯都會顯示詳解
- 每題都會顯示中文翻譯；單字題會列出每個選項的中文意思
- 一般練習作答過的題目不會再次出現，避免隨機抽題重複
- 新版出題器會產生超過 2,000 題變化題，足夠長時間連續練習
- 本機瀏覽器自動保存作答紀錄、正確率、連續答對、錯題清單
- 純前端靜態網頁，適合直接上傳 GitHub Pages

## 使用方式

直接用瀏覽器開啟 `index.html` 即可使用，不需要安裝套件。

## 檔案結構

```text
Codex/
├─ index.html      # 主畫面
├─ style.css       # 視覺樣式
├─ quiz.js         # 練習互動邏輯
├─ questions.js    # 多益題庫
└─ README.md       # 專案說明
```

## 題庫方向

目前系統使用程式化出題器，會從多益常見句型與商務情境產生大量變化題。難度分成：

- `foundation`：適合 375 分左右先穩住基本分的題目
- `bridge`：往 550 分前進需要補強的題目

建議練習方式：

1. 先使用「新題練習」隨機練習，題目作答後就會從一般題池移除。
2. 做完一輪後切到「錯題複習」。
3. 把常錯題收藏起來，每天重做一次。
4. Part 5 優先補主詞動詞一致、時態、詞性、介系詞。
5. Part 7 優先練主旨題、細節題與同義改寫。

## 上傳到 GitHub

如果本機有 Git，可以在此資料夾執行：

```bash
git init
git add index.html style.css quiz.js questions.js README.md
git commit -m "Build TOEIC practice system"
git branch -M main
git remote add origin https://github.com/YOUR_NAME/YOUR_REPO.git
git push -u origin main
```

也可以在 GitHub 建立 repository 後，直接把這些檔案上傳。若要用 GitHub Pages，將 repository 的 Pages 來源設定為 `main` branch / root folder。
