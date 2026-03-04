# Phase 4: Experience Cloud 設定

## 4-1. Experience Cloud サイト作成

### 手順
1. Setup → Digital Experiences → All Sites → New
2. テンプレート選択: **Build Your Own (LWR)** ← 推奨（軽量・モダン）
   または **Customer Account Portal**（既存テンプレート活用の場合）
3. サイト名・URLを設定: `welth-club`
4. Experience Builder を開く

---

## 4-2. ナビゲーション設定

```
サイトのメニュー構造:
├── ダッシュボード（/s/）
├── レストラン予約（/s/restaurant）
├── ラウンジ予約（/s/lounge）
├── イベント予約（/s/events）
└── 会員情報（/s/profile）
```

### ページ作成手順（Experience Builder）
1. Pages → New Page
2. Standard Page を選択
3. URL path を設定（例: `restaurant`）
4. 作成したLWCコンポーネントをドラッグ&ドロップ

---

## 4-3. 認証設定

### ログインページの設定
- Setup → Experience Cloud Sites → 対象サイト → Administration → Login & Registration
- Login Page Type: **LWC Login Page**（カスタムログインページの場合）
- または標準 Salesforce ログインページを使用

### ゲストユーザー vs 認証ユーザー
```
認証なし（ゲスト）: ランディングページ・公開情報のみ
認証あり（会員）:   全機能アクセス可能

Profile設定:
- Guest User Profile:
  - Restaurant__c: Read（一覧閲覧のみ）
  - Event__c: Read（一覧閲覧のみ）
  - Lounge__c: Read（一覧閲覧のみ）
  - Reservation__c: アクセス不可
  - Contact: アクセス不可
- Member Profile（カスタム Community User Profile）:
  - Restaurant__c / Event__c / Lounge__c: Read
  - Reservation__c: Create, Read, Edit
  - Contact（自分のレコード）: Read, Edit
```

### Sharing Rules（データ公開設定）

> **データモデル変更に伴う更新**: Member__c → Contact ベースに変更

```
Contact:            EC User に標準紐付け（自分の Contact のみアクセス可能）
Reservation__c:     RefContact__c = CurrentUser.ContactId（自分の予約のみ）
Restaurant__c:      Public Read（全会員が参照可能）
Lounge__c:          Public Read（全会員が参照可能）
Event__c:           Public Read（全会員が参照可能）
RestaurantSlot__c:  Controlled by Parent（Restaurant__c に従う）
```

### Permission Set 設計
```
WelthClub_Member（会員向け Permission Set）:
- Object: Reservation__c → CRUD（Delete 除く）
- Object: Contact → Read, Edit（自分のレコードのみ）
- Object: Restaurant__c, Lounge__c, Event__c → Read
- Apex Class: RestaurantController, LoungeController,
              EventController, ReservationController, MemberController
```

---

## 4-4. テーマ・ブランディング設定

### WELTH CLUB カスタムテーマ適用
```
Experience Builder → Theme → Edit CSS

カスタム CSS で上書き:
- 背景色: #0A0A0A
- アクセントカラー: #C9A962
- フォント: Cormorant Garamond（Google Fonts）+ Inter
```

### Static Resources でフォント・CSS を管理
```bash
# 1. ローカルで zip を作成
#    welthTheme/
#    ├── welthTheme.css
#    └── fonts/（セルフホスティングする場合）

# 2. Salesforce CLI でデプロイ
#    force-app/main/default/staticresources/ に配置して sf project deploy start
#    または Setup → Static Resources → New で手動アップロード

# 3. LWC から参照する場合
import WELTH_THEME from '@salesforce/resourceUrl/welthTheme';
import { loadStyle } from 'lightning/platformResourceLoader';

connectedCallback() {
    loadStyle(this, WELTH_THEME + '/welthTheme.css');
}
```

---

## 4-5. LWC のページへの配置

```
全ページ共通レイアウト:
├── c-welth-sidebar（left column, 240px fixed）
└── Main Content Area
    └── 各ページの LWC コンポーネント

Dashboard ページ:
└── c-welth-dashboard（width: 100%）

Restaurant ページ:
└── c-welth-restaurant-booking（width: 100%）

Lounge ページ:
└── c-welth-lounge-booking（width: 100%）

Events ページ:
└── c-welth-event-booking（width: 100%）

Profile ページ:
└── c-welth-member-profile（width: 100%）
```

> **LWR テンプレートの推奨**: Aura ベースより LWR（Lightning Web Runtime）
> ベースの方が LWC との相性が良く、パフォーマンスも高い。

---

## 4-6. SEO・パフォーマンス設定

```
- Head Markup: メタタグ・OGP設定（Experience Builder > Settings > SEO）
- CDN: Salesforce の CDN は自動適用
- キャッシュ:
  - 公開データ（レストラン・イベント一覧）: cacheable=true
  - 個人データ（予約・会員情報）: cacheable=false（セキュリティ上）
- 画像最適化: ImageURL__c の画像は CDN 配信を推奨
```
