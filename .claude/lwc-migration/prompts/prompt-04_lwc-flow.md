# Claude Code プロンプト 04: LWC 多段階フロー（ページコンポーネント）生成

## 用途
Next.js の各ページ（多段階フロー）を LWC ページコンポーネントに変換する。
各フローは親コンポーネントがステップ状態を管理し、共通子コンポーネントを組み合わせる。

---

## プロンプトテンプレート（汎用）

```
# タスク: Next.js ページ → LWC 多段階フローコンポーネント変換

## コンテキスト
Next.js で実装された多段階フローのページコンポーネントを Salesforce LWC に変換します。
以下のルールに従ってください。

## 変換ルール

### 状態管理
- useState → クラスプロパティ（プリミティブ） / @track（オブジェクト・配列）
- ステップ管理 → step プロパティ + getter で条件判定
- setXxx(prev => ({...prev, key: val})) → this.xxx = {...this.xxx, key: val}

### テンプレート
- {condition && <Component />} → <template lwc:if={isCondition}></template>
- {array.map(item => ...)} → <template for:each={array} for:item="item"></template>
- className={`... ${condition ? 'a' : 'b'}`} → class={computedClass}（getter で計算）
- onClick={() => fn(args)} → onclick={handleFn} + data-* 属性で引数渡し

### データ取得
- モックデータ → @wire(apexMethod, { params }) でデータ取得
- fetch/axios → import method from '@salesforce/apex/XxxController.method'

### ナビゲーション
- window.location.href = '/' → NavigationMixin で遷移
- useRouter → NavigationMixin

### イベント
- onChange={(e) => setState(e.target.value)} → onchange={handleChange} + event.target.value
- onClick={() => setStep('next')} → onclick={handleNext}

## 移行元 Next.js コード
```tsx
[ここに対象ページの page.tsx の全コードを貼り付ける]
```

## 使用する共通子コンポーネント
以下の共通コンポーネントが既に作成済みです。積極的に利用してください：
- c-welth-step-progress: ステップインジケーター（@api currentStep, @api steps）
- c-welth-search-filter: フィルタータブ（@api filters, @api activeFilter → filterchange イベント）
- c-welth-payment-selector: 支払い選択（@api options, @api selectedValue → paymentchange イベント）
- c-welth-sidebar: サイドバー（@api currentPage）

## 使用する Apex Controller
- [ControllerName].method — [説明]

## 出力してほしいファイル
1. [componentName].html
2. [componentName].js
3. [componentName].css
4. [componentName].js-meta.xml

## 要件
- Experience Cloud ページとして公開する設定（js-meta.xml の targets）
- ダークテーマのスタイリング（CSS変数使用）
- エラーハンドリング（Apex呼び出し失敗時の表示）
- ローディング状態の表示（spinner）
```

---

## WELTH CLUB 向け実際のプロンプト（コピー&ペースト用）

### プロンプト 4-A: welthRestaurantBooking（レストラン予約フロー）

