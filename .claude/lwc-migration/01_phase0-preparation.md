# Phase 0: 移行前準備

## 0-1. 環境構築チェックリスト

### Salesforce CLI
```bash
# インストール確認
sf --version

# インストール（未導入の場合）
npm install -g @salesforce/cli

# 組織への認証
sf org login web --alias my-org
sf org open --target-org my-org
```

### VS Code 拡張機能
- Salesforce Extension Pack（必須）
- Apex PMD（静的解析）
- Prettier（コードフォーマット）

### SFDX プロジェクト初期化
```bash
sf project generate --name welth-club-sf
cd welth-club-sf
sf org create scratch --definition-file config/project-scratch-def.json --alias scratch-org
```

---

## 0-2. 既存 Next.js コードの分析テンプレート

移行対象プロジェクトに対して以下を確認する。

### チェック項目

```
□ ページ一覧と各ページの役割
□ 状態変数の一覧（useState の型・用途）
□ 多段階フローのステップ定義
□ イベントハンドラーの一覧
□ 外部API呼び出しの有無
□ 認証方式（Cookie / SessionStorage / JWT）
□ データ構造（モック or 実API）
□ CSS変数・デザイントークン一覧
□ 共通コンポーネントの一覧（再利用されているUI部品）
□ フォームバリデーションのルール
```

### WELTH CLUB の分析結果サマリ

| 項目 | 内容 |
|------|------|
| ページ数 | 6ページ（login, dashboard, restaurant, lounge, events, profile） |
| 状態管理 | useState（各ページローカル）+ Context（認証のみ） |
| 多段階フロー | restaurant(6step), lounge(5step), events(5step) |
| 認証 | SessionStorage（ハードコード → SF認証に置換） |
| データ | モックデータ（→ Salesforceカスタムオブジェクトに移行） |
| スタイリング | Tailwind CSS v4 + CSS変数（→ SLDS + CSS Scoping） |
| 外部API | なし |

---

## 0-3. 移行対象コンポーネント分解表（WELTH CLUB）

### Dashboard（ダッシュボード）
```
welthDashboard (親)
├── welthMemberCard       - 会員ステータスカード
├── welthRecentBookings   - 直近の予約リスト
└── welthUpcomingEvents   - おすすめイベント
```

### Restaurant（レストラン予約）
```
welthRestaurantBooking (親・ステップ管理)
├── welthSearchFilter     - 検索・フィルター（共通）
├── welthRestaurantCard   - レストランカード（リスト表示）
├── welthDateTimePicker   - 日時選択（共通）
├── welthGuestSelector    - 人数・リクエスト入力（共通）
├── welthPaymentSelector  - 支払い方法選択（共通）
├── welthConfirmSummary   - 予約確認サマリー（共通）
└── welthStepProgress     - ステップインジケーター（共通）
```

### Lounge（ラウンジ予約）
```
welthLoungeBooking (親・ステップ管理)
├── welthSearchFilter     - 共通流用
├── welthLoungeCard       - ラウンジカード
├── welthDateTimePicker   - 共通流用
├── welthSeatTypeSelector - 座席タイプ選択
├── welthServiceSelector  - サービス選択（チェックボックス群）
├── welthConfirmSummary   - 共通流用
└── welthStepProgress     - 共通流用
```

### Events（イベント申込）
```
welthEventBooking (親・ステップ管理)
├── welthSearchFilter     - 共通流用
├── welthEventCard        - イベントカード
├── welthGuestSelector    - 共通流用
├── welthPaymentSelector  - 共通流用
├── welthConfirmSummary   - 共通流用
└── welthStepProgress     - 共通流用
```

### Profile（会員情報）
```
welthMemberProfile (親)
├── welthProfileField     - 表示フィールド
├── welthEditableField    - 編集フィールド
└── welthNotificationSettings - 通知設定トグル
```

---

## 0-4. 共通コンポーネント（全フローで再利用）

| コンポーネント名 | 役割 | Next.js での対応 |
|----------------|------|----------------|
| `welthStepProgress` | ステップインジケーター | `StepProgress` 関数 |
| `welthSearchFilter` | フィルタータブ群 | インラインの filter ボタン |
| `welthDateTimePicker` | 日付・時間選択 | カレンダー + ボタン群 |
| `welthGuestSelector` | 人数増減 + テキストエリア | 増減ボタン + textarea |
| `welthPaymentSelector` | 支払い方法選択 | ラジオボタン群 |
| `welthConfirmSummary` | 確認画面サマリー | 条件付きレンダリング |
| `welthSidebar` | ナビゲーション | `Sidebar.tsx` |
