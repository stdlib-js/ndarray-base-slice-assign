<!--

@license Apache-2.0

Copyright (c) 2023 The Stdlib Authors.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

-->


<details>
  <summary>
    About stdlib...
  </summary>
  <p>We believe in a future in which the web is a preferred environment for numerical computation. To help realize this future, we've built stdlib. stdlib is a standard library, with an emphasis on numerical and scientific computation, written in JavaScript (and C) for execution in browsers and in Node.js.</p>
  <p>The library is fully decomposable, being architected in such a way that you can swap out and mix and match APIs and functionality to cater to your exact preferences and use cases.</p>
  <p>When you use stdlib, you can be absolutely certain that you are using the most thorough, rigorous, well-written, studied, documented, tested, measured, and high-quality code out there.</p>
  <p>To join us in bringing numerical computing to the web, get started by checking us out on <a href="https://github.com/stdlib-js/stdlib">GitHub</a>, and please consider <a href="https://opencollective.com/stdlib">financially supporting stdlib</a>. We greatly appreciate your continued support!</p>
</details>

# sliceAssign

[![NPM version][npm-image]][npm-url] [![Build Status][test-image]][test-url] [![Coverage Status][coverage-image]][coverage-url] <!-- [![dependencies][dependencies-image]][dependencies-url] -->

> Assign element values from a broadcasted input `ndarray` to corresponding elements in an output `ndarray` view.

<!-- Section to include introductory text. Make sure to keep an empty line after the intro `section` element and another before the `/section` close. -->

<section class="intro">

</section>

<!-- /.intro -->

<!-- Package usage documentation. -->



<section class="usage">

## Usage

```javascript
import sliceAssign from 'https://cdn.jsdelivr.net/gh/stdlib-js/ndarray-base-slice-assign@deno/mod.js';
```

#### slice( x, y, slice, strict )

Assigns element values from a broadcasted input `ndarray` to corresponding elements in an output `ndarray` view.

```javascript
import Slice from 'https://cdn.jsdelivr.net/gh/stdlib-js/slice-ctor@deno/mod.js';
import MultiSlice from 'https://cdn.jsdelivr.net/gh/stdlib-js/slice-multi@deno/mod.js';
import ndarray from 'https://cdn.jsdelivr.net/gh/stdlib-js/ndarray-ctor@deno/mod.js';
import ndzeros from 'https://cdn.jsdelivr.net/gh/stdlib-js/ndarray-zeros@deno/mod.js';
import ndarray2array from 'https://cdn.jsdelivr.net/gh/stdlib-js/ndarray-to-array@deno/mod.js';

// Define an input array:
var buffer = [ 1.0, 2.0, 3.0, 4.0, 5.0, 6.0 ];
var shape = [ 3, 2 ];
var strides = [ 2, 1 ];
var offset = 0;

var x = ndarray( 'generic', buffer, shape, strides, offset, 'row-major' );
// returns <ndarray>

var sh = x.shape;
// returns [ 3, 2 ]

var arr = ndarray2array( x );
// returns [ [ 1.0, 2.0 ], [ 3.0, 4.0 ], [ 5.0, 6.0 ] ]

// Define an output array:
var y = ndzeros( [ 2, 3, 2 ], {
    'dtype': x.dtype
});

// Create a slice:
var s0 = null;
var s1 = new Slice( null, null, -1 );
var s2 = new Slice( null, null, -1 );
var s = new MultiSlice( s0, s1, s2 );
// returns <MultiSlice>

// Perform assignment:
var out = sliceAssign( x, y, s, false );
// returns <ndarray>

var bool = ( out === y );
// returns true

arr = ndarray2array( y );
// returns [ [ [ 6.0, 5.0 ], [ 4.0, 3.0 ], [ 2.0, 1.0 ] ], [ [ 6.0, 5.0 ], [ 4.0, 3.0 ], [ 2.0, 1.0 ] ] ]
```

The function accepts the following arguments:

