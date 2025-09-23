# markdown-it-sanitize-html

[![Build and Test](https://github.com/mshibanami/markdown-it-sanitize-html/actions/workflows/build_test.yml/badge.svg)](https://github.com/mshibanami/markdown-it-sanitize-html/actions/workflows/build_test.yml) [![npm version](https://badge.fury.io/js/%40mshibanami-org%2Fmarkdown-it-sanitize-html.svg)](https://badge.fury.io/js/%40mshibanami-org%2Fmarkdown-it-sanitize-html) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A markdown-it plugin to sanitize HTML using [sanitize-html](https://github.com/apostrophecms/sanitize-html).

## Installation

```bash
npm install @mshibanami-org/markdown-it-sanitize-html
```

## Usage

JavaScript:

```js
const markdownIt = require('markdown-it');
const markdownItSanitizeHtml = require('@mshibanami-org/markdown-it-sanitize-html');

const md = markdownIt();
md.use(markdownItSanitizeHtml);

const markdown = 'Hello, <b onclick="alert(\'XSS\')">world</b>! <img src="x" onerror="alert(\'XSS\')">';
const html = md.render(markdown);

console.log(html);
// Output: <p>Hello, <b>world</b>! <img src="x"></p>
```

TypeScript:

```ts
import markdownIt from 'markdown-it';
import markdownItSanitizeHtml from '@mshibanami-org/markdown-it-sanitize-html';

const md = markdownIt();
md.use(markdownItSanitizeHtml);

const markdown = 'Hello, <b onclick="alert(\'XSS\')">world</b>! <img src="x" onerror="alert(\'XSS\')">';
const html = md.render(markdown);

console.log(html);
// Output: <p>Hello, <b>world</b>! <img src="x"></p>
```

## Options

You can pass options to sanitize-html during initialization.

```js
md.use(markdownItSanitizeHtml, {
  FORBID_TAGS: ['style']
});
```

See the [sanitize-html documentation](https://github.com/apostrophecms/sanitize-html) for the available options.

## License

[sanitize-html](https://github.com/apostrophecms/sanitize-html) -
[MIT License](https://github.com/apostrophecms/sanitize-html/blob/master/LICENSE)
Copyright (c) 2013, 2014, 2015 P'unk Avenue LLC

[markdown-it](https://github.com/markdown-it/markdown-it) - [MIT License](https://github.com/markdown-it/markdown-it/blob/master/LICENSE) © 2014 Vitaly Puzrin, Alex Kocharin.

markdown-it-sanitize-html - [MIT License](LICENSE) © 2025 Manabu Nakazawa
