# Phase 1: Salesforce データモデル設計

## 1-1. カスタムオブジェクト一覧

### WELTH CLUB のオブジェクト設計

> **設計方針**: Experience Cloud では会員を Contact（個人アカウント）に紐付けるのが
> Salesforce のベストプラクティスです。独自の Member__c ではなく、Contact を拡張して
> 会員固有のフィールドを追加するアプローチを採用します。

```
Contact（会員）             ← EC ユーザーに標準紐付け（カスタムフィールド追加）
├── Restaurant__c（レストランマスタ）
│   └── RestaurantSlot__c（予約スロット）
├── Lounge__c（ラウンジマスタ）
├── Event__c（イベントマスタ）
└── Reservation__c（予約・申込 統合）
    ├── Lookup: Restaurant__c（RelRef_Restaurant__c）
    ├── Lookup: Lounge__c（RelRef_Lounge__c）
    └── Lookup: Event__c（RelRef_Event__c）
```

### 会員と Contact の関係

```
User（EC ログインユーザー）
  └── ContactId → Contact（会員レコード）
        ├── MemberID__c = 'WC-2015-00482'
        ├── MembershipStatus__c = 'Platinum'
        └── PointBalance__c = 125000
```

---

## 1-2. 各オブジェクトのフィールド定義

### Contact（カスタムフィールド追加）

> 標準フィールド（FirstName, LastName, Email, Phone, MailingAddress, Birthdate）は
> そのまま利用する。以下はカスタムフィールドのみ。

| フィールド名 | API名 | 型 | 説明 |
|------------|-------|-----|------|
| 会員ID | MemberID__c | Text(20), ExternalId, Unique | WC-YYYY-NNNNN形式 |
| 氏名（カナ） | FullNameKana__c | Text(100) | |
| 会員ステータス | MembershipStatus__c | Picklist | Platinum/Gold/Silver |
| ポイント残高 | PointBalance__c | Number(10,0) | |
| 入会日 | JoinDate__c | Date | |
| 通知設定 | NotificationPreferences__c | MultiselectPicklist | Events;Reminders;Market;Magazine |

### Restaurant__c
| フィールド名 | API名 | 型 |
|------------|-------|-----|
| レストラン名 | Name | Text(80) |
| ジャンル | Genre__c | Picklist(和食/フレンチ/イタリアン) |
| エリア | Area__c | Picklist(銀座/六本木/麻布台/丸の内) |
| 説明 | Description__c | Long Text Area |
| 価格（1名あたり） | PricePerPerson__c | Currency(8,0) |
| 画像URL | ImageURL__c | URL |
| 有効フラグ | IsActive__c | Checkbox（default: true） |

### RestaurantSlot__c
| フィールド名 | API名 | 型 |
|------------|-------|-----|
| レストラン | Restaurant__c | Master-Detail(Restaurant__c) |
| 予約日 | SlotDate__c | Date |
| 予約時間 | SlotTime__c | Text(5) | "18:00" 形式 |
| 残席数 | RemainingSeats__c | Number(3,0) |

### Reservation__c（予約・申込 統合テーブル）

> **注意**: Lookup フィールドの API名は対象オブジェクトの API名と衝突しないよう
> プレフィックス `Ref` を付けて命名する。

| フィールド名 | API名 | 型 |
|------------|-------|-----|
| 予約番号 | ReservationNumber__c | Text(20), ExternalId, Unique |
| 会員 | RefContact__c | Lookup(Contact) |
| 予約種別 | ReservationType__c | Picklist(Restaurant/Lounge/Event) |
| レストラン | RefRestaurant__c | Lookup(Restaurant__c) |
| ラウンジ | RefLounge__c | Lookup(Lounge__c) |
| イベント | RefEvent__c | Lookup(Event__c) |
| 予約日 | ReservationDate__c | Date |
| 予約時間 | ReservationTime__c | Text(5) |
| 人数 | NumberOfGuests__c | Number(2,0) |
| 特別リクエスト | SpecialRequest__c | Long Text Area |
| 支払い方法 | PaymentMethod__c | Picklist(CardRegistered/Points/OnSite) |
| 合計金額 | TotalAmount__c | Currency(10,0) |
| ステータス | Status__c | Picklist(Pending/Confirmed/Cancelled/Completed) |
| 座席タイプ | SeatType__c | Picklist(Sofa/Counter/PrivateRoom) ※ラウンジのみ |
| 利用時間 | Duration__c | Text(10) ※ラウンジのみ |
| 利用目的 | Purpose__c | Text(100) ※ラウンジのみ |
| 追加サービス | AdditionalServices__c | MultiselectPicklist ※ラウンジのみ |