-   **x**: input `ndarray`.
-   **y**: output `ndarray`.
-   **slice**: a [`MultiSlice`][@stdlib/slice/multi] instance specifying the output `ndarray` view.
-   **strict**: boolean indicating whether to enforce strict bounds checking.

</section>

<!-- /.usage -->

<!-- Package usage notes. Make sure to keep an empty line after the `section` element and another before the `/section` close. -->

<section class="notes">

## Notes

-   The input `ndarray` **must** be [broadcast compatible][@stdlib/ndarray/base/broadcast-shapes] with the output `ndarray` view.
-   The input `ndarray` must have a [data type][@stdlib/ndarray/dtypes] which can be [safely cast][@stdlib/ndarray/safe-casts] to the output `ndarray` data type. Floating-point data types (both real and complex) are allowed to downcast to a lower precision data type of the [same kind][@stdlib/ndarray/same-kind-casts] (e.g., element values from a `'float64'` input `ndarray` can be assigned to corresponding elements in a `'float32'` output `ndarray`).

</section>

<!-- /.notes -->

<!-- Package usage examples. -->

<section class="examples">

## Examples

<!-- eslint no-undef: "error" -->

<!-- eslint-disable new-cap -->

```javascript
import E from 'https://cdn.jsdelivr.net/gh/stdlib-js/slice-multi@deno/mod.js';
import scalar2ndarray from 'https://cdn.jsdelivr.net/gh/stdlib-js/ndarray-from-scalar@deno/mod.js';
import ndarray2array from 'https://cdn.jsdelivr.net/gh/stdlib-js/ndarray-to-array@deno/mod.js';
import ndzeros from 'https://cdn.jsdelivr.net/gh/stdlib-js/ndarray-zeros@deno/mod.js';
import slice from 'https://cdn.jsdelivr.net/gh/stdlib-js/ndarray-base-slice@deno/mod.js';
import sliceAssign from 'https://cdn.jsdelivr.net/gh/stdlib-js/ndarray-base-slice-assign@deno/mod.js';

// Alias `null` to allow for more compact indexing expressions:
var _ = null;

// Create an output ndarray:
var y = ndzeros( [ 3, 3, 3 ] );

// Update each matrix...
var s1 = E( 0, _, _ );
sliceAssign( scalar2ndarray( 100 ), y, s1, false );

var a1 = ndarray2array( slice( y, s1, false ) );
// returns [ [ 100, 100, 100 ], [ 100, 100, 100 ], [ 100, 100, 100 ] ]

var s2 = E( 1, _, _ );
sliceAssign( scalar2ndarray( 200 ), y, s2, false );

var a2 = ndarray2array( slice( y, s2, false ) );
// returns [ [ 200, 200, 200 ], [ 200, 200, 200 ], [ 200, 200, 200 ] ]

var s3 = E( 2, _, _ );
sliceAssign( scalar2ndarray( 300 ), y, s3, false );

var a3 = ndarray2array( slice( y, s3, false ) );
// returns [ [ 300, 300, 300 ], [ 300, 300, 300 ], [ 300, 300, 300 ] ]

// Update the second rows in each matrix:
var s4 = E( _, 1, _ );
sliceAssign( scalar2ndarray( 400 ), y, s4, false );

var a4 = ndarray2array( slice( y, s4, false ) );
// returns [ [ 400, 400, 400 ], [ 400, 400, 400 ], [ 400, 400, 400 ] ]

// Update the second columns in each matrix:
var s5 = E( _, _, 1 );
sliceAssign( scalar2ndarray( 500 ), y, s5, false );

var a5 = ndarray2array( slice( y, s5, false ) );
// returns [ [ 500, 500, 500 ], [ 500, 500, 500 ], [ 500, 500, 500 ] ]

// Return the contents of the entire ndarray:
var a6 = ndarray2array( y );
/* returns
  [
    [
      [ 100, 500, 100 ],
      [ 400, 500, 400 ],
      [ 100, 500, 100 ]
    ],
    [
      [ 200, 500, 200 ],
      [ 400, 500, 400 ],
      [ 200, 500, 200 ]
    ],
    [
      [ 300, 500, 300 ],
      [ 400, 500, 400 ],
      [ 300, 500, 300 ]
    ]
  ]
*/
```

