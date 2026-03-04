# Phase 5: テスト・デプロイ

## 5-1. テスト戦略

### レイヤー別テスト

| レイヤー | ツール | 対象 |
|---------|-------|------|
| Apex Unit Test | Salesforce Test Framework | Controller・Trigger ロジック |
| LWC Unit Test | Jest (LWC Jest) | コンポーネントの振る舞い |
| E2E テスト | Selenium / Playwright | ユーザーフロー全体 |
| UAT | 手動 | ビジネス要件確認 |

---

## 5-2. Apex テストの必須事項

```apex
// テストカバレッジ 75%以上が本番デプロイ要件
// 85%以上を目標とする

@isTest
public class RestaurantControllerTest {
    @testSetup
    static void setupTestData() {
        // テストデータ作成
        Restaurant__c rest = new Restaurant__c(
            Name = 'テストレストラン',
            Genre__c = '和食',
            Area__c = '銀座'
        );
        insert rest;
    }

    @isTest
    static void testGetRestaurants() {
        Test.startTest();
        List<RestaurantController.RestaurantWrapper> result =
            RestaurantController.getRestaurants('和食', '銀座', Date.today());
        Test.stopTest();

        System.assertEquals(1, result.size());
        System.assertEquals('テストレストラン', result[0].name);
    }
}
```

---

## 5-3. LWC Jest テストの基本構造

```javascript
// __tests__/welthRestaurantBooking.test.js
import { createElement } from 'lwc';
import WelthRestaurantBooking from 'c/welthRestaurantBooking';
import getRestaurants from '@salesforce/apex/RestaurantController.getRestaurants';

jest.mock('@salesforce/apex/RestaurantController.getRestaurants');

describe('welthRestaurantBooking', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('初期ステップは search であること', () => {
        const element = createElement('c-welth-restaurant-booking', {
            is: WelthRestaurantBooking
        });
        document.body.appendChild(element);
        expect(element.shadowRoot.querySelector('[data-id="step-search"]')).toBeTruthy();
    });
});
```

---

## 5-4. デプロイ手順

### Scratch Org → Sandbox → 本番

```bash
# 1. Scratch Org での検証
sf project deploy start --target-org scratch-org

# 2. Sandbox へのデプロイ
sf project deploy start --target-org sandbox --manifest manifest/package.xml

# 3. Apex テスト実行
sf apex run test --target-org sandbox --test-level RunLocalTests --result-format human

# 4. 本番デプロイ（テストカバレッジ確認後）
sf project deploy start --target-org production --manifest manifest/package.xml --test-level RunLocalTests
```

### package.xml の基本構造
```xml
<?xml version="1.0" encoding="UTF-8"?>
<Package xmlns="http://soap.sforce.com/2006/04/metadata">
    <types>
        <members>*</members>
        <name>LightningComponentBundle</name>
    </types>
    <types>
        <members>*</members>
        <name>ApexClass</name>
    </types>
    <types>
        <members>*</members>
        <name>ApexTrigger</name>
    </types>
    <types>
        <members>*</members>
        <name>CustomObject</name>
    </types>
    <types>
        <members>*</members>
        <name>CustomField</name>
    </types>
    <types>
        <members>*</members>
        <name>StaticResource</name>
    </types>
    <types>
        <members>*</members>
        <name>PermissionSet</name>
    </types>
    <types>
        <members>*</members>
        <name>CustomTab</name>
    </types>
    <version>59.0</version>
</Package>
```

---

## 5-5. UAT チェックリスト

```
□ ログイン・ログアウト
□ ダッシュボード表示（会員情報・予約履歴・おすすめイベント）
□ レストラン予約フロー（全6ステップ）
  □ 検索・フィルター（ジャンル・エリア・日付）
  □ 日時選択
  □ 予約情報入力（人数・リクエスト）
  □ 支払い方法選択
  □ 確認画面
  □ 完了・予約番号発行
□ ラウンジ予約フロー（全5ステップ）
□ イベント申込フロー（全5ステップ・無料イベントのスキップ確認）
□ 会員情報編集・保存
□ 通知設定の変更・保存
□ モバイルレスポンシブ確認
□ 権限テスト（他会員のデータが見えないこと）
```
