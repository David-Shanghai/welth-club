# Phase 3: LWC コンポーネント実装

## 3-1. LWC ファイル構成（1コンポーネント = 4ファイル）

```
force-app/main/default/lwc/
├── welthSidebar/
│   ├── welthSidebar.html
│   ├── welthSidebar.js
│   ├── welthSidebar.css
│   └── welthSidebar.js-meta.xml
├── welthStepProgress/          ← 共通部品
├── welthSearchFilter/          ← 共通部品
├── welthDateTimePicker/        ← 共通部品
├── welthGuestSelector/         ← 共通部品
├── welthPaymentSelector/       ← 共通部品
├── welthConfirmSummary/        ← 共通部品
├── welthDashboard/
├── welthRestaurantBooking/
├── welthLoungeBooking/
├── welthEventBooking/
└── welthMemberProfile/
```

---

## 3-2. Next.js → LWC 変換パターン集

### useState → reactive property（API v59+ では @track 不要）

> **重要**: API v59 以降、LWC のリアクティビティが強化され、オブジェクトや配列の
> プロパティ変更もフレームワークが自動検知します。`@track` は不要です。
> ただしプロパティへの**再代入**（`this.booking = {...this.booking, key: val}`）が必要です。

```javascript
// Next.js
const [step, setStep] = useState("search");
const [booking, setBooking] = useState({ restaurantId: "", date: "", guests: 2 });

// LWC (API v59+)
import { LightningElement } from 'lwc';
export default class WelthRestaurantBooking extends LightningElement {
    step = 'search';
    booking = {                              // @track は不要（API v59+）
        restaurantId: '',
        date: '',
        guests: 2
    };

    // ✅ プロパティ変更時はスプレッド構文で再代入する
    updateBookingDate(newDate) {
        this.booking = { ...this.booking, date: newDate };
    }
}
```

### useEffect（初期データ取得）→ connectedCallback + @wire

```javascript
// Next.js
useEffect(() => {
    // 初回マウント時にデータ取得
    fetchRestaurants();
}, []);

// LWC (@wire で自動取得)
import { wire } from 'lwc';
import getRestaurants from '@salesforce/apex/RestaurantController.getRestaurants';

@wire(getRestaurants, { genre: '$activeGenre', area: '$activeArea' })
wiredRestaurants({ error, data }) {
    if (data) this.restaurants = data;
    if (error) this.error = error;
}
```

### Context API（認証）→ CurrentPageReference + UserInfo

```javascript
// LWC: ユーザー情報は標準APIから取得
import { CurrentPageReference } from 'lightning/navigation';
import USER_ID from '@salesforce/user/Id';
import USER_NAME from '@salesforce/schema/User.Name';
// Experience Cloud ではセッション管理は Salesforce が担当
// AuthContext 相当は不要
```

### 条件付きレンダリング → if:true / lwc:if

```html
<!-- Next.js JSX -->
{step === "search" && <SearchView />}

<!-- LWC HTML (API v55以下) -->
<template if:true={isStepSearch}>
    <c-welth-search-filter></c-welth-search-filter>
</template>

<!-- LWC HTML (API v56以上 推奨) -->
<template lwc:if={isStepSearch}>
    <c-welth-search-filter></c-welth-search-filter>
</template>
```

```javascript
// JS側で getter を定義
get isStepSearch() { return this.step === 'search'; }
get isStepSlots()  { return this.step === 'slots'; }
```

### リストレンダリング → for:each / iterator

```html
<!-- Next.js JSX -->
{restaurants.map(r => <RestaurantCard key={r.id} restaurant={r} />)}

<!-- LWC HTML -->
<template for:each={restaurants} for:item="restaurant">
    <c-welth-restaurant-card
        key={restaurant.id}
        restaurant={restaurant}
        onselect={handleSelectRestaurant}>
    </c-welth-restaurant-card>
</template>
```

### イベントハンドリング → handleXxx メソッド

```javascript
// Next.js
const handleSelectRestaurant = (id) => {
    setBooking(b => ({ ...b, restaurantId: id }));
    setStep("slots");
};

// LWC
handleSelectRestaurant(event) {
    const restaurantId = event.detail.restaurantId; // CustomEvent から受け取る
    this.booking = { ...this.booking, restaurantId };
    this.step = 'slots';
}
```

### 子→親イベント伝播 → CustomEvent + dispatchEvent

