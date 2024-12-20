# importer

Import JavaScript, CSS and text easily.

## Installation

```js
npm install -s @allnulled/importer
```

## Usage

### 1) Import from HTML:

```html
<script src="node_modules/@allnulled/importer.js"></script>
```

### 2) Signature of the API:

```js
class Importer {
    static async scriptSrc(src) {/*...*/}
    static async scriptSrcModule(src) {/*...*/}
    static async scriptAsync(url, context = {}) {/*...*/}
    static async linkStylesheet(href) {/*...*/}
    static async text(url) {/*...*/}
}
```

### 3) Call methods:

```js
await Importer.scriptSrc("test/scriptSrc.js");
await Importer.scriptSrcModule("test/scriptSrcModule.js");
await Importer.linkStylesheet("test/linkStylesheet.css");
const txt = await Importer.text("test/text.txt");
```

