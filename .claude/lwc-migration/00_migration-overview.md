# Next.js → Salesforce LWC 移行ガイド（汎用版）

> このドキュメントは WELTH CLUB プロジェクトを題材に、Next.js アプリを
> Salesforce Experience Cloud（LWC）へ移行する際の**汎用手順**をまとめたものです。
> 同様の構成を持つ他プロジェクトにも転用可能です。

---

## 全体フロー

```
Phase 0: 移行前準備（環境・分析）
Phase 1: Salesforce データモデル設計
Phase 2: Apex バックエンド実装
Phase 3: LWC コンポーネント実装
Phase 4: Experience Cloud 設定
Phase 5: テスト・デプロイ
```

---

## Phase 別 概要

| Phase | 内容 | 担当 | 目安工数 |
|-------|------|------|----------|
| 0 | 環境構築・既存コード分析 | 全員 | 3〜5日 |
| 1 | SFオブジェクト設計・作成 | SF管理者 + 開発者 | 1〜2週間 |
| 2 | Apex Controller / REST API | SF開発者 | 2〜3週間 |
| 3 | LWCコンポーネント実装 | SF開発者 | 3〜6週間 |
| 4 | Experience Cloud 設定 | SF管理者 | 3〜5日 |
| 5 | テスト・UAT・本番デプロイ | 全員 | 1〜2週間 |

---

## 技術マッピング早見表

| Next.js | Salesforce LWC | 備考 |
|---------|---------------|------|
| `page.tsx` | LWC コンポーネント | 1ページ = 複数LWC |
| `useState` | reactive properties（API v59+は`@track`不要） | クラスプロパティで代替 |
| `useEffect` | `connectedCallback()` / `renderedCallback()` | ライフサイクルフック |
| `Context API` | Lightning Message Service (LMS) | 非親子間通信 |
| `props` | `@api` デコレータ | 公開プロパティ |
| イベント伝播（子→親） | `CustomEvent` + `dispatchEvent` | 親の `onxxx` で受信 |
| データ取得 | `@wire` / imperative Apex (`callApex`) | Apex Controller経由 |
| Tailwind CSS | SLDS + CSS Scoping | デザイントークン変換 |
| SessionStorage | SF Session / UserInfo | 標準認証 |
| Next.js Router | Experience Cloud Navigation | 標準ナビ |
| モックデータ | Apex + Salesforce Objects | DB化 |

---

## ファイル構成（このドキュメント群）

```
.claude/lwc-migration/
├── 00_migration-overview.md        ← 本ファイル（全体概要）
├── 01_phase0-preparation.md        ← Phase 0: 環境構築・分析
├── 02_phase1-data-model.md         ← Phase 1: データモデル設計
├── 03_phase2-apex.md               ← Phase 2: Apex実装
├── 04_phase3-lwc.md                ← Phase 3: LWC実装
├── 05_phase4-experience-cloud.md   ← Phase 4: EC設定
├── 06_phase5-testing.md            ← Phase 5: テスト・デプロイ
└── prompts/
    ├── prompt-01_data-model.md     ← Claude Code プロンプト: データモデル
    ├── prompt-02_apex.md           ← Claude Code プロンプト: Apex
    ├── prompt-03_lwc-base.md       ← Claude Code プロンプト: LWC基盤
    ├── prompt-04_lwc-flow.md       ← Claude Code プロンプト: LWC多段階フロー
    └── prompt-05_lwc-styles.md     ← Claude Code プロンプト: スタイル移行
```
