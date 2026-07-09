# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.1] - 2026-07-08

### Added

- Landing page deployed to GitHub Pages.
- Prebuilt Docker images published to ghcr.io on release tags, with
  `docker-compose.ghcr.yaml` to run the stack without building.
- App screenshots in the README.

### Fixed

- Restored the missing `apps/fsrs-optimizer` component; the API Docker
  image could not build without it.
- Completed the English wire contract (`fonetica` → `phonetic` and
  related fields), fixing the production web build.
- Renamed runtime env vars to `OPENFLASHCARDS_*` and removed remaining
  legacy branding and untranslated UI strings.

## [0.1.0] - 2026-07-08

### Added

- Initial open-source release.
- FSRS spaced repetition scheduling.
- Text-to-speech support (Google Cloud, ElevenLabs, Piper).
- Markdown-formatted flashcards.
- Study sessions.
- Go API + React web UI.
- Docker Compose deployment.