```
# タスク: レストラン予約フロー LWC 変換

## コンテキスト
WELTH CLUB のレストラン予約ページ（Next.js）を Salesforce LWC に変換します。
6段階フロー（search → slots → booking → payment → confirm → complete）を実装します。

## 移行元
src/app/restaurant/page.tsx（722行）の全コードを参照してください。
※このファイルを読み込んで変換してください

## コンポーネント名: welthRestaurantBooking
## 配置先: force-app/main/default/lwc/welthRestaurantBooking/

## フロー構成

### Step 1: search（レストラン検索・一覧）
- Apex: RestaurantController.getRestaurants(genre, area)
- ジャンルフィルター: ['すべて', '和食', 'フレンチ', 'イタリアン']
- エリアフィルター: ['すべて', '銀座', '六本木', '麻布台', '丸の内']
- 子コンポーネント: c-welth-search-filter を2つ（ジャンル・エリア）
- レストランカードをグリッド表示（3列）
- カードクリックで step='slots' へ遷移

### Step 2: slots（日時選択）
- 選択したレストランの availableSlots を表示
- 日付ボタン群 + 時間ボタン群
- 「戻る」ボタンで step='search'
- 日時確定で step='booking'

### Step 3: booking（予約情報入力）
- 人数選択（1〜10、増減ボタン）
- 特別リクエスト（textarea）
- 「次へ」で step='payment'

### Step 4: payment（お支払い方法選択）
- 子コンポーネント: c-welth-payment-selector
- 選択肢:
  - card-registered: 登録カードで支払い（VISA ****4242）
  - points: ポイントで支払い（残高: 125,000 pt）
  - onsite: 現地でお支払い
- 「次へ」で step='confirm'

### Step 5: confirm（確認画面）
- 予約内容のサマリーを表示
- 「予約を確定する」ボタン → Apex: ReservationController.createReservation()
- 成功 → step='complete'

### Step 6: complete（完了画面）
- 予約番号を表示
- 「レストラン一覧に戻る」→ step='search' + booking リセット
- 「ダッシュボードへ」→ NavigationMixin で / へ遷移

## @track プロパティ
```javascript
step = 'search';
activeGenre = 'すべて';
activeArea = 'すべて';
@track booking = {
    restaurantId: '',
    date: '',
    time: '',
    guests: 2,
    request: '',
    paymentMethod: '',
    cardLast4: '4242'
};
restaurants = [];       // @wire で取得
isLoading = false;
error = '';
reservationNumber = ''; // 完了時に設定
```

## 使用する Apex
- RestaurantController.getRestaurants(genre, area) → List<RestaurantWrapper>
- ReservationController.createReservation(input) → ReservationResultWrapper

## スタイリング要件
- ダークテーマ（背景 #0A0A0A、カード #1A1A1A）
- ゴールドアクセント #C9A962
- レストランカード: 画像上部 + 情報下部、hover でボーダーゴールド化
- グリッドレイアウト: 3列（grid-template-columns: repeat(3, 1fr)）
- ボタン: ゴールド背景 + ダークテキスト
- 戻るボタン: ゴーストスタイル（ボーダーのみ）

## Experience Cloud 公開設定
- targets: lightningCommunity__Page, lightningCommunity__Default

全4ファイルの完全なコードを出力してください。
```

### プロンプト 4-B: welthLoungeBooking（ラウンジ予約フロー）

```
# タスク: ラウンジ予約フロー LWC 変換

## コンテキスト
WELTH CLUB のラウンジ予約ページ（Next.js）を LWC に変換します。
5段階フロー（list → datetime → info → confirm → complete）を実装します。

## 移行元
src/app/lounge/page.tsx（599行）の全コードを参照してください。
※このファイルを読み込んで変換してください

## コンポーネント名: welthLoungeBooking
## 配置先: force-app/main/default/lwc/welthLoungeBooking/

## フロー構成

### Step 1: list（ラウンジ一覧）
- Apex: LoungeController.getLounges(area)
- エリアフィルター: ['すべて', '丸の内', '銀座']
- c-welth-search-filter 使用
- ラウンジカードの表示（画像 + 説明 + 営業時間）

### Step 2: datetime（日時選択）
- 日付入力（input type="date"）
- 時間ボタン群（ラウンジの timeSlots から生成）

### Step 3: info（予約情報入力）
- 座席タイプ選択（ソファ / カウンター / 個室）← ラジオボタン
- 利用時間（1〜4時間 セレクトボックス）
- 利用人数（1〜4名 増減ボタン）
- 利用目的（選択式）
- 追加サービス（チェックボックス群: ドリンク / フード / プロジェクター）
- 特別リクエスト（textarea）

### Step 4: confirm（確認画面）
- 予約サマリー表示
- Apex: ReservationController.createReservation()

### Step 5: complete（完了画面）
- 予約番号表示 + 遷移ボタン

## @track プロパティ
```javascript
step = 'list';
activeFilter = 'すべて';
@track booking = {
    loungeId: '',
    date: '',
    time: '',
    seatType: '',
    duration: '2時間',
    guests: 1,
    purpose: '',
    services: [],
    request: ''
};
lounges = [];
isLoading = false;
reservationNumber = '';
```

## 使用する Apex
- LoungeController.getLounges(area) → List<LoungeWrapper>
- ReservationController.createReservation(input) → ReservationResultWrapper

全4ファイルの完全なコードを出力してください。
```

### プロンプト 4-C: welthEventBooking（イベント申込フロー）

