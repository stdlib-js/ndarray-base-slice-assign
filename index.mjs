// Copyright (c) 2024 The Stdlib Authors. License is Apache-2.0: http://www.apache.org/licenses/LICENSE-2.0
/// <reference types="./index.d.ts" />
import s from"https://cdn.jsdelivr.net/gh/stdlib-js/ndarray-base-assert-is-mostly-safe-data-type-cast@v0.2.0-esm/index.mjs";import t from"https://cdn.jsdelivr.net/gh/stdlib-js/ndarray-base-broadcast-array@v0.2.0-esm/index.mjs";import e from"https://cdn.jsdelivr.net/gh/stdlib-js/ndarray-base-assign@esm/index.mjs";import r from"https://cdn.jsdelivr.net/gh/stdlib-js/ndarray-base-slice@v0.2.0-esm/index.mjs";import a from"https://cdn.jsdelivr.net/gh/stdlib-js/ndarray-base-dtype@v0.2.0-esm/index.mjs";import d from"https://cdn.jsdelivr.net/gh/stdlib-js/ndarray-base-shape@v0.2.0-esm/index.mjs";import n from"https://cdn.jsdelivr.net/gh/stdlib-js/string-format@v0.1.1-esm/index.mjs";function i(i,m,o,p){var j,l,h;if(l=a(i),h=a(m),!s(l,h))throw new TypeError(n("invalid argument. Input array values cannot be safely cast to the output array data type. Data types: [%s, %s].",l,h));return j=r(m,o,p,!0),i=t(i,d(j,!0)),e([i,j]),m}export{i as default};
//# sourceMappingURL=index.mjs.map
