# Claude Code プロンプト 01: Salesforce データモデル生成

## 用途
Next.js のモックデータ構造から Salesforce カスタムオブジェクトの
メタデータファイルを生成する。

---

## プロンプトテンプレート

```
# タスク: Salesforce カスタムオブジェクト メタデータ生成

## プロジェクト概要
[アプリ名] は [説明] を機能として持つ Salesforce Experience Cloud アプリです。
Next.js で実装されたプロトタイプを LWC に移行するため、データモデルを構築します。

## 移行元のデータ構造（Next.js モックデータ）

以下の TypeScript 型定義を Salesforce カスタムオブジェクトに変換してください：

```typescript
[ここに Next.js の interface / type 定義を貼り付ける]
```

## 生成してほしいファイル

以下の Salesforce メタデータ XML ファイルを生成してください：

1. **カスタムオブジェクト定義** (`force-app/main/default/objects/{ObjectName}__c/{ObjectName}__c.object-meta.xml`)
   - label（日本語ラベル）
   - pluralLabel
   - nameField（名前フィールドの定義）
   - deploymentStatus: Deployed
   - sharingModel: ReadWrite

2. **各フィールド定義** (`force-app/main/default/objects/{ObjectName}__c/fields/{FieldName}__c.field-meta.xml`)
   - 型定義の各プロパティを適切な Salesforce フィールド型に変換
   - 型変換ルール:
     - string → Text(255) または LongTextArea（説明文の場合）
     - number → Number または Currency（金額の場合）
     - boolean → Checkbox
     - string（選択肢固定）→ Picklist
     - string[]（複数選択）→ MultiselectPicklist
     - Date → Date
     - 他テーブルへの参照 → Lookup

## 要件
- フィールド API 名はキャメルケースを __c サフィックス付きスネークケースに変換
  例: `restaurantId` → `Restaurant__c`（Lookup）または `RestaurantId__c`（Text）
- 日本語ラベルを付ける（元の変数名から推測）
- Required フィールドは required: true を設定
- Lookup フィールドには relationshipLabel と relationshipName を設定

## 出力形式
各ファイルをコードブロックで出力し、ファイルパスをコメントで明記してください。
```

---

## WELTH CLUB 向け実際のプロンプト（コピー&ペースト用）

```
# タスク: WELTH CLUB Salesforce データモデル生成

## プロジェクト概要
WELTH CLUB は高級会員制クラブのポータルサイトで、レストラン予約・ラウンジ予約・
イベント申込・会員情報管理の機能を持つ Salesforce Experience Cloud アプリです。
Next.js プロトタイプから LWC に移行するため、以下の型定義を元にカスタムオブジェクトを作成します。

## 移行元データ構造

```typescript
// 会員
interface Member {
  memberId: string;          // WC-2015-00482
  name: string;
  kana: string;
  email: string;
  phone: string;
  address: string;
  birthday: string;
  membershipStatus: "Platinum" | "Gold" | "Silver";
  pointBalance: number;
  joinDate: string;
  notifications: {
    events: boolean;
    reminders: boolean;
    market: boolean;
    magazine: boolean;
  };
}

// レストラン
interface Restaurant {
  id: string;
  name: string;
  genre: "和食" | "フレンチ" | "イタリアン";
  area: "銀座" | "六本木" | "麻布台" | "丸の内";
  description: string;
  pricePerPerson: number;
  imageUrl: string;
  slots: Array<{
    date: string;
    time: string;
    remainingSeats: number;
  }>;
}

// 予約（レストラン・ラウンジ・イベント共通）
interface Reservation {
  reservationNumber: string;
  memberId: string;
  type: "Restaurant" | "Lounge" | "Event";
  targetId: string;
  date: string;
  time: string;
  guests: number;
  specialRequest: string;
  paymentMethod: "CardRegistered" | "Points" | "OnSite";
  totalAmount: number;
  status: "Pending" | "Confirmed" | "Cancelled" | "Completed";
  // ラウンジ専用
  seatType?: "Sofa" | "Counter" | "PrivateRoom";
  duration?: string;
  purpose?: string;
  additionalServices?: string[];
}

// ラウンジ
interface Lounge {
  id: string;
  name: string;
  area: string;
  description: string;
  operatingHours: string;
  availableTimeSlots: string[];
  imageUrl: string;
}

// イベント
interface Event {
  id: string;
  name: string;
  category: "ワイン" | "セミナー" | "アート" | "ゴルフ";
  eventDate: string;
  eventTime: string;
  venue: string;
  description: string;
  capacity: number;
  remainingSeats: number;
  price: number;
  imageUrl: string;
}
```

## 生成してほしいファイル
上記5つのエンティティに対して、以下を生成してください：
1. カスタムオブジェクト定義 XML（.object-meta.xml）
2. 全フィールド定義 XML（.field-meta.xml）
3. オブジェクト間のリレーション設定（Lookup フィールド）

## 設計方針（重要）
- 会員情報は独自の Member__c を作らず、**標準 Contact オブジェクトにカスタムフィールド**を追加する
  - 理由: Experience Cloud では User → Contact の標準紐付けがあり、独自オブジェクトにすると認証連携が複雑になる
  - Contact の標準フィールド（FirstName, LastName, Email, Phone, MailingAddress, Birthdate）をそのまま利用
  - カスタムフィールド: MemberID__c（ExternalId）, MembershipStatus__c, PointBalance__c, FullNameKana__c, JoinDate__c, NotificationPreferences__c
- Reservation__c の Lookup フィールドは API名の衝突を避けるため `RefRestaurant__c` / `RefLounge__c` / `RefEvent__c` / `RefContact__c` と命名する
- Reservation__c は ReservationType__c の値に応じて対応する Lookup のみ必須とする
- Lounge__c にも IsActive__c フィールドを追加する（Restaurant__c / Event__c と統一）
- RestaurantSlot__c は Restaurant__c への Master-Detail とする
- 全オブジェクトに CreatedDate / LastModifiedDate は自動付与（明示不要）
- オブジェクト API バージョン: 59.0

## 生成してほしいファイル
上記エンティティに対して、以下を生成してください：
1. カスタムオブジェクト定義 XML（.object-meta.xml）— Contact は既存なので不要
2. Contact のカスタムフィールド定義 XML（.field-meta.xml）
3. 全カスタムオブジェクトのフィールド定義 XML（.field-meta.xml）
4. オブジェクト間のリレーション設定（Lookup / Master-Detail フィールド）
5. Validation Rule XML

force-app/main/default/objects/ 以下の完全なディレクトリ構成と全ファイルを出力してください。
```

---

## 使い方メモ

1. 上記プロンプトを Claude Code に貼り付けて実行
2. 生成された XML ファイルを `force-app/main/default/objects/` に配置
3. `sf project deploy start` でデプロイ
4. Setup → Object Manager で確認
