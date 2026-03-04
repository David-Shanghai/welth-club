# Phase 2: Apex バックエンド実装

## 2-1. Apex Controller 設計パターン

LWC から呼び出す Apex は **1機能1メソッド** で設計する。

### 命名規則
```
{ドメイン}Controller.cls
例: RestaurantController.cls, ReservationController.cls
```

### セキュリティ必須ルール

```apex
// ✅ 全 Controller クラスに `with sharing` を必ず明記する
public with sharing class RestaurantController {

// ❌ `without sharing` は原則禁止（管理者向けバッチ処理など限定的な場面のみ）
// ❌ アノテーションなし（= without sharing と同等で危険）
```

### メソッド設計原則
```apex
// ✅ 推奨: 専用の Wrapper クラスで返す
@AuraEnabled(cacheable=true)
public static List<RestaurantWrapper> getRestaurants(String genre, String area) {}

// ❌ 非推奨: SObject を直接返す（全フィールドが露出するセキュリティリスク）
@AuraEnabled(cacheable=true)
public static List<Restaurant__c> getRestaurants() {}
```

---

## 2-2. 必要な Apex Controller 一覧

### MemberController.cls
```apex
public with sharing class MemberController {

    // 現在ログイン中の会員情報を取得
    // Contact の情報を User.ContactId 経由で取得
    @AuraEnabled(cacheable=true)
    public static MemberWrapper getCurrentMember()

    // 会員情報を更新
    @AuraEnabled
    public static void updateMember(MemberWrapper memberData)

    // 通知設定を更新
    @AuraEnabled
    public static void updateNotificationPreferences(Map<String, Boolean> preferences)
}
```

### RestaurantController.cls
```apex
public with sharing class RestaurantController {

    // レストラン一覧を取得（フィルター付き）
    @AuraEnabled(cacheable=true)
    public static List<RestaurantWrapper> getRestaurants(String genre, String area)

    // 特定レストランの予約可能スロットを取得
    @AuraEnabled(cacheable=true)
    public static List<SlotWrapper> getAvailableSlots(String restaurantId, Date reservationDate)
}
```

### LoungeController.cls
```apex
public with sharing class LoungeController {

    // ラウンジ一覧を取得
    @AuraEnabled(cacheable=true)
    public static List<LoungeWrapper> getLounges(String area)

    // ラウンジの利用可能時間帯を取得
    @AuraEnabled(cacheable=true)
    public static List<String> getAvailableTimeSlots(String loungeId, Date reservationDate)
}
```

### EventController.cls
```apex
public with sharing class EventController {

    // イベント一覧を取得（カテゴリフィルター付き）
    @AuraEnabled(cacheable=true)
    public static List<EventWrapper> getEvents(String category)

    // 今後のおすすめイベントを取得（ダッシュボード用）
    @AuraEnabled(cacheable=true)
    public static List<EventWrapper> getUpcomingEvents(Integer limitCount)
}
```

### ReservationController.cls
```apex
public with sharing class ReservationController {

    // 予約を作成（レストラン・ラウンジ・イベント共通）
    @AuraEnabled
    public static ReservationResultWrapper createReservation(ReservationInputWrapper input)

    // 予約一覧を取得（直近N件）
    @AuraEnabled(cacheable=true)
    public static List<ReservationWrapper> getMyReservations(Integer limitCount)

    // 予約をキャンセル
    @AuraEnabled
    public static void cancelReservation(String reservationId)
}
```

---

## 2-3. Wrapper クラス設計パターン

LWC に返すデータは必ず Wrapper クラスを使う。

```apex
// 共通パターン
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
    @AuraEnabled public String slotDate;   // yyyy-MM-dd 文字列で統一
    @AuraEnabled public String slotTime;
    @AuraEnabled public Integer remainingSeats;
}

// 予約入力 Wrapper
public class ReservationInputWrapper {
    @AuraEnabled public String reservationType; // Restaurant/Lounge/Event
    @AuraEnabled public String targetId;
    @AuraEnabled public String reservationDate;
    @AuraEnabled public String reservationTime;
    @AuraEnabled public Integer numberOfGuests;
    @AuraEnabled public String specialRequest;
    @AuraEnabled public String paymentMethod;
    // ラウンジ専用
    @AuraEnabled public String seatType;
    @AuraEnabled public String duration;
    @AuraEnabled public String purpose;
    @AuraEnabled public List<String> additionalServices;
}

// 予約結果 Wrapper
public class ReservationResultWrapper {
    @AuraEnabled public Boolean success;
    @AuraEnabled public String reservationNumber;
    @AuraEnabled public String errorMessage;
}

// 予約一覧 Wrapper
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

// 会員 Wrapper
public class MemberWrapper {
    @AuraEnabled public String contactId;
    @AuraEnabled public String memberId;       // MemberID__c
    @AuraEnabled public String fullName;
    @AuraEnabled public String fullNameKana;
    @AuraEnabled public String email;
    @AuraEnabled public String phone;
    @AuraEnabled public String address;
    @AuraEnabled public String birthdate;
    @AuraEnabled public String membershipStatus;
    @AuraEnabled public Decimal pointBalance;
    @AuraEnabled public Map<String, Boolean> notifications;
}

// イベント Wrapper
public class EventWrapper {
    @AuraEnabled public String id;
    @AuraEnabled public String name;
    @AuraEnabled public String category;
    @AuraEnabled public String eventDate;
    @AuraEnabled public String eventTime;
    @AuraEnabled public String venue;
    @AuraEnabled public String description;
    @AuraEnabled public Integer capacity;
    @AuraEnabled public Integer remainingSeats;
    @AuraEnabled public Decimal price;
    @AuraEnabled public String imageUrl;
}

// ラウンジ Wrapper
public class LoungeWrapper {
    @AuraEnabled public String id;
    @AuraEnabled public String name;
    @AuraEnabled public String area;
    @AuraEnabled public String description;
    @AuraEnabled public String operatingHours;
    @AuraEnabled public List<String> availableTimeSlots;
    @AuraEnabled public String imageUrl;
}
```

