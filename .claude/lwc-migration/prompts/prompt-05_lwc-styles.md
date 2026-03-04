# Claude Code プロンプト 05: スタイル移行（Tailwind CSS → SLDS + カスタム CSS）

## 用途
Next.js の Tailwind CSS + CSS 変数スタイリングを
Salesforce LWC の SLDS + CSS Scoped スタイリングに変換する。

---

## プロンプトテンプレート（汎用）

```
# タスク: Tailwind CSS → LWC CSS 変換

## コンテキスト
Next.js アプリの Tailwind CSS スタイリングを Salesforce LWC の CSS に変換します。
LWC では以下の制約があります：

### LWC CSS の制約事項
1. CSS は自動スコープされる（Shadow DOM）→ グローバル CSS は効かない
2. :host セレクタで自コンポーネントのルートをスタイリング
3. 子コンポーネントの内部には CSS が貫通しない
4. @import は使用不可（Static Resource 経由でフォント読み込み）
5. !important は使用可能だが非推奨
6. CSS Custom Properties（変数）は Shadow DOM を貫通する → テーマ設定に有効

## 移行元 CSS 変数

```css
[ここに globals.css の CSS 変数を貼り付ける]
```

## 変換してほしい内容
1. LWC 用のグローバル CSS 変数定義（Static Resource として）
2. 各コンポーネントの CSS ファイル
3. Tailwind ユーティリティクラスの対応 CSS

## Tailwind → CSS 変換テーブル（生成してもらう）
以下の Tailwind クラスを純 CSS に変換するテーブルを作成してください。

[使用されている Tailwind クラスの一覧]
```

---

## WELTH CLUB 向け実際のプロンプト（コピー&ペースト用）

### プロンプト 5-A: グローバルテーマ CSS（Static Resource）

```
# タスク: WELTH CLUB グローバルテーマ CSS 生成

## コンテキスト
WELTH CLUB の LWC コンポーネント群に適用するグローバルテーマを
Salesforce Static Resource 用 CSS として生成します。

## 移行元 CSS 変数（globals.css）

```css
:root {
  --bg-page: #0A0A0A;
  --bg-surface: #141414;
  --bg-card: #1A1A1A;
  --bg-input: #1A1A1A;
  --border: #2A2A2A;
  --gold: #C9A962;
  --gold-40: #C9A96266;
  --gold-subtle: #C9A96220;
  --text-on-gold: #0A0A0A;
  --text-primary: #FFFFFF;
  --text-secondary: #848484;
  --text-tertiary: #6A6A6A;
}
```

## 移行元フォント設定

```css
/* Google Fonts */
Cormorant Garamond: serif（見出し用）
Inter: sans-serif（本文用）
JetBrains Mono: monospace（等幅）

.font-heading { font-family: "Cormorant Garamond", serif; }
.font-body { font-family: "Inter", sans-serif; }
.font-mono { font-family: "JetBrains Mono", monospace; }
```

## 生成してほしいファイル

### 1. welthTheme.css（Static Resource にアップロード）
Experience Cloud のサイト全体に適用するテーマ CSS
- CSS Custom Properties の定義（:root で定義 → Shadow DOM を貫通）
- Google Fonts の @font-face 読み込み
- SLDS の上書きスタイル（ダークテーマ化）
- Experience Cloud のヘッダー・フッター・ナビのダークテーマ化

### 2. welthBase.css（各 LWC で @import 不可のため指針のみ）
各 LWC の .css ファイルで共通して使用するスタイルパターン集

## 出力形式
```css
/* welthTheme.css - Static Resource */
:root {
  /* WELTH CLUB Design Tokens */
  ...
}

/* Typography */
...

/* SLDS Overrides for Dark Theme */
...
```

全ファイルを出力してください。
```

### プロンプト 5-B: Tailwind → LWC CSS 変換表

```
# タスク: WELTH CLUB Tailwind → LWC CSS 対応表の生成

## コンテキスト
WELTH CLUB の Next.js コードで使用されている Tailwind CSS クラスを
LWC の CSS に変換する対応表を作成してください。

## 使用されている主要な Tailwind クラス

### レイアウト
- flex, flex-col, flex-1, flex-wrap
- grid, grid-cols-3, grid-cols-2
- gap-2, gap-3, gap-4, gap-5, gap-6, gap-8
- items-center, items-start, items-end
- justify-between, justify-center, justify-end
- w-full, h-full, w-[280px], h-[220px], min-h-screen

### スペーシング
- p-4, p-5, p-6, p-8, p-10, p-12
- px-3, px-4, px-5, px-6, py-2, py-3, py-4
- mt-2, mt-4, mb-2, mb-4, ml-3

### タイポグラフィ
- text-[12px], text-[13px], text-[14px], text-[16px], text-[20px], text-[28px], text-[36px]
- font-medium, font-semibold, font-bold
- leading-relaxed, tracking-[0.15em]
- uppercase, whitespace-nowrap
- text-center

### ボーダー・角丸
- border, border-b, border-t
- rounded-none（角丸なし ← WELTH CLUBのデザイン）

### 効果
- transition-colors, transition-opacity
- hover:border-[var(--gold)]
- opacity-60, opacity-80

### サイズ
- w-7, h-7, w-10, h-10, w-12, h-12
- shrink-0, overflow-hidden

## 出力してほしいもの

### 1. CSS クラス対応表
各 Tailwind クラスに対する純 CSS プロパティの対応表

### 2. LWC 用ユーティリティ CSS テンプレート
各 LWC コンポーネントの CSS ファイルにコピー&ペーストで使える
共通スタイルブロック集

### 3. 動的クラスの getter パターン集
Tailwind の条件付きクラス → LWC の computed property（getter）変換例

例:
```javascript
// Next.js
className={`... ${isActive ? 'bg-[var(--gold)] text-[var(--text-on-gold)]' : 'border border-[var(--border)] text-[var(--text-secondary)]'}`}

// LWC getter
get filterButtonClass() {
    return this.isActive
        ? 'filter-btn filter-btn--active'
        : 'filter-btn';
}
```

対応表・テンプレート・パターン集を出力してください。
```

### プロンプト 5-C: Experience Cloud テーマ設定手順

```
# タスク: Experience Cloud テーマ・ブランディング設定手順書

## コンテキスト
WELTH CLUB の LWC コンポーネント群を Experience Cloud サイトに配置した後、
サイト全体のテーマ・ブランディングを設定する手順を生成してください。

## ブランドガイドライン

### カラー
- Primary: #C9A962（ゴールド）
- Background: #0A0A0A（ダーク）
- Surface: #141414
- Card: #1A1A1A
- Text Primary: #FFFFFF
- Text Secondary: #848484

### タイポグラフィ
- 見出し: Cormorant Garamond（serif）
- 本文: Inter（sans-serif）
- 等幅: JetBrains Mono

### デザイン特性
- 角丸なし（border-radius: 0）
- ダークテーマ全体
- ゴールドアクセント
- ミニマル・高級感

## 生成してほしい内容

1. **Experience Builder でのテーマ設定手順**（画面パス付き）
2. **Head Markup に挿入する HTML**（Google Fonts読み込み等）
3. **Custom CSS の設定内容**
4. **Static Resource のアップロード手順**
5. **ヘッダー・フッターのカスタマイズ方法**

手順書形式（チェックリスト付き）で出力してください。
```
