<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

# リポジトリガイドライン (AGENTS.md)

本プロジェクトは **Next.js (App Router)** と **IndexedDB (Dexie.js)** を用いた、Local-First な習慣化アプリ開発プロジェクトです。
AIエージェントおよび開発者は、以下のドキュメント構成とガイドラインに従って実装を進めてください。

## 📚 ドキュメント体系 (Documentation Map)

詳細な設計情報は個別のマークダウンファイルに定義されています。実装前に必ず参照してください。

- **要件・仕様**
    - [mvp.md](mvp.md): プロダクトのゴール、機能優先度 (P0/P1)、マネタイズ戦略。
    - [roadmap.md](roadmap.md): 開発フェーズ (Phase 1: MVP, Phase 2: Polish, Phase 3: Cloud)。

- **技術・設計**
    - [tech_selection.md](tech_selection.md): 技術スタック選定理由 (Next.js, Tailwind, Dexie, etc.)。
    - [directory_structure.md](directory_structure.md): Feature-Sliced Design ベースのディレクトリ構成ルール。
    - [schema_design.md](schema_design.md): `habits`, `checks` テーブル定義とインデックス戦略。
    - [ui_design.md](ui_design.md): 画面遷移、レイアウト（縦日付・横習慣）、UIコンポーネント定義。
    - [testing_guidelines.md](testing_guidelines.md): テスト戦略 (E2E: Playwright, Unit: Vitest)。

---

## 🏗️ Technical Context

### 技術スタック
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: Zustand
- **Database**: Dexie.js (IndexedDB wrapper)
- **Animation**: Framer Motion
- **Testing**: Vitest (Unit), Playwright (E2E)

### アーキテクチャ (Local-First)
- データは全てクライアントサイドの `IndexedDB` に保存されます。
- `features/*/api` や `server actions` は（MVPフェーズでは）使用しません。
- `features/*/db.ts` 経由でデータベースアクセスを行い、Zustand Store で状態を管理します。

---

## 📁 ディレクトリ/モジュール配置ルール

[directory_structure.md](directory_structure.md) に従います。

- **`src/app`**: ルーティングのみ。ロジックは書かない。
- **`src/features`**: ドメインロジックの主戦場。
    - `habit`: 習慣管理
    - `record`: チェック記録
    - `calendar`: 日付操作・表示
- **`src/components/ui`**: shadcn/ui 等の汎用 UI コンポーネント。

---

## ✅ 開発・テスト手順

### コマンド
- `pnpm dev`: 開発サーバー起動
- `pnpm test`: Unit/Component テスト (Vitest)
- `pnpm test:e2e`: E2E テスト (Playwright)

### テスト方針 ([testing_guidelines.md](testing_guidelines.md))
- **重要**: データの永続化（リロード後もデータが残るか）は E2E で必ず検証する。
- 複雑なロジック（日付計算、カスタムフック）は Unit Test でカバーする。

---

## ⚠️ 注意事項 (Constraints)

1.  **オフライン動作**: 常にオフラインで動作することを前提に実装してください。ネットワーク依存の fetch は行わないでください。
2.  **外部ライブラリ**: `package.json` にないライブラリを追加する場合は、ユーザーの許可を得てから行ってください。
3.  **UI/UX**: 「責めない・考えさせない」がテーマです。複雑な設定や過度な警告は避けてください。
