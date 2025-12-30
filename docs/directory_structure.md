# ディレクトリ設計 (Directory Structure)

Feature-Sliced Design (FSD) の概念を取り入れつつ、Next.js App Router に最適化した構成です。機能（Feature）単位で凝集度を高め、将来的な機能拡張や分離に強い構造としています。

## 📁 ディレクトリツリー概観

```
src/
├── app/                    # Next.js App Router (Routing Layer)
│   ├── layout.tsx          # Root Layout (Providers, Global Styles)
│   ├── page.tsx            # LP / Dashboard Redirect
│   ├── manifest.ts         # PWA Manifest
│   ├── dashboard/          # Main App View (Grid)
│   │   └── page.tsx
│   └── settings/
│       └── page.tsx
│
├── e2e/                    # ★ E2E Tests (Playwright)
│   ├── habit-flow.spec.ts
│   └── persistence.spec.ts
│
├── features/               # ★ Domain Features (Business Logic & UI)
│   ├── habit/              # 「習慣」ドメイン
│   │   ├── components/     # UI Components (Presentational)
│   │   │   └── HabitRow.test.tsx # Component Test
│   │   ├── hooks/          # Domain Logic (Custom Hooks)
│   │   │   └── useHabit.test.ts  # Unit Test
│   │   ├── store/          # State Management (Zustand)
│   │   ├── db.ts           # Data Access (Dexie Table Definition)
│   │   ├── types.ts        # Domain Types
│   │   └── index.ts        # Public API (Exports to other layers)
│   │
│   ├── record/             # 「記録/チェック」ドメイン
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── db.ts
│   │   └── types.ts
│   │
│   └── calendar/           # 「カレンダー/日付」ドメイン
│       ├── components/     # Grid, Month Navigation
│       ├── hooks/
│       └── utils.ts
│
├── components/             # Shared UI Components (Atomic)
│   ├── ui/                 # shadcn/ui (Button, Dialog, etc.)
│   ├── layout/             # Header, Footer, BottomNav
│   └── icons/              # SVG Icons
│
├── lib/                    # Shared Infrastructure / Utilities
│   ├── db/                 # Dexie Instance Configuration
│   ├── date/               # date-fns wrapper / formatters
│   ├── hooks/              # Generic Hooks (useMediaQuery, etc.)
│   └── utils.ts            # cn() helper, etc.
│
├── styles/                 # Global Styles
│   └── globals.css         # Tailwind Directives
│
└── types/                  # Shared / Global Types
    └── index.d.ts
```

---

## 💡 設計のポイントと改善案

ご提示いただいた構成は非常に良く整理されており、MVP開発において十分に機能します。以下の点を補強・具体化しました。

### 1. `app/manifest.ts` (PWA対応)
PWAとして動作させるために必要な `manifest.json` を生成するためのファイルです。Next.js の Metadata API を利用してTypeScriptで記述することを推奨します。

### 2. `app/dashboard/` の分離
トップページ(`app/page.tsx`)は、未認証ユーザー向けのLP（またはリダイレクト）とし、実際のアプリ機能は `app/dashboard/` 配下に置く構成も一般的です。ただし、**今回は「即座に使える」ことが重要**なため、`app/page.tsx` を直接ダッシュボードとしても問題ありません。上記ツリーでは、将来的な拡張を見越して一応分離案を示しましたが、MVPでは直下でもOKです。

### 3. `features/*/index.ts` (Barrel File)
各特徴機能（Feature）フォルダに `index.ts` を置き、外部（`app` や他の `features`）から利用して良いコンポーネントや関数のみを `export` することで、カプセル化を強制できます。
例: `import { HabitList } from '@/features/habit'`

### 4. `lib/db/` vs `features/*/db.ts`
- `lib/db/index.ts`: Dexie のデータベースインスタンスそのものの初期化、バージョニング、マイグレーション定義を行います。
- `features/*/db.ts`: `lib/db` からインスタンスをインポートし、そのドメインに関連するテーブル操作（Repositoryパターン的な関数）のみを定義します。こうすることで、DB設定とクエリロジックを分離できます。

### 5. `components/ui` (shadcn/ui)
shadcn/ui を導入すると、自動的に `components/ui` 配下にボタンや入力フォームなどの汎用コンポーネントが生成されます。これらはドメインロジックを持たない「純粋なUI部品」として管理します。
