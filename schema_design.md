# データベース・スキーマ設計 (schema_design.md)

Dexie.js (IndexedDB) を使用したローカルデータベースのスキーマ定義です。

## 📦 Database Name: `HabitAppDB`

バージョン管理を行い、将来的なマイグレーションに対応できるようにします。

## 🗃 Tables

### 1. `habits`
ユーザーが管理する「習慣」そのものの定義情報を格納します。

| Column Name  | Type               | Key   | Description                                         |
| :----------- | :----------------- | :---- | :-------------------------------------------------- |
| `id`         | `string` (UUID)    | PK    | 一意な識別子 (nanoid等で生成)                       |
| `title`      | `string`           |       | 習慣の名称 (例: "読書する")                         |
| `icon`       | `string`           |       | アイコン識別子 (emoji または icon key)              |
| `order`      | `number`           | Index | 並び順。ドラッグ&ドロップでの並べ替え用。           |
| `archivedAt` | `number` \| `null` | Index | アーカイブ日時（Unix Time）。`null`ならアクティブ。 |
| `createdAt`  | `number`           |       | 作成日時（Unix Time）                               |
| `updatedAt`  | `number`           |       | 更新日時（Unix Time）                               |

#### Dexie Definition
```typescript
habits: 'id, order, archivedAt'
```
※ `id` は主キー。`order` と `archivedAt` はクエリ（並び替えやフィルタリング）で使用するためインデックスを作成。

---

### 2. `checks`
習慣の実施記録（ログ）を格納します。1日1回、特定の習慣が「完了」されたデータの集合です。

| Column Name | Type               | Key   | Description                                                                      |
| :---------- | :----------------- | :---- | :------------------------------------------------------------------------------- |
| `id`        | `string` (UUID)    | PK    | 一意な識別子 (例: "habitId_dateString" とすれば重複防止も可だが、単純UUIDでも可) |
| `habitId`   | `string`           | Index | `habits.id` への参照 (Foreign Key的役割)                                         |
| `date`      | `string`           | Index | 実施日。`YYYY-MM-DD` 形式 (例: "2024-01-01")。これにより日付検索を高速化。       |
| `note`      | `string` \| `null` |       | **(Optional)** 任意のメモ。日記や振り返り用。UI上は必須としない。                |
| `createdAt` | `number`           |       | 記録日時（Unix Time）。実際にチェックした時刻。                                  |

#### Dexie Definition
```typescript
checks: 'id, habitId, date, [habitId+date]'
```
※ `[habitId+date]` の複合インデックスを作成することで、「ある習慣の特定の日付の記録」を高速に検索・特定できるようにします（重複チェック防止にも有効）。

---

## 🛠 Usage Guidelines

### 複合キーの活用
`checks` テーブルにおいて、`habitId` と `date` の組み合わせは論理的にユニークであるべきです。
Dexieでは `put` メソッドを使用し、ID生成ロジックを工夫するか、Hook側で重複チェックを行うことで整合性を保ちます。

### 論理削除 vs 物理削除
- **習慣 (`habits`)**: ユーザーが削除しても、過去の記録(`checks`)との整合性を保つため、基本的には `archivedAt` を入れた**論理削除**を推奨します。完全にデータを消したい場合のみ物理削除を行います（その場合 `checks` もカスケード削除が必要）。
- **記録 (`checks`)**: チェックを外した場合は、該当レコードを**物理削除**します。データ量削減のため。

### 将来の同期への備え (Sync Prep)
将来的にクラウド同期を行う際、`updatedAt` カラムを利用して「最終更新日時」を比較し、差分更新を行う戦略を取ります。そのため、全てのテーブルに `updatedAt` を持たせる、あるいは変更ログテーブルを別途用意する可能性がありますが、MVP段階ではシンプルさを優先します。
