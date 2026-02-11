# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Building
- `npm run dev` - Development mode with webpack watch (use for development)
- `npm run dev2` - Development mode with esbuild watch (alternative build system)
- `npm run build` - Production build with webpack
- `npm run build2` - Production build with esbuild (runs TypeScript type check first)
- `npm run clean` - Remove built main.js file

### Code Quality
- `npm run format` - Format code with Biome linter/formatter

### Testing
- `npm test` - Run all tests with mocha
- Tests are located in `tests/` and `pro/tests/` directories
- Uses mocha framework with tsx for test execution

## Architecture Overview

### Two-Part Plugin Structure

This project has a split structure:
1. **Main plugin code** (`src/`) - Released under Apache License 2.0 (free version)
2. **PRO features** (`pro/`) - Released under PolyForm Strict License 1.0.0 (paid features)

The PRO features include:
- Smart conflict resolution (merge/duplicate options)
- Native API implementations for: Google Drive, Box, pCloud, Yandex Disk, Koofr, Azure Blob Storage, OneDrive Full Access
- These are accessed through `src/main.ts` via imports from `pro/src/`

### Service Architecture

Each cloud storage service implements the `FakeFs` interface (see `src/fsAll.ts`):
- Services: S3, WebDAV, Dropbox, OneDrive, OneDrive Full, Webdis, Google Drive, Box, pCloud, Yandex Disk, Koofr, Azure Blob Storage
- Service implementations in `src/` create a `FakeFs*` class
- PRO services in `pro/src/` create `FakeFs*` classes
- `fsGetter.ts` provides a factory function to instantiate the correct client based on configuration

### Sync Algorithm V3

The plugin uses a V3 sync algorithm that:
- Works without uploading extra metadata to remote (since v0.4.1)
- Maintains sync state locally in IndexedDB via `localdb.ts`
- Tracks file metadata (key, mtime, size) locally to determine sync status
- Supports incremental push/pull operations
- Handles conflicts (keep newer, keep larger)
- **Important**: All functions except `main.ts` should be pure - pass stateful info in parameters

### Vault Path Configuration

The plugin now supports customizable vault paths through new settings:
- `vaultBasePath?: string` - User-specified custom vault path
- `useCustomVaultPath?: boolean` - Whether to use custom path or default

### Data Flow

1. **Local Storage** (`localdb.ts`):
   - IndexedDB database "cloudsyncdb"
   - Stores: version, sync plans, vault random ID mappings, logger output, previous sync records, profiler results, file content history
   - Handles migration from deprecated tables (fileHistoryTbl, syncMappingTbl)

2. **Encryption** (`src/encryptOpenSSL.ts`, `src/encryptRClone.ts`):
   - Supports end-to-end encryption before upload
   - `encryptRClone` uses worker threads for performance
   - Worker code in `encryptRClone.worker.ts`

3. **Service Communication**:
   - Services connect to their respective APIs (AWS SDK for S3, webdav library for WebDAV, etc.)
   - All file/folder operations use consistent path representation: folders end with `/`

### Configuration Persistence

- Settings stored in Obsidian's plugin settings
- `configPersist.ts` handles conversion between "messy" (user-friendly) and "normal" (API-expected) config formats
- `baseTypes.ts` defines configuration interfaces for all services

### Code Design Principles

From `docs/code_design.md`:
1. Every function except `main.ts` should be pure - pass stateful information in parameters
2. `misc.ts` should not depend on any other written code
3. Each storage code should not depend on `sync.ts`
4. While writing sync codes, folders are always represented by a string ending with `/`

### Browser Environment Constraints

- The plugin runs in Obsidian's browser environment (Node.js APIs are polyfilled)
- Cannot run background tasks - auto-sync only works when Obsidian is open
- Uses polyfills for: `process`, `path`, `stream`, `crypto`, `url` (see `package.json` "browser" field)
- CORS configurations may be required for some services (documented in `docs/remote_services/*/README.md`)

### Internationalization

- Multi-language support via `src/i18n.ts`
- Language files in `src/langs/` and `pro/src/langs/`
- Language types defined in `baseTypes.ts` as `LangTypeAndAuto`

### Debugging

- See `docs/how_to_debug/README.md` for debugging methods
- Sync plans can be exported via `exportVaultSyncPlansToFiles()` in `debugMode.ts`
- Console output check methods in `docs/how_to_debug/check_console_output.md` (desktop) and `check_vconsole_output.md` (mobile)
- Performance profiling enabled in settings (see `profiler.ts`)

### PRO Features Integration

PRO features are conditionally enabled:
- Authentication handled in `pro/src/account.ts`
- Settings initialization from `pro/src/*.ts` files (e.g., `fsBox.ts`, `fsGoogleDrive.ts`)
- Smart conflict resolution in `pro/src/sync.ts`

## Important Notes

- **Never modify PRO code without understanding license implications** - PRO code is under PolyForm Strict License 1.0.0
- When adding new services, implement the `FakeFs` interface and register in `fsGetter.ts`
- Encryption code must handle both regular and worker contexts (RClone encryption)
- The plugin syncs only files not starting with `.` or `_` by default (hidden files/folders)
- Vault name must match across devices for sync to work (unless prefix is set in S3)
