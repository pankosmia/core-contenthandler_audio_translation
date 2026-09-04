# pankosmia-audio_translation-muncher

`pankosmia-audio_translation-muncher` provides reusable AudioTranslation-flavored muncher components for the Pankosmia ecosystem.

This package contains a set of focused UI tools that can be integrated into Pankosmia clients when AudioTranslation editing or visualization capabilities are needed.

> **Note:** This package does not contain everything available inside `pankosmia/core-contenthandler_audio_translation`. It only exposes reusable components that may or may not be used by other Pankosmia clients.

## Components

### `AudioTranslationEditorMuncher`

A component that allows users to edit an AudioTranslation document.

It provides the editing interface required to create and modify AudioTranslation content.

---

### `AudioTranslationViewerMuncher`

A component that allows users to view an AudioTranslation document.

It is intended for read-only visualization use cases where editing capabilities are not required.

---

## Scope

This package contains only reusable AudioTranslation-related components.

Included:

- AudioTranslation editing components
- AudioTranslation viewing components

Not included:

- The complete `pankosmia/core-contenthandler_audio_translation` application
- Application-specific features
- Internal tools that are not intended for reuse

The goal of this package is to provide lightweight, reusable building blocks for AudioTranslation features across the Pankosmia ecosystem.

## Testing

To test the Muncher components locally:

1. Start the development server:

```bash
pnpm run dev
```

2. Navigate to:
   `/#/MuncherTest`

## Publishing

To publish this package to npm, use the following command:

```bash
pnpm run publish
```
