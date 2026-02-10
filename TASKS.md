# TASKS.md — Current State & Next Steps

## Completed Work (feature/add-claude-support branch)

### 1. Project Rename: `remotely-save` → `cloud-sync`
- **Status**: DONE
- manifest.json/manifest-beta.json: `id: "cloud-sync"`, `name: "Cloud Sync"`
- package.json: `name: "cloud-sync"`
- All constants renamed (`COMMAND_URI`, `COMMAND_CALLBACK*`, etc.)
- Class names: `CloudSyncPlugin`, `CloudSyncPluginSettings`, `CloudSyncSettingTab`
- Database: `cloudsyncdb`
- Icon names: `cloud-sync-sync-wait`, `cloud-sync-sync-running`, `cloud-sync-logs`
- i18n: All display text updated in en/zh_cn/zh_tw (both src/ and pro/src/)
- Build env vars: `CLOUDSYNC_WEBSITE`, `CLOUDSYNC_CLIENT_ID`
- Metadata files: `_cloud-sync-metadata-on-remote.json`, `_cloud-sync-metadata-on-remote.bin`
- Debug folder: `_debug_cloud_sync/`
- All source strings, comments, error messages updated

### 2. OneDrive: Full Drive Access (no longer AppFolder)
- **Status**: DONE
- OAuth scope: `Files.ReadWrite` (was `Files.ReadWrite.AppFolder`)
- API paths: all `approot` → `root`
- `fromDriveItemToEntity()`: simplified from 6+ localized regex patterns to simple string prefix matching with `/drive/root:/${remoteBaseDir}`
- Kept `/drive/items/` regex for that API response format

### 3. Reverted Custom Vault Path Feature
- **Status**: DONE
- Removed `vaultBasePath`/`useCustomVaultPath` from settings interface
- Removed custom `getVaultBasePath()` method from main.ts
- Removed vault path UI from settings.ts
- Removed i18n entries for custom vault path
- Deleted `FEATURE_CUSTOM_SAVE_LOCATION.md` and `PLAN.md`

## Verification Results
- `npm test`: 72/72 tests passing
- `grep -ri "RemotelySavePlugin" src/ pro/src/`: no matches
- `grep "approot" src/fsOnedrive.ts`: no matches
- `grep '"remotely-save"' src/`: no matches
- Build errors are **pre-existing** (not caused by our changes):
  - `node:url` scheme error from `aggregate-error` dependency
  - `node-diff3` missing module in pro code
  - TypeScript `Uint8Array`/`ArrayBuffer` type mismatches

## What's Next

### Immediate (before merge)
1. **Azure Portal Setup** — Manual step: register new app or update existing one:
   - Add redirect URI: `obsidian://cloud-sync-cb-onedrive`
   - Add API permission: `Files.ReadWrite` (delegated)
   - Remove: `Files.ReadWrite.AppFolder` if no longer needed
   - Set `ONEDRIVE_CLIENT_ID` env var at build time
2. **Fix pre-existing build errors** — The webpack build has errors unrelated to our changes:
   - `aggregate-error` uses `clean-stack` which imports `node:url` (not supported by webpack)
   - `node-diff3` module not found in pro code
   - TypeScript strict type issues with `Uint8Array`/`ArrayBuffer` conversions
3. **Drop `pro/` directory** — User indicated this is planned soon

### Follow-up tasks
4. **Update OneDrive settings UI text** — `settings_onedrive` in en.json still says "App Folder" — should say something like "OneDrive (Full Access)" since we now use `Files.ReadWrite`
5. **Update `settings_onedrive_folder` i18n** — Currently says "We will create and sync inside the folder /Apps/{{pluginID}}/{{remoteBaseDir}}" — with full drive access, the folder is at the root: `/{{remoteBaseDir}}`
6. **Dropbox folder text** — Similarly references `pluginID` which was `remotely-save`
7. **README updates** — docs/ directory has service-specific READMEs that may reference old names or AppFolder behavior
8. **GitHub Actions / CI** — If any CI config references the old plugin name
9. **styles.css** — Check for any CSS class names that reference `remotely-save`

## Key Files Modified
- `src/baseTypes.ts` — constants, settings interface
- `src/main.ts` — plugin class, icon names, protocol handlers
- `src/settings.ts` — settings tab class, UI text
- `src/fsOnedrive.ts` — OAuth scope, API paths, entity parsing
- `src/localdb.ts` — database name
- `src/importExport.ts` — URI parsing
- `src/metadataOnRemote.ts` — metadata file names
- `manifest.json`, `manifest-beta.json`, `package.json`
- `webpack.config.js`, `esbuild.config.mjs`
- `src/langs/*.json`, `pro/src/langs/*.json`
- `pro/src/baseTypesPro.ts` — pro constants
- Multiple `pro/src/*.ts` files — class name refs, error messages
- `tests/configPersist.test.ts` — settings type reference
- `CLAUDE.md` — project documentation