### Lounge__c
| フィールド名 | API名 | 型 |
|------------|-------|-----|
| ラウンジ名 | Name | Text(80) |
| エリア | Area__c | Picklist(丸の内/銀座/六本木) |
| 説明 | Description__c | Long Text Area |
| 営業時間 | OperatingHours__c | Text(50) |
| 利用可能時間帯 | AvailableTimeSlots__c | Long Text Area（JSON配列） |
| 画像URL | ImageURL__c | URL |
| 有効フラグ | IsActive__c | Checkbox（default: true） |

### Event__c
| フィールド名 | API名 | 型 |
|------------|-------|-----|
| イベント名 | Name | Text(80) |
| カテゴリ | Category__c | Picklist(ワイン/セミナー/アート/ゴルフ) |
| 開催日 | EventDate__c | Date |
| 開催時間 | EventTime__c | Text(20) |
| 会場 | Venue__c | Text(100) |
| 説明 | Description__c | Long Text Area |
| 定員 | Capacity__c | Number(4,0) |
| 残席数 | RemainingSeats__c | Number(4,0) |
| 参加費 | Price__c | Currency(10,0)（0=無料） |
| 画像URL | ImageURL__c | URL |
| 有効フラグ | IsActive__c | Checkbox（default: true） |

---

## 1-3. Validation Rules

| オブジェクト | ルール名 | 数式 |
|------------|---------|------|
| Reservation__c | FutureDate | `ReservationDate__c < TODAY()` → エラー |
| Reservation__c | GuestRange | `NumberOfGuests__c < 1 \|\| NumberOfGuests__c > 10` → エラー |
| Reservation__c | RequireTarget | `ISBLANK(RefRestaurant__c) && ISBLANK(RefLounge__c) && ISBLANK(RefEvent__c)` → エラー |
| RestaurantSlot__c | NonNegativeSeats | `RemainingSeats__c < 0` → エラー |

---

## 1-4. 汎用アプリへの転用方法

このデータモデルを別プロジェクトに転用する場合:

### ステップ1: ユーザーモデルの決定
```
質問:
1. EC の認証ユーザーは Contact ベースか？User ベースか？
   → Experience Cloud では通常 Contact ベース（推奨）
2. Person Account（個人アカウント）を使用するか？
   → B2C の場合は Person Account が適切
3. 既存の Contact/Account に会員情報を拡張できるか？
   → 可能なら独自 Member__c は作らない（データ重複の回避）
```

### ステップ2: ドメインエンティティの特定
```
質問:
1. 「予約・申込」の対象は何か？（レストラン/イベント/サービス等）
2. 「ユーザー」に紐付く追加情報は何か？
3. 「マスタデータ」と「トランザクション」の分離はできているか？
4. 多段階フローの各ステップで何のデータを収集するか？
```

### ステップ3: フィールド型の選定基準
```
Text         → 自由記述・コード値
Picklist     → 選択肢が固定（ジャンル・ステータス等）
MultiselectPicklist → 複数選択可能（サービス・通知設定等）
Lookup       → 他オブジェクトへの参照（API名の衝突に注意）
Master-Detail → 親が削除されたら子も削除される関係
Currency     → 金額
Number       → 数値（人数・在庫等）
Date/DateTime → 日付・日時
Checkbox     → フラグ
Long Text Area → 説明・リクエスト等の長文
```

### ステップ4: Validation Rule の設計
```
- 必須項目: Required フィールド
- 数値範囲: NumberOfGuests__c >= 1 AND <= 10
- 日付範囲: ReservationDate__c >= TODAY()
- 在庫チェック: Apex Trigger で RemainingSeats__c を更新
- 参照整合性: ReservationType__c に応じた Lookup の必須チェック
```

### ステップ5: API名の命名規則（衝突防止）
```
- Lookup フィールド名は対象オブジェクトの API名と同名にしない
  ❌ Restaurant__c → Restaurant__c（Lookup）  ← API名が衝突
  ✅ Restaurant__c → RefRestaurant__c（Lookup） ← プレフィックスで回避
- relationshipName は明示的に指定する
  例: RefRestaurant__r.Name
```