</section>

<!-- /.examples -->

<!-- Section to include cited references. If references are included, add a horizontal rule *before* the section. Make sure to keep an empty line after the `section` element and another before the `/section` close. -->

<section class="references">

</section>

<!-- /.references -->

<!-- Section for related `stdlib` packages. Do not manually edit this section, as it is automatically populated. -->

<section class="related">

</section>

<!-- /.related -->

<!-- Section for all links. Make sure to keep an empty line after the `section` element and another before the `/section` close. -->


<section class="main-repo" >

* * *

## Notice

This package is part of [stdlib][stdlib], a standard library with an emphasis on numerical and scientific computing. The library provides a collection of robust, high performance libraries for mathematics, statistics, streams, utilities, and more.

For more information on the project, filing bug reports and feature requests, and guidance on how to develop [stdlib][stdlib], see the main project [repository][stdlib].

#### Community

[![Chat][chat-image]][chat-url]

---

## License

See [LICENSE][stdlib-license].


## Copyright

Copyright &copy; 2016-2023. The Stdlib [Authors][stdlib-authors].

</section>

<!-- /.stdlib -->

<!-- Section for all links. Make sure to keep an empty line after the `section` element and another before the `/section` close. -->

<section class="links">

[npm-image]: http://img.shields.io/npm/v/@stdlib/ndarray-base-slice-assign.svg
[npm-url]: https://npmjs.org/package/@stdlib/ndarray-base-slice-assign

[test-image]: https://github.com/stdlib-js/ndarray-base-slice-assign/actions/workflows/test.yml/badge.svg?branch=main
[test-url]: https://github.com/stdlib-js/ndarray-base-slice-assign/actions/workflows/test.yml?query=branch:main

[coverage-image]: https://img.shields.io/codecov/c/github/stdlib-js/ndarray-base-slice-assign/main.svg
[coverage-url]: https://codecov.io/github/stdlib-js/ndarray-base-slice-assign?branch=main

<!--

[dependencies-image]: https://img.shields.io/david/stdlib-js/ndarray-base-slice-assign.svg
[dependencies-url]: https://david-dm.org/stdlib-js/ndarray-base-slice-assign/main

-->

[chat-image]: https://img.shields.io/gitter/room/stdlib-js/stdlib.svg
[chat-url]: https://app.gitter.im/#/room/#stdlib-js_stdlib:gitter.im

[stdlib]: https://github.com/stdlib-js/stdlib

[stdlib-authors]: https://github.com/stdlib-js/stdlib/graphs/contributors

[umd]: https://github.com/umdjs/umd
[es-module]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules

[deno-url]: https://github.com/stdlib-js/ndarray-base-slice-assign/tree/deno
[umd-url]: https://github.com/stdlib-js/ndarray-base-slice-assign/tree/umd
[esm-url]: https://github.com/stdlib-js/ndarray-base-slice-assign/tree/esm
[branches-url]: https://github.com/stdlib-js/ndarray-base-slice-assign/blob/main/branches.md

[stdlib-license]: https://raw.githubusercontent.com/stdlib-js/ndarray-base-slice-assign/main/LICENSE

[@stdlib/slice/multi]: https://github.com/stdlib-js/stdlib/tree/deno

[@stdlib/ndarray/base/broadcast-shapes]: https://github.com/stdlib-js/stdlib/tree/deno

[@stdlib/ndarray/safe-casts]: https://github.com/stdlib-js/stdlib/tree/deno

[@stdlib/ndarray/same-kind-casts]: https://github.com/stdlib-js/stdlib/tree/deno

[@stdlib/ndarray/dtypes]: https://github.com/stdlib-js/stdlib/tree/deno

</section>

<!-- /.links -->
