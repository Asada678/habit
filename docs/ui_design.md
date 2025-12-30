# 画面遷移・UI詳細設計 (ui_design.md)

「責めない・考えさせない」コンセプトを体現するためのUI設計です。
Next.js App Router 上のページ構成と、各画面の機能・コンポーネントを定義します。

## 📱 画面遷移図 (Sitemap)

シンプルさを保つため、階層は極力浅くします。

- **`/` (Root)**: メイン画面（ダッシュボード）。アプリの機能の9割はここに集約。
    - **Modal**: 習慣追加・編集 / 記録のメモ編集
- **`/settings`**: 設定画面。データ管理や表示設定。

---

## 🎨 デザインシステム概要 (shadcn/ui base)

- **Color Palette**:
    - `Primary`: 落ち着いたアクセントカラー (e.g., Slate or Indigo)。ビビッド過ぎない色。
    - `Background`: 真っ白すぎないオフホワイト / 深めのダークグレー。
    - `Status`:
        - Success: 穏やかな緑 (Pastel Green)
        - Inactive: 薄いグレー
- **Typography**: Inter (Google Fonts)
- **Animation**: Framer Motion
    - タップ時の軽快なSpringアニメーション
    - ページ遷移時のCrossFade

---

## 🖥 画面詳細

### 1. メイン画面 (`app/page.tsx` or `app/dashboard/page.tsx`)

アプリを開いて最初に表示される画面。ここだけで日々の操作が完結します。

#### **Layout Structure**
1.  **Header (Sticky)**:
    - 上段: 現在の年月 (e.g., "2024年 12月") + 設定アイコン
    - 下段: **習慣列ヘッダー** (各習慣のアイコンを横並びで固定表示)。
2.  **Scroll Area (Main Content)**:
    - **Date Rows**: 日付ごとの行リスト（縦スクロール）。
        - 左端: 日付 (e.g., "1", "2", "3"...) + 曜日
        - 右側: **習慣チェックボックス**を横並び配置。
        - **Highlight**: 「今日」の行が視覚的に強調される。過去の記録へは下にスクロール（または上にスクロール設定）。
3.  **Floating Action Button (FAB)**:
    - 「＋」ボタンで習慣追加。

#### **Components (`features/habit`, `features/record`)**
- `DateRow`: 1日分の行コンテナ。
- `HabitHeader`: 画面上部に固定される習慣アイコンの列。
- `DateLabel`: 左端の日付表示。「今日」の場合の色分け等のロジックを持つ。
- `CheckCell`: 各日付・各習慣の交点にあるチェックボタン。
    - **Tap**: チェック ON/OFF。
    - **Long Press**: メモ入力 (`NoteDialog`) への導線。

#### **Interactions**
- **縦スクロール**: 過去〜未来（月末）の日付をシームレスに閲覧。
- **横スクロール**: 習慣数が多い場合、行内のチェックボックスエリアだけ横スクロール（日付とヘッダーは固定推奨だが、MVPでは全体横スクロールでも可）。
- **1タップチェック**: レイアウトが変わっても変わらず最重要。
- **ロングプレスでメモ**: `checks.note` への入力。日付単位でメモを残す形にも相性が良い。

---

### 2. 習慣追加・編集モーダル (`HabitDialog`)

メイン画面の「＋ 新しい習慣」ボタン、または既存習慣の長押し/設定メニューから開きます。

#### **Items**
- **タイトル入力**: 必須。
- **アイコン選択**: 絵文字ピッカー等。
- **削除ボタン**: 編集時のみ表示。論理削除確認ダイアログを挟む。

---

### 3. 設定画面 (`app/settings/page.tsx`)

#### **Sections**
- **データ管理**:
    - 「すべてのデータを削除」（開発デバッグ用 / リセット用）
    - エクスポート / インポート（バックアップ用 JSON DL）
- **表示設定**:
    - ダークモード切り替え (System / Light / Dark)
- **アプリについて**:
    - バージョン情報
    - 利用規約 / プライバシーポリシーへのリンク

---

## 🧩 コンポーネント設計 (Components Strategy)

### `features/` への配置

- **`features/habit/components/`**
    - `HabitHeader`: 習慣アイコンを横並び表示するヘッダー。
    - `HabitForm`: 追加・編集フォーム。

- **`features/calendar/components/`**
    - `MonthNavigator`: 表示月の切り替え。
    - `DateRow`: 日付行のレイアウト。

- **`features/record/components/`**
    - `CheckButton`: `CheckCell` の実体。
    - `NoteDialog`: メモ入力用。

### 状態管理 (Zustand)

各画面は直接 Dexie を叩くのではなく、Zustand Store (`useHabitStore` など) を通じてデータを参照・更新します。Store内で非同期に Dexie を操作し、UIへの反映（Re-render）をトリガーします。