```
# タスク: イベント申込フロー LWC 変換

## コンテキスト
WELTH CLUB のイベント申込ページ（Next.js）を LWC に変換します。
5段階フロー（list → application → payment → confirm → complete）を実装します。
※ 無料イベントの場合は payment ステップをスキップする。

## 移行元
src/app/events/page.tsx（535行）の全コードを参照してください。
※このファイルを読み込んで変換してください

## コンポーネント名: welthEventBooking
## 配置先: force-app/main/default/lwc/welthEventBooking/

## フロー構成

### Step 1: list（イベント一覧）
- Apex: EventController.getEvents(category)
- カテゴリフィルター: ['すべて', 'ワイン', 'セミナー', 'アート', 'ゴルフ']
- イベントカード: 画像 + カテゴリ + 日時 + 名称 + 会場 + 残席 + 価格
- 価格が0の場合「無料」と表示

### Step 2: application（申込情報）
- 参加人数（1〜5名 増減ボタン。remainingSeats を超えないよう制限）
- リクエスト（textarea）
- 「次へ」→ price > 0 の場合 payment、0 の場合 confirm へ

### Step 3: payment（お支払い）※ price > 0 の場合のみ
- c-welth-payment-selector（card-registered / points の2択）
- 合計金額を表示（price × guests）

### Step 4: confirm（確認画面）
- Apex: ReservationController.createReservation()

### Step 5: complete（完了画面）
- 申込番号 + 遷移ボタン

## 特殊ロジック
- 無料イベント: payment ステップをスキップ
- StepProgress: 無料時は payment を steps 配列から除外

全4ファイルの完全なコードを出力してください。
```

### プロンプト 4-D: welthDashboard（ダッシュボード）

```
# タスク: ダッシュボード LWC 変換

## コンテキスト
WELTH CLUB のダッシュボードページ（Next.js）を LWC に変換します。
多段階フローではなく、複数の情報パネルを表示する単一画面です。

## 移行元
src/app/page.tsx の全コードを参照してください。

## コンポーネント名: welthDashboard
## 配置先: force-app/main/default/lwc/welthDashboard/

## 表示内容

### 1. ウェルカムヘッダー
- 「おかえりなさい、[会員名]様」
- 日付表示

### 2. 会員ステータスカード（横3列）
- 会員ステータス（Platinum / Gold / Silver）
- 予約件数
- ポイント残高

### 3. 直近のご予約（リスト表示 最大5件）
- Apex: ReservationController.getMyReservations(5)
- 各予約: 種別アイコン + 施設名 + 日時 + ステータス

### 4. おすすめイベント（カード2枚）
- Apex: EventController.getUpcomingEvents(2)
- 画像 + カテゴリ + 日時 + イベント名 + 会場

## 使用する Apex
- MemberController.getCurrentMember()
- ReservationController.getMyReservations(5)
- EventController.getUpcomingEvents(2)

全4ファイルの完全なコードを出力してください。
```

### プロンプト 4-E: welthMemberProfile（会員情報編集）

```
# タスク: 会員情報編集ページ LWC 変換

## コンテキスト
WELTH CLUB の会員情報編集ページ（Next.js）を LWC に変換します。
表示モードと編集モードを切り替える UI です。

## 移行元
src/app/profile/page.tsx（273行）の全コードを参照してください。

## コンポーネント名: welthMemberProfile
## 配置先: force-app/main/default/lwc/welthMemberProfile/

## 表示内容

### ヘッダー
- 「会員情報」タイトル
- 会員ステータスバッジ（Platinum）
- 「編集」ボタン ↔ 「保存」「キャンセル」ボタン切替

### プロフィールフィールド
- 氏名（漢字）
- 氏名（カナ）
- メールアドレス
- 電話番号
- 住所
- 生年月日
- 表示モード: ラベル + 値（読み取り専用）
- 編集モード: ラベル + input（編集可能）

### 通知設定（トグルスイッチ 4つ）
- イベント通知
- リマインダー
- マーケット情報
- 雑誌配信

## 状態管理
```javascript
isEditing = false;
isSaved = false;
@track profile = {};     // @wire(getCurrentMember) から取得
@track editDraft = {};    // 編集中のコピー
@track notifications = {
    events: true,
    reminders: true,
    market: false,
    magazine: true
};
```

## 処理
- 「編集」クリック → editDraft = {...profile}, isEditing = true
- 「保存」クリック → Apex: MemberController.updateMember(editDraft)
  - 成功 → profile = editDraft, isEditing = false, isSaved = true（3秒後リセット）
- 「キャンセル」クリック → isEditing = false, editDraft を破棄
- 通知トグル変更 → Apex: MemberController.updateNotificationPreferences()

## 使用する Apex
- MemberController.getCurrentMember() → MemberWrapper
- MemberController.updateMember(MemberWrapper) → void
- MemberController.updateNotificationPreferences(Map<String,Boolean>) → void

全4ファイルの完全なコードを出力してください。
```
