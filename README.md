# Habit Tracker (PWA)

オフラインで動作する、ローカルファーストな習慣管理 PWA (Progressive Web App) です。Next.js と IndexedDB を使用して構築されており、サーバーとの通信を必要とせず、高速に動作します。

## 特徴 (Features)

- **Offline First**: IndexedDB (Dexie.js) を使用したローカルデータ永続化により、オフラインでも完全な機能を利用可能。
- **PWA Support**: モバイル端末のホーム画面に追加して、ネイティブアプリのように利用可能。
- **Month View Interface**: 縦スクロールで日付移動、横スクロールで習慣項目を確認できる使いやすいインターフェース。
- **Modern Tech Stack**: Next.js App Router, TypeScript, Tailwind CSS, Zustand, Biome を採用。

## 技術スタック (Tech Stack)

このプロジェクトは以下の技術を使用しています：

- **Framework**: [Next.js](https://nextjs.org) 16 (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org)
- **Styling**: [Tailwind CSS](https://tailwindcss.com) v4
- **UI Components**: [shadcn/ui](https://ui.shadcn.com) (Radix UI)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Database**: [Dexie.js](https://dexie.org) (IndexedDB wrapper)
- **PWA**: [Serwist](https://serwist.pages.dev)
- **Linter/Formatter**: [Biome](https://biomejs.dev)
- **Testing**: [Vitest](https://vitest.dev), [Playwright](https://playwright.dev)

## 開発環境のセットアップ (Getting Started)

### 前提条件

- Node.js (推奨バージョン: v20以上)
- pnpm (パッケージマネージャー)

### インストール

```bash
# リポジトリのクローン
git clone <repository-url>
cd habit

# 依存関係のインストール
pnpm install
```

### 開発サーバーの起動

```bash
pnpm dev
```
ブラウザで [http://localhost:3000](http://localhost:3000) を開いて確認できます。

## スクリプト (Scripts)

| コマンド                    | 説明                                 |
| --------------------------- | ------------------------------------ |
| `pnpm dev`                  | 開発サーバーを起動 (webpack有効)     |
| `pnpm build`                | 本番用ビルドを作成                   |
| `pnpm start`                | 本番サーバーを起動                   |
| `pnpm lint`                 | Biome を使用してリントを実行         |
| `pnpm format`               | Biome を使用してコードをフォーマット |
| `pnpm test`                 | Vitest でユニットテストを実行        |
| `pnpm exec playwright test` | Playwright で E2E テストを実行       |

## プロジェクト構造 (Project Structure)

推奨される構造設計に基づく主要ディレクトリです：

```
.
├── docs/             # ドキュメント (ロードマップ等)
├── e2e/              # Playwright E2E テスト
├── public/           # 静的アセット
├── src/
│   ├── app/          # Next.js App Router ページ
│   ├── components/   # 共通 UI コンポーネント (shadcn/ui含む)
│   ├── features/     # 機能ごとのモジュール (habit, record, calendar等)
│   ├── lib/          # ユーティリティ, DB設定, 型定義
│   └── styles/       # グローバルスタイル
└── ...
```

## ロードマップ (Roadmap)

現在の進行状況や将来の計画については [docs/roadmap.md](./docs/roadmap.md) を参照してください。