---

## 2-4. Apex Trigger（在庫・残席管理）

```apex
// ReservationTrigger.trigger
trigger ReservationTrigger on Reservation__c (after insert, after update) {
    ReservationTriggerHandler.handleAfterInsertUpdate(
        Trigger.new, Trigger.oldMap
    );
}

// ReservationTriggerHandler.cls
public with sharing class ReservationTriggerHandler {

    public static void handleAfterInsertUpdate(
        List<Reservation__c> newList,
        Map<Id, Reservation__c> oldMap
    ) {
        // 1. 新規予約（Status='Confirmed'）→ 残席 -1
        // 2. キャンセル（Status が 'Cancelled' に変更）→ 残席 +1
        // 3. 残席が0未満になる場合 → addError でロールバック
        //
        // 対象判定:
        //   - ReservationType__c = 'Restaurant' → RestaurantSlot__c.RemainingSeats__c
        //   - ReservationType__c = 'Event' → Event__c.RemainingSeats__c
        //   - ReservationType__c = 'Lounge' → 在庫管理なし
    }
}
```

---

## 2-5. セキュリティ考慮事項

### 2-5-1. with sharing の厳守（リスク: 高）
```apex
// ✅ 全 Controller に `with sharing` を明記
public with sharing class ReservationController {
    // Sharing Rules が適用され、ユーザーはアクセス権のあるレコードのみ参照可能
}

// ❌ Experience Cloud のゲストユーザーは with sharing でないと
//    全レコードにアクセスできてしまう
```

### 2-5-2. SOQL インジェクション対策（リスク: 高）
```apex
// ✅ バインド変数を必ず使う
List<Restaurant__c> results = [
    SELECT Id, Name FROM Restaurant__c
    WHERE Genre__c = :genre AND Area__c = :area
];

// ❌ 文字列連結は絶対禁止
String query = 'SELECT Id FROM Restaurant__c WHERE Genre__c = \'' + genre + '\'';
```

### 2-5-3. CRUD/FLS チェック（リスク: 高）
```apex
// ✅ DML 操作前に必ずチェック
if (!Schema.sObjectType.Reservation__c.isCreateable()) {
    throw new AuraHandledException('予約を作成する権限がありません');
}

// ✅ フィールドレベルの確認（機密フィールドを含む場合）
if (!Schema.sObjectType.Contact.fields.PointBalance__c.isAccessible()) {
    throw new AuraHandledException('フィールドへのアクセス権がありません');
}
```

### 2-5-4. データアクセスの制限（リスク: 高）
```apex
// ✅ EC ユーザーの ContactId を経由して自分のデータのみ取得
Id userId = UserInfo.getUserId();
User currentUser = [SELECT ContactId FROM User WHERE Id = :userId LIMIT 1];

List<Reservation__c> myReservations = [
    SELECT Id, ReservationNumber__c
    FROM Reservation__c
    WHERE RefContact__c = :currentUser.ContactId
    ORDER BY ReservationDate__c DESC
    LIMIT :limitCount
];

// ❌ UserInfo.getUserId() のみでフィルタすると
//    Contact 経由の絞り込みが効かない
```

### 2-5-5. Experience Cloud ゲストユーザー対策（リスク: 高）
```
- Guest User Profile で各オブジェクトの CRUD 権限を最小化
  - Restaurant__c / Event__c / Lounge__c → Read のみ
  - Reservation__c → アクセス不可
  - Contact → アクセス不可
- Guest User の Sharing Set で公開レコードを制限
- cacheable=true のメソッドはゲストからも呼ばれる可能性がある
  → 公開データ（レストラン・イベント一覧）のみ cacheable=true にする
  → 個人データ（予約・会員情報）は cacheable=false にする
```

---

## 2-6. テストクラス要件

```
目標カバレッジ: 85%以上（Salesforce本番デプロイ要件: 75%）

各 Controller / Trigger に対応するテストクラスを作成:
- RestaurantControllerTest.cls
- LoungeControllerTest.cls
- EventControllerTest.cls
- ReservationControllerTest.cls
- MemberControllerTest.cls
- ReservationTriggerHandlerTest.cls

テストデータは @testSetup で共通化

テストケース必須項目:
- 正常系（CRUD 操作の成功）
- 異常系（権限不足・満席・無効な入力）
- バルクテスト（200件以上のレコードで Trigger を検証）
- ネガティブテスト（他人の予約を操作しようとした場合のエラー）
```
