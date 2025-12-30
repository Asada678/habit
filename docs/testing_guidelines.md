# テストガイドライン (Testing Guidelines)

本プロジェクトにおけるテスト戦略および各種テストの書き方に関するガイドラインです。
個人開発/MVPフェーズであることを考慮し、**「運用コストの低い、効果的なテスト」**にリソースを集中させます。

## 🎯 テスト戦略 (Testing Strategy)

### 1. E2E Tests (最高優先度 / Critical)
- **Tools**: Playwright
- **対象**: ユーザーの主要導線（Happy Path）。
- **理由**: フロントエンド、DB(IndexedDB)、状態管理が統合された状態で動作することを保証するため。特に「リロードしてもデータが残っているか（永続化）」は最重要確認事項です。
- **カバレッジ目標**: コア機能（習慣作成、チェック、削除、永続化）を100%カバーする。

### 2. Unit/Integration Tests (ロジックの保証)
- **Tools**: Vitest + React Testing Library
- **対象**:
    - 複雑なロジックを持つ Utility 関数 (e.g., date helpers)
    - カスタムフック (`useHabitStore` などのロジック部分)
    - 共通コンポーネント (`components/ui/*`)
- **非対象**: スタイリングのみの変更や、単純な表示コンポーネント。

---

## 🛠 技術スタック変更点

`tech_selection.md` に以下を追加・適用します。

| カテゴリ           | 選定技術                  | 理由                                                                                     |
| :----------------- | :------------------------ | :--------------------------------------------------------------------------------------- |
| **Test Runner**    | **Vitest**                | Viteベースで動作が高速。Next.js環境との親和性が高い。                                    |
| **Component Test** | **React Testing Library** | ユーザー視点（アクセシビリティ対応）でのDOMテストが可能。                                |
| **E2E**            | **Playwright**            | ブラウザ（特にMobile Viewport）での動作検証が容易。IndexedDBの永続化テストも書きやすい。 |

---

## 📂 ディレクトリ構成 (`directory_structure.md` 追記)

テストファイルは、対象コードの近くに置く **Colocation** スタイルを採用します。

```bash
src/
├── features/habit/
│   ├── hooks/
│   │   ├── useHabit.ts
│   │   └── useHabit.test.ts      # Unit Test
│   ├── components/
│   │   ├── HabitRow.tsx
│   │   └── HabitRow.test.tsx     # Component Test
│
└── e2e/                          # E2E Tests (Root Level)
    ├── habit-flow.spec.ts        # 習慣作成〜削除フロー
    └── persistence.spec.ts       # リロード・オフライン検証
```

---

## 📝 テスト実装ルール

### 1. Description の書き方
What（何をするか）ではなく **Behavior（どう振る舞うべきか）** を日本語で記述してください。

```typescript
// ❌ Bad
test('addHabit executes correctly', () => { ... })

// ✅ Good
test('習慣を追加すると、リストの末尾に追加され、IDが生成される', () => { ... })
```

### 2. E2Eテストの指針
基本的に **Mobile Viewport (iPhone 13/14 size)** で実行してください。
モバイルファーストデザインを確認するためです。

```typescript
// playwright.config.ts (example)
use: {
  ...devices['iPhone 14'],
},
```

### 3. テストデータ
`faker.js` 等は使わず、固定値（Fixtures）またはテスト内で明示した値を使用してください。再現性を確保するためです。