```javascript
// 子コンポーネント側（welthRestaurantCard.js）
handleSelect() {
    this.dispatchEvent(new CustomEvent('select', {
        detail: { restaurantId: this.restaurant.id }
    }));
}

// 親コンポーネント側のHTML
// onselect={handleSelectRestaurant} で受け取る
```

### props → @api

```javascript
// Next.js
function StepProgress({ current }: { current: Step }) {}

// LWC
import { LightningElement, api } from 'lwc';
export default class WelthStepProgress extends LightningElement {
    @api currentStep;   // 親から渡される
    @api steps = [];    // ステップ定義配列
}
```

---

## 3-3. 多段階フローの LWC 実装パターン

### ステップ管理の基本構造

```javascript
// welthRestaurantBooking.js
export default class WelthRestaurantBooking extends LightningElement {
    STEP_ORDER = ['search', 'slots', 'booking', 'payment', 'confirm', 'complete'];
    step = 'search';

    // ステップ判定 getter 群
    get isStepSearch()   { return this.step === 'search'; }
    get isStepSlots()    { return this.step === 'slots'; }
    get isStepBooking()  { return this.step === 'booking'; }
    get isStepPayment()  { return this.step === 'payment'; }
    get isStepConfirm()  { return this.step === 'confirm'; }
    get isStepComplete() { return this.step === 'complete'; }

    // 戻るボタン
    handleBack() {
        const idx = this.STEP_ORDER.indexOf(this.step);
        if (idx > 0) this.step = this.STEP_ORDER[idx - 1];
    }

    // 次へボタン
    handleNext(event) {
        const nextStep = event.detail?.nextStep;
        if (nextStep) this.step = nextStep;
    }
}
```

### StepProgress コンポーネント

```javascript
// welthStepProgress.js
import { LightningElement, api } from 'lwc';
export default class WelthStepProgress extends LightningElement {
    @api currentStep;
    @api steps = []; // [{ key: 'slots', label: '日時選択' }, ...]

    get stepsWithState() {
        const currentIdx = this.steps.findIndex(s => s.key === this.currentStep);
        return this.steps.map((step, i) => ({
            ...step,
            isDone: i < currentIdx,
            isActive: i === currentIdx,
            stepNumber: i + 1,
            cssClass: i < currentIdx ? 'step done' : i === currentIdx ? 'step active' : 'step'
        }));
    }
}
```

---

## 3-4. スタイリング移行: Tailwind CSS → SLDS + CSS Scoping

### CSS 変数の移行

```css
/* globals.css (Next.js) */
:root {
    --gold: #C9A962;
    --bg-page: #0A0A0A;
    --text-primary: #FFFFFF;
}

/* welthDashboard.css (LWC) */
/* LWC の CSS は自動スコープされる */
:host {
    --welth-gold: #C9A962;
    --welth-bg-page: #0A0A0A;
    --welth-text-primary: #FFFFFF;
}
```

### Tailwind クラスの SLDS 対応表

| Tailwind | SLDS / CSS | 備考 |
|---------|-----------|------|
| `flex flex-col` | `slds-grid slds-wrap` | |
| `gap-4` | `slds-grid slds-gutters` | |
| `p-4` | `slds-p-around_medium` | |
| `text-sm` | `slds-text-body_small` | |
| `font-bold` | `slds-text-title_bold` | |
| `rounded` | `slds-radius` | |
| `hidden` | `slds-hide` | |
| カスタムカラー | CSS直書き or CSS変数 | SLDS は上書き可 |

> **注意**: WELTH CLUB のようなダークテーマ・カスタムデザインは
> SLDS のベースを上書きするか、完全なカスタム CSS で実装する。
> `@salesforce/resourceUrl` 経由で Static Resource として CSS を読み込む方法もある。

---

## 3-5. js-meta.xml（コンポーネント公開設定）

```xml
<!-- Experience Cloud で利用するコンポーネントは targets を設定 -->
<?xml version="1.0" encoding="UTF-8"?>
<LightningComponentBundle xmlns="http://soap.sforce.com/2006/04/metadata">
    <apiVersion>59.0</apiVersion>
    <isExposed>true</isExposed>
    <targets>
        <target>lightningCommunity__Page</target>         <!-- Experience Cloud ページ -->
        <target>lightningCommunity__Default</target>      <!-- EC デフォルト -->
    </targets>
    <targetConfigs>
        <targetConfig targets="lightningCommunity__Default">
            <!-- ページビルダーで設定可能なプロパティ -->
            <property name="title" type="String" label="タイトル" />
        </targetConfig>
    </targetConfigs>
</LightningComponentBundle>
```
