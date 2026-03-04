# Claude Code プロンプト 03: LWC 共通コンポーネント生成

## 用途
複数フローで再利用する共通 LWC コンポーネントを生成する。

---

## プロンプトテンプレート（汎用）

```
# タスク: LWC 共通コンポーネント生成

## コンポーネント名: [welthXxx]

## 役割
[このコンポーネントの役割・何を表示するか]

## @api プロパティ（親から受け取る）
| プロパティ名 | 型 | 必須 | 説明 |
|------------|-----|------|------|
| [name] | [type] | [yes/no] | [説明] |

## 発火するカスタムイベント（子→親）
| イベント名 | detail の構造 | 発火タイミング |
|-----------|-------------|--------------|
| [eventname] | { [key]: [type] } | [タイミング] |

## 表示ロジック
[表示ルール・条件分岐の説明]

## スタイリング
- ダークテーマ（背景: #1A1A1A、テキスト: #FFFFFF）
- アクセントカラー: #C9A962（ゴールド）
- フォント: Inter（本文）、Cormorant Garamond（見出し）
- SLDS は最小限、カスタム CSS メイン

## 出力してほしいファイル
1. [componentName].html
2. [componentName].js
3. [componentName].css
4. [componentName].js-meta.xml（targets: lightningCommunity__Page）
```

---

## WELTH CLUB 向け実際のプロンプト（コピー&ペースト用）

### プロンプト 3-A: welthStepProgress（ステップインジケーター）

```
# タスク: welthStepProgress LWC コンポーネント生成

## コンポーネント名: welthStepProgress
## 配置先: force-app/main/default/lwc/welthStepProgress/

## 役割
多段階フローの進捗を表示する水平ステップインジケーター。
各ステップに番号・ラベルを表示し、完了・現在・未到達の3状態を視覚的に区別する。

## @api プロパティ
| プロパティ名 | 型 | 必須 | 説明 |
|------------|-----|------|------|
| currentStep | String | yes | 現在のステップキー（例: 'slots'） |
| steps | Array | yes | [{key: 'slots', label: '日時選択'}, ...] |

## 表示ロジック
- steps 配列を左から右に表示
- currentStep より前のステップ: 完了状態（ゴールド背景 + チェックアイコン）
- currentStep と一致するステップ: アクティブ状態（ゴールドボーダー + ゴールドテキスト）
- currentStep より後のステップ: 未到達状態（グレーボーダー + グレーテキスト）
- ステップ間はラインで繋ぐ

## スタイリング
- ダークテーマ
- 完了: background: #C9A962, color: #0A0A0A
- アクティブ: border: 2px solid #C9A962, color: #C9A962
- 未到達: border: 1px solid #2A2A2A, color: #6A6A6A
- ステップ数字サイズ: 28x28px
- ラベルフォント: Inter 12px

## 発火するカスタムイベント
なし（表示専用コンポーネント）

全4ファイルを完全なコードで出力してください。
```

### プロンプト 3-B: welthSearchFilter（フィルタータブ）

```
# タスク: welthSearchFilter LWC コンポーネント生成

## コンポーネント名: welthSearchFilter
## 配置先: force-app/main/default/lwc/welthSearchFilter/

## 役割
タブ形式のフィルターボタン群。「すべて」を含む複数の選択肢を横並びで表示し、
選択中のタブをアクティブ状態（ゴールド）で表示する。

## @api プロパティ
| プロパティ名 | 型 | 必須 | 説明 |
|------------|-----|------|------|
| filters | Array | yes | 表示するフィルター文字列の配列（例: ['すべて', '和食', 'フレンチ']） |
| activeFilter | String | yes | 現在アクティブなフィルター値 |
| label | String | no | フィルターグループのラベル（例: 'ジャンル'） |

## 発火するカスタムイベント
| イベント名 | detail | 発火タイミング |
|-----------|--------|--------------|
| filterchange | { value: String } | フィルタータブをクリックしたとき |

## 表示ロジック
- filters 配列を横並びで表示（flex, wrap 可）
- activeFilter と一致するタブ: ゴールド背景（#C9A962）、テキスト #0A0A0A
- それ以外のタブ: 暗いボーダー（#2A2A2A）、テキスト #848484
- hover 時: 若干明るくなる

## スタイリング
- タブの高さ: 32px
- タブの padding: 0 16px
- タブ間 gap: 8px
- border-radius: 0（スクエア）
- font: Inter 13px

全4ファイルを完全なコードで出力してください。
```

