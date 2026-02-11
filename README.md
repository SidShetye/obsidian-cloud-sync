# Cloud Sync

Cloud Sync is an unofficial synchronization plugin for Obsidian vaults.

It syncs files between your local vault and a remote storage backend, with optional end-to-end encryption.

## Disclaimer

- This is **not** the official Obsidian Sync.
- Always keep backups of your vault, you could lose data during sync errors
- You are responsible for your cloud provider costs and account security.
- This uses the Apache 2.0 licensed parts from remotely-save. I've modified some aspects
  I didn't like there.

## Supported Backends

- Amazon S3 and S3-compatible services
- Dropbox
- OneDrive Personal (including root-based folder sync)
- WebDAV
- Webdis
- Google Drive
- Box
- pCloud
- Yandex Disk
- Koofr
- Azure Blob Storage

Basically the same storage backends like [remotely-save](https://github.com/remotely-save/remotely-save). If you want some of the premium features, check it out.

## Key Features

- Desktop and mobile support
- Manual sync and scheduled auto sync
- Sync on save
- End-to-end encryption support
- Conflict detection and handling
- Skip rules for files/folders and large files

## Important Behavior

- By default, hidden paths (starting with `.` or `_`) are excluded.
- Vault names should match across devices when using default folder settings.
- Auto sync only runs while Obsidian is open.

## Install

1. Install from Obsidian Community Plugins (if published there for your build), or
2. Manually copy `main.js`, `manifest.json`, and `styles.css` into:
   `.obsidian/plugins/cloud-sync/`

Then enable the plugin in Obsidian settings.

## Basic Setup

1. Open `Settings -> Cloud Sync`.
2. Choose a backend.
3. Authenticate / enter remote credentials.
4. Optionally set encryption password.
5. Set remote base directory if needed.
6. Run a manual sync.

## Debugging

- See `docs/how_to_debug/README.md`.
- Performance profiling docs: `docs/check_performance/README.md`.

## Development

- `npm run dev` - webpack watch build
- `npm run dev2` - esbuild watch build
- `npm run build` - production webpack build
- `npm run build2` - production esbuild build
- `npm test` - run tests
- `npm run format` - format/lint with Biome

## License

See `LICENSE`.
