# Claude Code プロンプト 02: Apex Controller 生成

## 用途
LWC から呼び出す Apex Controller クラスと対応するテストクラスを生成する。

---

## プロンプトテンプレート（汎用）

```
# タスク: Apex Controller + テストクラス生成

## コンテキスト
Salesforce Experience Cloud アプリの LWC から呼び出す Apex Controller を作成します。
以下の仕様に基づいて、セキュアで高品質な Apex コードを生成してください。

## 対象オブジェクト
[カスタムオブジェクト名（API名）]

## 必要なメソッド

| メソッド名 | 戻り値 | 引数 | cacheable | 説明 |
|-----------|--------|------|-----------|------|
| [メソッド名] | [型] | [引数] | [true/false] | [説明] |

## セキュリティ要件（必須）
- **`with sharing` を全 Controller クラスに明記する**（without sharing は禁止）
- SOQL インジェクション対策（バインド変数必須、文字列連結禁止）
- FLS/CRUD チェック（Schema.sObjectType / Schema.sObjectType.fields で確認）
- 現在ログイン中のユーザーの情報のみ取得・更新できること（User.ContactId 経由で Contact を特定）
- AuraHandledException で適切なエラーメッセージを返すこと
- cacheable=true は公開データ（レストラン/イベント一覧）のみに使用し、個人データには使わない

## Wrapper クラス要件
- SObject を直接返さず、専用 Wrapper クラスを使うこと
- @AuraEnabled アノテーションを全プロパティに付けること
- ネストした Wrapper クラスも定義すること

## 出力してほしいファイル
1. {ClassName}.cls（本体）
2. {ClassName}.cls-meta.xml
3. {ClassName}Test.cls（テストクラス、カバレッジ85%以上）
4. {ClassName}Test.cls-meta.xml
```

---

## WELTH CLUB 向け実際のプロンプト（コピー&ペースト用）

### プロンプト 2-A: ReservationController

```
# タスク: ReservationController Apex 生成

## コンテキスト
WELTH CLUB の Salesforce Experience Cloud アプリで使用する予約管理 Apex Controller を作成します。
レストラン・ラウンジ・イベントの3種類の予約を1つの Controller で管理します。

## カスタムオブジェクト
- Reservation__c（予約）
- Restaurant__c / RestaurantSlot__c
- Lounge__c
- Event__c
- Member__c

## 必要なメソッド

### 1. createReservation（予約作成）
- アノテーション: @AuraEnabled（cacheable=false）
- 引数: ReservationInputWrapper input
- 戻り値: ReservationResultWrapper
- 処理内容:
  - ReservationInputWrapper を Reservation__c レコードに変換して insert
  - ReservationType__c が 'Restaurant' の場合: RestaurantSlot__c の RemainingSeats__c を -1
  - ReservationType__c が 'Event' の場合: Event__c の RemainingSeats__c を -1
  - 残席数が0の場合は AuraHandledException('満席です')
  - 予約番号を 'WC-R-' + yyyyMMdd + 3桁連番 で自動生成
  - 成功時: ReservationResultWrapper(success=true, reservationNumber=xxx)

### 2. getMyReservations（予約一覧取得）
- アノテーション: @AuraEnabled(cacheable=true)
- 引数: Integer limitCount
- 戻り値: List<ReservationWrapper>
- 処理内容:
  - 現在のユーザーの Member__c を取得
  - 最新の limitCount 件を ReservationDate__c 降順で返す
  - Restaurant__c.Name / Lounge__c.Name / Event__c.Name を JOIN して返す

### 3. cancelReservation（予約キャンセル）
- アノテーション: @AuraEnabled（cacheable=false）
- 引数: String reservationId
- 戻り値: void
- 処理内容:
  - 対象レコードが現在ユーザーの予約であることを確認（他人のデータ操作禁止）
  - Status__c を 'Cancelled' に更新
  - Restaurant/Event の場合は RemainingSeats__c を +1（在庫戻し）

## Wrapper クラス定義

```apex
// 入力
public class ReservationInputWrapper {
    @AuraEnabled public String reservationType;  // Restaurant/Lounge/Event
    @AuraEnabled public String targetId;
    @AuraEnabled public String reservationDate;  // yyyy-MM-dd
    @AuraEnabled public String reservationTime;  // HH:mm
    @AuraEnabled public Integer numberOfGuests;
    @AuraEnabled public String specialRequest;
    @AuraEnabled public String paymentMethod;
    // ラウンジ専用
    @AuraEnabled public String seatType;
    @AuraEnabled public String duration;
    @AuraEnabled public String purpose;
    @AuraEnabled public List<String> additionalServices;
}

// 出力（予約結果）
public class ReservationResultWrapper {
    @AuraEnabled public Boolean success;
    @AuraEnabled public String reservationNumber;
    @AuraEnabled public String errorMessage;
}