### プロンプト 3-C: welthPaymentSelector（支払い方法選択）

```
# タスク: welthPaymentSelector LWC コンポーネント生成

## コンポーネント名: welthPaymentSelector
## 配置先: force-app/main/default/lwc/welthPaymentSelector/

## 役割
予約の支払い方法を選択するラジオボタン群コンポーネント。
登録カード・ポイント・現地決済などの選択肢を表示する。

## @api プロパティ
| プロパティ名 | 型 | 必須 | 説明 |
|------------|-----|------|------|
| options | Array | yes | [{value: 'card-registered', label: '登録カードで支払い', description: 'VISA ****4242'}, ...] |
| selectedValue | String | yes | 現在選択中の value |
| pointBalance | Number | no | ポイント残高（ポイント選択肢がある場合に表示） |

## 発火するカスタムイベント
| イベント名 | detail | 発火タイミング |
|-----------|--------|--------------|
| paymentchange | { value: String } | 選択肢をクリックしたとき |

## 表示ロジック
- 各選択肢をカード形式で縦並びに表示
- 選択中のカード: 左ボーダーをゴールドに（border-left: 2px solid #C9A962）
- ラジオボタンはカスタムスタイル（標準UIは非表示）
- label と description を2行で表示
- pointBalance が指定された場合: ポイント残高をラベル横に表示

## スタイリング
- カード背景: #1A1A1A
- 選択中カード背景: #1A1A1A + ゴールド左ボーダー
- カード padding: 16px
- カード間 gap: 12px
- border-radius: 0

全4ファイルを完全なコードで出力してください。
```

### プロンプト 3-D: welthSidebar（ナビゲーション）

```
# タスク: welthSidebar LWC コンポーネント生成

## コンポーネント名: welthSidebar
## 配置先: force-app/main/default/lwc/welthSidebar/

## 役割
Experience Cloud 全ページで共通利用するサイドバーナビゲーション。
会員情報の表示・ページナビゲーション・ログアウトを担う。

## @api プロパティ
| プロパティ名 | 型 | 必須 | 説明 |
|------------|-----|------|------|
| currentPage | String | yes | 現在のページ識別子（'dashboard'/'restaurant'/'lounge'/'events'/'profile'） |
| memberName | String | no | 表示する会員名 |
| memberStatus | String | no | 会員ステータス（'Platinum'/'Gold'/'Silver'） |
| memberId | String | no | 会員ID表示用 |

## ナビゲーション項目
```javascript
const navItems = [
  { key: 'dashboard', label: 'ダッシュボード', icon: 'utility:home', url: '/s/' },
  { key: 'restaurant', label: 'レストラン予約', icon: 'utility:food_and_drink', url: '/s/restaurant' },
  { key: 'lounge', label: 'ラウンジ予約', icon: 'utility:lounge', url: '/s/lounge' },
  { key: 'events', label: 'イベント予約', icon: 'utility:event', url: '/s/events' },
  { key: 'profile', label: '会員情報', icon: 'utility:person_account', url: '/s/profile' },
];
```

## 処理内容
- [NavigationMixin](https://developer.salesforce.com/docs/component-library/bundle/lightning-navigation) を使ってページ遷移
- ログアウトは `lightning/navigation` の PageReference で `/secur/logout.jsp` へ
- currentPage と一致するナビ項目をアクティブスタイルに

## スタイリング
- サイドバー幅: 240px
- 背景: #141414
- アクティブ項目: ゴールド左ボーダー + ゴールドテキスト
- ロゴエリア高さ: 64px（"WELTH" テキスト + 区切り線）

## 発火するカスタムイベント
なし（NavigationMixin で直接遷移）

全4ファイルを完全なコードで出力してください。
```
