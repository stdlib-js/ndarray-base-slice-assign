/**
* @license Apache-2.0
*
* Copyright (c) 2023 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var isSafeCast = require( '@stdlib/ndarray-base-assert-is-safe-data-type-cast' );
var isSameKindCast = require( '@stdlib/ndarray-base-assert-is-same-kind-data-type-cast' );
var isFloatingPointDataType = require( '@stdlib/ndarray-base-assert-is-floating-point-data-type' );
var isComplexDataType = require( '@stdlib/ndarray-base-assert-is-complex-floating-point-data-type' );
var isRealDataType = require( '@stdlib/ndarray-base-assert-is-real-data-type' );
var broadcast = require( '@stdlib/ndarray-base-broadcast-array' );
var unary = require( '@stdlib/ndarray-base-unary' ); // TODO: replace with `@stdlib/ndarray/base/assign` and add native add-on support
var identity = require( '@stdlib/utils-identity-function' ); // TODO: remove once use `@stdlib/ndarray/base/assign`
var castReturn = require( '@stdlib/complex-base-cast-return' );
var complexCtors = require( '@stdlib/complex-ctors' );
var slice = require( '@stdlib/ndarray-base-slice' );
var format = require( '@stdlib/error-tools-fmtprodmsg' );


// MAIN //

/**
* Assigns element values from a broadcasted input ndarray to corresponding elements in an output ndarray view.
*
* @param {ndarray} x - input array
* @param {ndarray} y - output array
* @param {MultiSlice} s - multi-slice object for the output array
* @param {boolean} strict - boolean indicating whether to enforce strict bounds checking
* @throws {RangeError} number of slice dimensions must match the number of array dimensions
* @throws {RangeError} slice exceeds array bounds
* @throws {Error} input array must be broadcast compatible with an output array view
* @throws {TypeError} input array cannot be safely cast to the output array data type
* @returns {ndarray} output array
*
* @example
* var Slice = require( '@stdlib/slice-ctor' );
* var MultiSlice = require( '@stdlib/slice-multi' );
* var ndarray = require( '@stdlib/ndarray-ctor' );
* var ndzeros = require( '@stdlib/ndarray-zeros' );
* var ndarray2array = require( '@stdlib/ndarray-to-array' );
*
* // Define an input array:
* var buffer = [ 1.0, 2.0, 3.0, 4.0, 5.0, 6.0 ];
* var shape = [ 3, 2 ];
* var strides = [ 2, 1 ];
* var offset = 0;
*
* var x = ndarray( 'generic', buffer, shape, strides, offset, 'row-major' );
* // returns <ndarray>
*
* var sh = x.shape;
* // returns [ 3, 2 ]
*
* var arr = ndarray2array( x );
* // returns [ [ 1.0, 2.0 ], [ 3.0, 4.0 ], [ 5.0, 6.0 ] ]
*
* // Define an output array:
* var y = ndzeros( [ 2, 3, 2 ], {
*     'dtype': x.dtype
* });
*
* // Create a slice:
* var s0 = null;
* var s1 = new Slice( null, null, -1 );
* var s2 = new Slice( null, null, -1 );
* var s = new MultiSlice( s0, s1, s2 );
* // returns <MultiSlice>
*
* // Perform assignment:
* var out = sliceAssign( x, y, s, false );
* // returns <ndarray>
*
* var bool = ( out === y );
* // returns true
*
* arr = ndarray2array( y );
* // returns [ [ [ 6.0, 5.0 ], [ 4.0, 3.0 ], [ 2.0, 1.0 ] ], [ [ 6.0, 5.0 ], [ 4.0, 3.0 ], [ 2.0, 1.0 ] ] ]
*/
function sliceAssign( x, y, s, strict ) {
	var view;
	var fcn;
	var xdt;
	var ydt;

	xdt = x.dtype;
	ydt = y.dtype;

	// Safe casts are always allowed...
	if ( isSafeCast( xdt, ydt ) ) {
		// Check for real-to-complex conversion...
		if ( isRealDataType( xdt ) && isComplexDataType( ydt ) ) {
			// Need to cast a real number to a complex number:
			fcn = castReturn( identity, 1, complexCtors( ydt ) );
		} else {
			// Should only be real->real and complex->complex:
			fcn = identity;
		}
	}
	// Allow same kind casts (i.e., downcasts) only when the output data type is floating-point...
	else if ( isFloatingPointDataType( ydt ) && isSameKindCast( xdt, ydt ) ) {
		// At this point, we know that the input data type and output data type are of the same "kind" (e.g., real->real and complex->complex), and, thus, we don't need to perform any special conversions:
		fcn = identity;
	} else {
		throw new TypeError( format( 'invalid argument. Input array values cannot be safely cast to the output array data type. Data types: [%s, %s].', xdt, ydt ) );
	}
	// Resolve a writable output array view:
	view = slice( y, s, strict, true );

	// Broadcast the input array:
	x = broadcast( x, view.shape );

	// Set elements from `x` in `y`:
	unary( [ x, view ], fcn );

	// Return the original output array:
	return y;
}


// EXPORTS //

module.exports = sliceAssign;