// 出力（予約一覧）
public class ReservationWrapper {
    @AuraEnabled public String id;
    @AuraEnabled public String reservationNumber;
    @AuraEnabled public String reservationType;
    @AuraEnabled public String targetName;    // レストラン名/ラウンジ名/イベント名
    @AuraEnabled public String reservationDate;
    @AuraEnabled public String reservationTime;
    @AuraEnabled public Integer numberOfGuests;
    @AuraEnabled public String status;
    @AuraEnabled public Decimal totalAmount;
}
```

## セキュリティ要件
- 全 DML 操作前に CRUD/FLS チェック
- ユーザーは自分の予約のみ操作可能（UserInfo.getUserId() で検証）
- SOQL は必ずバインド変数を使用

## テストクラス要件
- @testSetup でテストデータを作成（Member__c, Restaurant__c, Event__c, Lounge__c）
- 正常系・異常系（満席・権限エラー）のテストを含む
- カバレッジ 85%以上

完全な Apex コードを force-app/main/default/classes/ 以下のファイルとして出力してください。
```

### プロンプト 2-B: RestaurantController

```
# タスク: RestaurantController Apex 生成

## コンテキスト
WELTH CLUB のレストラン検索・スロット取得 Controller を作成します。

## 必要なメソッド

### 1. getRestaurants（レストラン一覧）
- @AuraEnabled(cacheable=true)
- 引数: String genre, String area
- 戻り値: List<RestaurantWrapper>
- 処理:
  - genre, area が 'すべて' または null の場合はフィルターなし
  - IsActive__c = true のみ返す
  - RestaurantSlot__c を JOIN して availableSlots に含める
  - 今日以降のスロットのみ返す（SlotDate__c >= TODAY()）

### 2. getRestaurantById（詳細取得）
- @AuraEnabled(cacheable=true)
- 引数: String restaurantId
- 戻り値: RestaurantWrapper

## Wrapper クラス
```apex
public class RestaurantWrapper {
    @AuraEnabled public String id;
    @AuraEnabled public String name;
    @AuraEnabled public String genre;
    @AuraEnabled public String area;
    @AuraEnabled public String description;
    @AuraEnabled public Decimal pricePerPerson;
    @AuraEnabled public String imageUrl;
    @AuraEnabled public List<SlotWrapper> availableSlots;
}
public class SlotWrapper {
    @AuraEnabled public String slotId;
    @AuraEnabled public String slotDate;   // yyyy-MM-dd
    @AuraEnabled public String slotTime;   // HH:mm
    @AuraEnabled public Integer remainingSeats;
}
```

クラスに `with sharing` を必ず付けてください。完全な Apex ファイルを生成してください。
```

### プロンプト 2-C: EventController（getUpcomingEvents 含む）

```
# タスク: EventController Apex 生成

## コンテキスト
WELTH CLUB のイベント検索 Controller を作成します。
ダッシュボードで使用する getUpcomingEvents メソッドも含めます。

## クラス定義
public with sharing class EventController {

## 必要なメソッド

### 1. getEvents（イベント一覧）
- @AuraEnabled(cacheable=true)
- 引数: String category
- 戻り値: List<EventWrapper>
- 処理:
  - category が 'すべて' または null の場合はフィルターなし
  - IsActive__c = true のみ返す
  - EventDate__c >= TODAY() の今後のイベントのみ
  - EventDate__c ASC でソート

### 2. getUpcomingEvents（ダッシュボード用）
- @AuraEnabled(cacheable=true)
- 引数: Integer limitCount
- 戻り値: List<EventWrapper>
- 処理:
  - IsActive__c = true かつ EventDate__c >= TODAY()
  - RemainingSeats__c > 0（満席でないもの）
  - EventDate__c ASC で limitCount 件取得

with sharing を必ず付けてください。完全な Apex ファイル + テストクラスを生成してください。
```

### プロンプト 2-D: ReservationTrigger + Handler

```
# タスク: ReservationTrigger + ReservationTriggerHandler 生成

## コンテキスト
WELTH CLUB の予約作成・キャンセル時に残席数を自動管理する
Apex Trigger と Handler クラスを作成します。

## Trigger 定義
trigger ReservationTrigger on Reservation__c (after insert, after update)

## Handler 仕様
public with sharing class ReservationTriggerHandler {
    public static void handleAfterInsertUpdate(
        List<Reservation__c> newList,
        Map<Id, Reservation__c> oldMap
    )
}

## 処理ロジック

### 新規予約（after insert, Status__c = 'Confirmed'）
- ReservationType__c = 'Restaurant':
  → RefRestaurant__c に紐づく RestaurantSlot__c（SlotDate__c = ReservationDate__c, SlotTime__c = ReservationTime__c）の RemainingSeats__c を -1
- ReservationType__c = 'Event':
  → RefEvent__c の RemainingSeats__c を -1
- ReservationType__c = 'Lounge':
  → 在庫管理なし（スキップ）

### キャンセル（after update, Status__c が 'Cancelled' に変更）
- 上記の逆操作（RemainingSeats__c を +1）

### バリデーション
- RemainingSeats__c が 0 になる場合 → addError('満席のため予約できません')

## テストクラス要件
- 正常系: 予約作成で残席が減ること
- 正常系: キャンセルで残席が戻ること
- 異常系: 満席時にエラーが出ること
- バルクテスト: 200件の予約を一括処理できること

全ファイルを生成してください。
```
