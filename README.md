# @sebastianspeitel/rollup-plugin-assets

🍣 A Rollup plugin to import non-javascript assets.

## Install

Using npm:

```console
npm install @sebastianspeitel/rollup-plugin-assets --save-dev
```

## Usage

### Path

Acces the path of an asset by importing `path` from the asset.

```ts
import { path } from "asset:./path/to/your/asset/logo.png";

console.log(path); // ./assets/logo-2d91e532.png
```

The path will be relative to the bundled file it is imported from;

The file will be bundled as any other asset so you can use other plugins to modify it.

When `path` is not imported or otherwise treeshaken by rollup, the asset will be omitted from the bundle.

### Source

Access the source of an asset by importing `source` from the asset.

```ts
import { source } from "asset:./path/to/your/asset.png";
```

The encoding of the imported string can be specified using the [`encoding`](#encoding) option and will default to `base64`.

## Options

### `encoding`

Type: `"ascii" | "utf8" | "utf-8" | "utf16le" | "ucs2" | "ucs-2" | "base64" | "latin1" | "binary" | "hex"`<br>
Default: `"base64"`

Encoding used when importing asset sources. [`Buffer.toString()`](https://nodejs.org/api/buffer.html#buffer_buf_tostring_encoding_start_end) is used for encoding.

### `exclude`

Type: `RegExp | string | string[]`<br>
Default: `null`

A [minimatch pattern](https://github.com/isaacs/minimatch), or array of patterns, which specifies the files in the build the plugin should _ignore_. By default no files are ignored.

### `include`

Type: `RegExp | string | string[]`<br>
Default: `/^asset:.*/`

A [minimatch pattern](https://github.com/isaacs/minimatch), or array of patterns, which specifies the files in the build the plugin should operate on. By default all files prefixed with `asset:` are targeted.

## Typscript

Include this file somewhere in your typescript project to get typing and autocomplete of your assets.

```ts
// asset.d.ts

declare module "asset:*" {
  export const path: string;
  export const source: string;
}
```
