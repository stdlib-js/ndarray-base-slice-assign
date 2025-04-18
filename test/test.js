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

/* eslint-disable object-curly-newline, max-len */

'use strict';

// MODULES //

var tape = require( 'tape' );
var isndarrayLike = require( '@stdlib/assert-is-ndarray-like' );
var isComplexDataType = require( '@stdlib/ndarray-base-assert-is-complex-floating-point-data-type' );
var MultiSlice = require( '@stdlib/slice-multi' );
var Slice = require( '@stdlib/slice-ctor' );
var Complex64 = require( '@stdlib/complex-float32-ctor' );
var Complex128 = require( '@stdlib/complex-float64-ctor' );
var real = require( '@stdlib/complex-float64-real' );
var imag = require( '@stdlib/complex-float64-imag' );
var zeroTo = require( '@stdlib/array-base-zero-to' );
var azeros = require( '@stdlib/array-zeros' );
var typedarray = require( '@stdlib/array-typed' );
var array = require( '@stdlib/ndarray-array' );
var zeros = require( '@stdlib/ndarray-zeros' );
var numel = require( '@stdlib/ndarray-base-numel' );
var scalar2ndarray = require( '@stdlib/ndarray-base-from-scalar' );
var ndarray2array = require( '@stdlib/ndarray-to-array' );
var baseCtor = require( '@stdlib/ndarray-base-ctor' );
var ctor = require( '@stdlib/ndarray-ctor' );
var sliceAssign = require( './../lib' );


// TESTS //

tape( 'main export is a function', function test( t ) {
	t.ok( true, __filename );
	t.strictEqual( typeof sliceAssign, 'function', 'main export is a function' );
	t.end();
});

tape( 'the function throws an error if the number of slice dimensions does not match the number of output array dimensions (strict=false)', function test( t ) {
	var values;
	var slices;
	var x;
	var i;

	x = zeros( [] );

	values = [
		zeros( [] ),
		zeros( [ 1 ] ),
		zeros( [ 1, 1 ] ),
		zeros( [ 1, 1, 1 ] ),
		zeros( [ 1, 1, 1, 1 ] )
	];
	slices = [
		new MultiSlice( null ),
		new MultiSlice( null, null, null ),
		new MultiSlice( null ),
		new MultiSlice( null, null ),
		new MultiSlice( null, null, null )
	];
	for ( i = 0; i < values.length; i++ ) {
		t.throws( badValues( values[ i ], slices[ i ] ), RangeError, 'throws an error when provided ' + slices[ i ].toString() );
	}
	t.end();

	function badValues( y, s ) {
		return function badValues() {
			sliceAssign( x, y, s, false );
		};
	}
});

tape( 'the function throws an error if the number of slice dimensions does not match the number of output array dimensions (strict=true)', function test( t ) {
	var values;
	var slices;
	var x;
	var i;

	x = zeros( [] );

	values = [
		zeros( [] ),
		zeros( [ 1 ] ),
		zeros( [ 1, 1 ] ),
		zeros( [ 1, 1, 1 ] ),
		zeros( [ 1, 1, 1, 1 ] )
	];
	slices = [
		new MultiSlice( null ),
		new MultiSlice( null, null, null ),
		new MultiSlice( null ),
		new MultiSlice( null, null ),
		new MultiSlice( null, null, null )
	];
	for ( i = 0; i < values.length; i++ ) {
		t.throws( badValues( values[ i ], slices[ i ] ), RangeError, 'throws an error when provided ' + slices[ i ].toString() );
	}
	t.end();

	function badValues( y, s ) {
		return function badValues() {
			sliceAssign( x, y, s, true );
		};
	}
});

tape( 'in strict mode, the function throws an error when a slice exceeds output array bounds', function test( t ) {
	var values;
	var slices;
	var x;
	var s;
	var i;

	x = zeros( [] );

	values = [
		zeros( [ 1 ] ),
		zeros( [ 1, 1 ] ),
		zeros( [ 1, 1, 1 ] ),
		zeros( [ 1, 1, 1, 1 ] )
	];

	s = new Slice( 10, 20, 1 );
	slices = [
		new MultiSlice( 10 ),
		new MultiSlice( null, s ),
		new MultiSlice( s, null, null ),
		new MultiSlice( s, s, null, null )
	];
	for ( i = 0; i < values.length; i++ ) {
		t.throws( badValues( values[ i ], slices[ i ] ), RangeError, 'throws an error when provided ' + slices[ i ].toString() );
	}
	t.end();

	function badValues( y, s ) {
		return function badValues() {
			sliceAssign( x, y, s, true );
		};
	}
});

tape( 'in non-strict mode, the function does not set element values when a slice exceeds output array bounds', function test( t ) {
	var actual;
	var values;
	var slices;
	var z;
	var x;
	var s;
	var v;
	var i;

	x = scalar2ndarray( 3, 'uint8', 'row-major' );

	values = [
		zeros( [ 1 ], { 'dtype': 'float64' } ),
		zeros( [ 1, 1 ], { 'dtype': 'float32' } ),
		zeros( [ 1, 1, 1 ], { 'dtype': 'int32' } ),
		zeros( [ 1, 1, 1, 1 ], { 'dtype': 'uint32' } ),
		zeros( [ 1, 1, 1, 1, 1 ], { 'dtype': 'complex128' } )
	];

	s = new Slice( 10, 20, 1 );
	slices = [
		new MultiSlice( 10 ),
		new MultiSlice( null, s ),
		new MultiSlice( s, null, null ),
		new MultiSlice( s, s, null, null ),
		new MultiSlice( 0, null, null, null, 10 )
	];
	for ( i = 0; i < values.length; i++ ) {
		v = values[ i ];
		actual = sliceAssign( x, v, slices[ i ], false );
		t.strictEqual( isndarrayLike( actual ), true, 'returns expected value' );
		t.strictEqual( numel( actual.shape ), numel( v.shape ), 'returns expected value' );
		t.strictEqual( actual.dtype, v.dtype, 'returns expected value' );

		z = actual.iget( 0 );
		if ( v.dtype === 'complex128' ) {
			t.strictEqual( real( z ), 0, 'returns expected value' );
			t.strictEqual( imag( z ), 0, 'returns expected value' );
		} else {
			t.strictEqual( z, 0, 'returns expected value' );
		}
	}
	t.end();
});

tape( 'the function throws an error if provided an input array which is not broadcast compatible with an output array view', function test( t ) {
	var values;
	var slices;
	var x;
	var i;

	x = [
		zeros( [ 10 ] ),
		zeros( [ 10, 10 ] ),
		zeros( [ 10, 10, 10 ] ),
		zeros( [ 10, 10 ] )
	];

	values = [
		zeros( [ 2 ] ),
		zeros( [ 2, 2 ] ),
		zeros( [ 2, 2, 2 ] ),
		zeros( [ 2, 2, 2, 2 ] )
	];

	slices = [
		new MultiSlice( null ),
		new MultiSlice( null, null ),
		new MultiSlice( null, null, null ),
		new MultiSlice( 0, 0, null, null )
	];
	for ( i = 0; i < values.length; i++ ) {
		t.throws( badValues( x[ i ], values[ i ], slices[ i ] ), Error, 'throws an error when provided ' + slices[ i ].toString() );
	}
	t.end();

	function badValues( x, y, s ) {
		return function badValues() {
			sliceAssign( x, y, s, true );
		};
	}
});

tape( 'the function throws an error if provided an input array having a data type which cannot be safely cast to the data type of the output array', function test( t ) {
	var values;
	var slices;
	var x;
	var i;

	x = [
		zeros( [ 2 ], { 'dtype': 'complex128' } ),
		zeros( [ 2, 2 ], { 'dtype': 'int32' } ),
		zeros( [ 2, 2, 2 ], { 'dtype': 'int32' } ),
		zeros( [ 2, 2, 2, 2 ], { 'dtype': 'uint8' } )
	];

	values = [
		zeros( [ 2 ], { 'dtype': 'float64' } ),
		zeros( [ 2, 2 ], { 'dtype': 'float32' } ),
		zeros( [ 2, 2, 2 ], { 'dtype': 'uint32' } ),
		zeros( [ 2, 2, 2, 2 ], { 'dtype': 'int8' } )
	];

	slices = [
		new MultiSlice( null ),
		new MultiSlice( null, null ),
		new MultiSlice( null, null, null ),
		new MultiSlice( null, null, null, null )
	];
	for ( i = 0; i < values.length; i++ ) {
		t.throws( badValues( x[ i ], values[ i ], slices[ i ] ), TypeError, 'throws an error when provided ' + slices[ i ].toString() );
	}
	t.end();

	function badValues( x, y, s ) {
		return function badValues() {
			sliceAssign( x, y, s, true );
		};
	}
});

tape( 'the function supports assigning to a zero-dimensional array view (base)', function test( t ) {
	var actual;
	var x;
	var y;
	var s;

	x = scalar2ndarray( 3.14, 'float64', 'row-major' );
	y = scalar2ndarray( 0.0, x.dtype, x.order );
	s = new MultiSlice();

	actual = sliceAssign( x, y, s, true );
	t.strictEqual( isndarrayLike( actual ), true, 'returns expected value' );
	t.strictEqual( actual, y, 'returns expected value' );
	t.strictEqual( actual.get(), 3.14, 'returns expected value' );

	t.end();
});

tape( 'the function supports assigning to a zero-dimensional array view (base, offset)', function test( t ) {
	var actual;
	var x;
	var y;
	var s;

	x = new baseCtor( 'float64', typedarray( zeroTo( 4 ), 'float64' ), [], [ 0 ], 3, 'row-major' );
	y = new baseCtor( x.dtype, typedarray( zeroTo( 10 ), x.dtype ), [], [ 0 ], 7, x.order );
	s = new MultiSlice();

	actual = sliceAssign( x, y, s, true );
	t.strictEqual( isndarrayLike( actual ), true, 'returns expected value' );
	t.strictEqual( actual, y, 'returns expected value' );
	t.strictEqual( actual.get(), 3, 'returns expected value' );

	t.end();
});

tape( 'the function supports assigning to a zero-dimensional array view (non-base, offset)', function test( t ) {
	var actual;
	var x;
	var y;
	var s;

	x = new ctor( 'float64', typedarray( zeroTo( 4 ), 'float64' ), [], [ 0 ], 3, 'row-major' );
	y = new ctor( x.dtype, typedarray( zeroTo( 10 ), x.dtype ), [], [ 0 ], 7, x.order );
	s = new MultiSlice();

	actual = sliceAssign( x, y, s, true );
	t.strictEqual( isndarrayLike( actual ), true, 'returns expected value' );
	t.strictEqual( actual, y, 'returns expected value' );
	t.strictEqual( actual.get(), 3, 'returns expected value' );

	t.end();
});

tape( 'if all output array dimensions are reduced, the function supports assigning to a zero-dimensional array view (non-base)', function test( t ) {
	var expected;
	var actual;
	var values;
	var slices;
	var idx;
	var x;
	var y;
	var s;
	var i;

	x = [
		scalar2ndarray( 100, 'float64', 'row-major' ),
		scalar2ndarray( 50, 'float32', 'row-major' ),
		scalar2ndarray( 200, 'int32', 'row-major' ),
		scalar2ndarray( 300, 'uint32', 'row-major' )
	];

	values = [
		array( typedarray( zeroTo( 4 ), 'float64' ), {
			'shape': [ 2, 2 ],
			'dtype': 'float64'
		}),
		array( typedarray( zeroTo( 8 ), 'float32' ), {
			'shape': [ 2, 2, 2 ],
			'dtype': 'float32'
		}),
		array( typedarray( zeroTo( 2 ), 'int32' ), {
			'shape': [ 2 ],
			'dtype': 'int32'
		}),
		array( typedarray( zeroTo( 16 ), 'uint32' ), {
			'shape': [ 2, 2, 2, 2 ],
			'dtype': 'uint32'
		})
	];
	idx = [
		[ 0, 1 ],
		[ 0, 1, 0 ],
		[ 0 ],
		[ 0, 1, 0, 1 ]
	];
	slices = [
		MultiSlice.apply( null, idx[ 0 ] ),
		MultiSlice.apply( null, idx[ 1 ] ),
		MultiSlice.apply( null, idx[ 2 ] ),
		MultiSlice.apply( null, idx[ 3 ] )
	];
	expected = [
		100,
		50,
		200,
		300
	];
	for ( i = 0; i < values.length; i++ ) {
		y = values[ i ];
		s = slices[ i ];
		actual = sliceAssign( x[ i ], y, s, true );
		t.strictEqual( isndarrayLike( actual ), true, 'returns expected value' );
		t.strictEqual( actual, y, 'returns expected value' );
		t.strictEqual( actual.get.apply( actual, idx[ i ] ), expected[ i ], 'returns expected value' );
	}
	t.end();
});

tape( 'if all output array dimensions are reduced, the function supports assigning to a zero-dimensional array view (non-base, offset)', function test( t ) {
	var actual;
	var buf;
	var ord;
	var sh;
	var st;
	var dt;
	var o;
	var x;
	var y;
	var s;

	ord = 'row-major';
	dt = 'float64';
	buf = typedarray( zeroTo( 30 ), dt );

	sh = [ 6 ];
	st = [ 2 ];
	o = 5;
	y = new ctor( dt, buf, sh, st, o, ord );
	s = new MultiSlice( 1 );

	x = scalar2ndarray( 3.14, dt, ord );

	actual = sliceAssign( x, y, s, true );
	t.strictEqual( isndarrayLike( actual ), true, 'returns expected value' );
	t.strictEqual( actual, y, 'returns expected value' );
	t.strictEqual( actual.get( 1 ), 3.14, 'returns expected value' );

	sh = [ 3, 3 ];
	st = [ 6, 2 ];
	o = 10;
	y = new ctor( dt, buf, sh, st, o, ord );
	s = new MultiSlice( 0, 1 );

	x = scalar2ndarray( 6.28, dt, ord );

	actual = sliceAssign( x, y, s, true );
	t.strictEqual( isndarrayLike( actual ), true, 'returns expected value' );
	t.strictEqual( actual, y, 'returns expected value' );
	t.strictEqual( actual.get( 0, 1 ), 6.28, 'returns expected value' );

	sh = [ 2, 2, 3 ];
	st = [ 12, 6, 2 ];
	o = 3;
	y = new ctor( dt, buf, sh, st, o, ord );
	s = new MultiSlice( 1, 1, 2 );

	x = scalar2ndarray( 9.52, dt, ord );

	actual = sliceAssign( x, y, s, true );
	t.strictEqual( isndarrayLike( actual ), true, 'returns expected value' );
	t.strictEqual( actual, y, 'returns expected value' );
	t.strictEqual( actual.get( 1, 1, 2 ), 9.52, 'returns expected value' );

	sh = [ 2, 2, 3 ];
	st = [ -12, -6, -2 ];
	o = 25;
	y = new ctor( dt, buf, sh, st, o, ord );
	s = new MultiSlice( 1, 1, 2 );

	x = scalar2ndarray( -1.0, dt, ord );

	actual = sliceAssign( x, y, s, true );
	t.strictEqual( isndarrayLike( actual ), true, 'returns expected value' );
	t.strictEqual( actual, y, 'returns expected value' );
	t.strictEqual( actual.get( 1, 1, 2 ), -1.0, 'returns expected value' );

	t.end();
});

tape( 'the function assigns input array element values to corresponding elements in an output array view (ndims=1)', function test( t ) {
	var expected;
	var actual;
	var xbuf;
	var ybuf;
	var x;
	var y;
	var s;

	xbuf = typedarray( zeroTo( 30 ), 'float64' );

	// Full slice:
	x = new ctor( 'float64', xbuf, [ 6 ], [ 2 ], 4, 'row-major' ); // [ 4, 6, 8, 10, 12, 14 ]

	ybuf = azeros( 30, x.dtype );
	y = new ctor( x.dtype, ybuf, [ 6 ], [ 2 ], 4, 'row-major' );

	s = new MultiSlice( null );
	actual = sliceAssign( x, y, s, true );

	t.strictEqual( isndarrayLike( actual ), true, 'returns expected value' );
	t.strictEqual( actual, y, 'returns expected value' );

	expected = [ 4, 6, 8, 10, 12, 14 ];
	actual = ndarray2array( actual );
	t.deepEqual( actual, expected, 'returns expected value' );

	// Reverse order and skip every other element:
	x = new ctor( 'float64', xbuf, [ 3 ], [ 4 ], 6, 'row-major' ); // [ 6, 10, 14 ]

	ybuf = azeros( 30, x.dtype );
	y = new ctor( x.dtype, ybuf, [ 6 ], [ 2 ], 4, 'row-major' );

	s = new MultiSlice( new Slice( null, null, -2 ) );
	actual = sliceAssign( x, y, s, true );

	t.strictEqual( isndarrayLike( actual ), true, 'returns expected value' );
	t.strictEqual( actual, y, 'returns expected value' );

	expected = [ 0, 14, 0, 10, 0, 6 ];
	actual = ndarray2array( actual );
	t.deepEqual( actual, expected, 'returns expected value' );

	// Reverse order and skip every other element, starting from second-to-last element:
	x = new ctor( 'float64', xbuf, [ 3 ], [ 4 ], 4, 'row-major' ); // [ 4, 8, 12 ]

	ybuf = azeros( 30, x.dtype );
	y = new ctor( x.dtype, ybuf, [ 6 ], [ 2 ], 4, 'row-major' );

	s = new MultiSlice( new Slice( 4, null, -2 ) );
	actual = sliceAssign( x, y, s, true );

	t.strictEqual( isndarrayLike( actual ), true, 'returns expected value' );
	t.strictEqual( actual, y, 'returns expected value' );

	expected = [ 12, 0, 8, 0, 4, 0 ];
	actual = ndarray2array( actual );
	t.deepEqual( actual, expected, 'returns expected value' );

	// Skip every three elements, starting from second element:
	x = new ctor( 'float64', xbuf, [ 2 ], [ 6 ], 6, 'row-major' ); // [ 6, 12 ]

	ybuf = azeros( 30, x.dtype );
	y = new ctor( x.dtype, ybuf, [ 6 ], [ 2 ], 4, 'row-major' );

	s = new MultiSlice( new Slice( 1, null, 3 ) );
	actual = sliceAssign( x, y, s, true );

	t.strictEqual( isndarrayLike( actual ), true, 'returns expected value' );
	t.strictEqual( actual, y, 'returns expected value' );

	expected = [ 0, 6, 0, 0, 12, 0 ];
	actual = ndarray2array( actual );
	t.deepEqual( actual, expected, 'returns expected value' );

	// Set a sub-array:
	x = new ctor( 'float64', xbuf, [ 3 ], [ 2 ], 8, 'row-major' ); // [ 8, 10, 12 ]

	ybuf = azeros( 30, x.dtype );
	y = new ctor( x.dtype, ybuf, [ 6 ], [ 2 ], 4, 'row-major' );

	s = new MultiSlice( new Slice( 4, 1, -1 ) );
	actual = sliceAssign( x, y, s, true );

	t.strictEqual( isndarrayLike( actual ), true, 'returns expected value' );
	t.strictEqual( actual, y, 'returns expected value' );

	expected = [ 0, 0, 12, 10, 8, 0 ];
	actual = ndarray2array( actual );
	t.deepEqual( actual, expected, 'returns expected value' );

	t.end();
});

tape( 'the function assigns input array element values to corresponding elements in an output array view (ndims=2)', function test( t ) {
	var expected;
	var actual;
	var xbuf;
	var ybuf;
	var s0;
	var s1;
	var x;
	var y;
	var s;

	xbuf = typedarray( zeroTo( 30 ), 'float64' );

	// Full slice:
	x = new ctor( 'float64', xbuf, [ 4, 3 ], [ 6, 2 ], 4, 'row-major' ); // [ [ 4, 6, 8 ], [ 10, 12, 14 ], [ 16, 18, 20 ], [ 22, 24, 26 ] ]

	ybuf = azeros( 30, x.dtype );
	y = new ctor( x.dtype, ybuf, [ 4, 3 ], [ 6, 2 ], 4, 'row-major' );

	s = new MultiSlice( null, null );
	actual = sliceAssign( x, y, s, true );

	t.strictEqual( isndarrayLike( actual ), true, 'returns expected value' );
	t.strictEqual( actual, y, 'returns expected value' );

	expected = [
		[ 4, 6, 8 ],
		[ 10, 12, 14 ],
		[ 16, 18, 20 ],
		[ 22, 24, 26 ]
	];
	actual = ndarray2array( actual );
	t.deepEqual( actual, expected, 'returns expected value' );

	// Reverse order and skip every other element:
	x = new ctor( 'float64', xbuf, [ 2, 2 ], [ 12, 4 ], 10, 'row-major' ); // [ [ 10, 14 ], [ 22, 26 ] ]

	ybuf = azeros( 30, x.dtype );
	y = new ctor( x.dtype, ybuf, [ 4, 3 ], [ 6, 2 ], 4, 'row-major' );

	s0 = new Slice( null, null, -2 );
	s1 = new Slice( null, null, -2 );
	s = new MultiSlice( s0, s1 );
	actual = sliceAssign( x, y, s, true );

	t.strictEqual( isndarrayLike( actual ), true, 'returns expected value' );
	t.strictEqual( actual, y, 'returns expected value' );

	expected = [
		[ 0, 0, 0 ],
		[ 26, 0, 22 ],
		[ 0, 0, 0 ],
		[ 14, 0, 10 ]
	];
	actual = ndarray2array( actual );
	t.deepEqual( actual, expected, 'returns expected value' );

	// Reverse order and skip every other row, starting from second-to-last row:
	x = new ctor( 'float64', xbuf, [ 2, 2 ], [ 12, 2 ], 4, 'row-major' ); // [ [ 4, 6 ], [ 16, 18 ] ]

	ybuf = azeros( 30, x.dtype );
	y = new ctor( x.dtype, ybuf, [ 4, 3 ], [ 6, 2 ], 4, 'row-major' );

	s0 = new Slice( 2, null, -2 );
	s1 = new Slice( 1, null, -1 );
	s = new MultiSlice( s0, s1 );
	actual = sliceAssign( x, y, s, true );

	t.strictEqual( isndarrayLike( actual ), true, 'returns expected value' );
	t.strictEqual( actual, y, 'returns expected value' );

	expected = [
		[ 18, 16, 0 ],
		[ 0, 0, 0 ],
		[ 6, 4, 0 ],
		[ 0, 0, 0 ]
	];
	actual = ndarray2array( actual );
	t.deepEqual( actual, expected, 'returns expected value' );

	// Set a sub-array:
	x = new ctor( 'float64', xbuf, [ 2, 2 ], [ 6, 2 ], 10, 'row-major' ); // [ [ 10, 12 ], [ 16, 18 ] ]

	ybuf = azeros( 30, x.dtype );
	y = new ctor( x.dtype, ybuf, [ 4, 3 ], [ 6, 2 ], 4, 'row-major' );

	s0 = new Slice( 2, 0, -1 );
	s1 = new Slice( 0, 2, 1 );
	s = new MultiSlice( s0, s1 );
	actual = sliceAssign( x, y, s, true );

	t.strictEqual( isndarrayLike( actual ), true, 'returns expected value' );
	t.strictEqual( actual, y, 'returns expected value' );

	expected = [
		[ 0, 0, 0 ],
		[ 16, 18, 0 ],
		[ 10, 12, 0 ],
		[ 0, 0, 0 ]
	];
	actual = ndarray2array( actual );
	t.deepEqual( actual, expected, 'returns expected value' );
	t.end();
});

tape( 'the function assigns input array element values to corresponding elements in an output array view (ndims=2, partial reduction)', function test( t ) {
	var expected;
	var actual;
	var xbuf;
	var ybuf;
	var s0;
	var s1;
	var x;
	var y;
	var s;

	xbuf = typedarray( zeroTo( 30 ), 'float64' );

	// Second column:
	x = new ctor( 'float64', xbuf, [ 4 ], [ 6 ], 7, 'row-major' ); // [ 7, 13, 19, 25 ]

	ybuf = azeros( 30, x.dtype );
	y = new ctor( x.dtype, ybuf, [ 4, 3 ], [ 6, 2 ], 5, 'row-major' );

	s = new MultiSlice( null, 1 );
	actual = sliceAssign( x, y, s, true );

	t.strictEqual( isndarrayLike( actual ), true, 'returns expected value' );
	t.strictEqual( actual, y, 'returns expected value' );

	expected = [
		[ 0, 7, 0 ],
		[ 0, 13, 0 ],
		[ 0, 19, 0 ],
		[ 0, 25, 0 ]
	];
	actual = ndarray2array( actual );
	t.deepEqual( actual, expected, 'returns expected value' );

	// Reverse order and skip every other element:
	x = new ctor( 'float64', xbuf, [ 2 ], [ 4 ], 11, 'row-major' ); // [ 11, 15 ]

	ybuf = azeros( 30, x.dtype );
	y = new ctor( x.dtype, ybuf, [ 4, 3 ], [ 6, 2 ], 5, 'row-major' );

	s0 = 1;
	s1 = new Slice( null, null, -2 );
	s = new MultiSlice( s0, s1 );
	actual = sliceAssign( x, y, s, true );

	t.strictEqual( isndarrayLike( actual ), true, 'returns expected value' );
	t.strictEqual( actual, y, 'returns expected value' );

	expected = [
		[ 0, 0, 0 ],
		[ 15, 0, 11 ],
		[ 0, 0, 0 ],
		[ 0, 0, 0 ]
	];
	actual = ndarray2array( actual );
	t.deepEqual( actual, expected, 'returns expected value' );

	// Reverse order and skip every other element, starting from second-to-last element:
	x = new ctor( 'float64', xbuf, [ 2 ], [ 12 ], 9, 'row-major' ); // [ 9, 21 ]

	ybuf = azeros( 30, x.dtype );
	y = new ctor( x.dtype, ybuf, [ 4, 3 ], [ 6, 2 ], 5, 'row-major' );

	s0 = new Slice( 2, null, -2 );
	s1 = 2;
	s = new MultiSlice( s0, s1 );
	actual = sliceAssign( x, y, s, true );

	t.strictEqual( isndarrayLike( actual ), true, 'returns expected value' );
	t.strictEqual( actual, y, 'returns expected value' );

	expected = [
		[ 0, 0, 21 ],
		[ 0, 0, 0 ],
		[ 0, 0, 9 ],
		[ 0, 0, 0 ]
	];
	actual = ndarray2array( actual );
	t.deepEqual( actual, expected, 'returns expected value' );

	// Set part of a row:
	x = new ctor( 'float64', xbuf, [ 2 ], [ 2 ], 11, 'row-major' ); // [ 11, 13 ]

	ybuf = azeros( 30, x.dtype );
	y = new ctor( x.dtype, ybuf, [ 4, 3 ], [ 6, 2 ], 5, 'row-major' );

	s0 = 1;
	s1 = new Slice( 0, 2, 1 );
	s = new MultiSlice( s0, s1 );
	actual = sliceAssign( x, y, s, true );

	t.strictEqual( isndarrayLike( actual ), true, 'returns expected value' );
	t.strictEqual( actual, y, 'returns expected value' );

	expected = [
		[ 0, 0, 0 ],
		[ 11, 13, 0 ],
		[ 0, 0, 0 ],
		[ 0, 0, 0 ]
	];
	actual = ndarray2array( actual );
	t.deepEqual( actual, expected, 'returns expected value' );
	t.end();
});

tape( 'the function assigns input array element values to corresponding elements in an output array view (ndims=3)', function test( t ) {
	var expected;
	var actual;
	var xbuf;
	var ybuf;
	var s0;
	var s1;
	var s2;
	var x;
	var y;
	var s;

	xbuf = typedarray( zeroTo( 100 ), 'float64' );

	// Full slice:
	x = new ctor( 'float64', xbuf, [ 2, 4, 3 ], [ 24, 6, 2 ], 10, 'row-major' ); // [ [ [ 10, 12, 14 ], [ 16, 18, 20 ], [ 22, 24, 26 ], [ 28, 30, 32 ] ], [ [ 34, 36, 38 ], [ 40, 42, 44 ], [ 46, 48, 50 ], [ 52, 54, 56 ] ] ]

	ybuf = azeros( 100, x.dtype );
	y = new ctor( x.dtype, ybuf, [ 2, 4, 3 ], [ 24, 6, 2 ], 4, 'row-major' );

	s = new MultiSlice( null, null, null );
	actual = sliceAssign( x, y, s, true );

	t.strictEqual( isndarrayLike( actual ), true, 'returns expected value' );
	t.strictEqual( actual, y, 'returns expected value' );

	expected = [
		[
			[ 10, 12, 14 ],
			[ 16, 18, 20 ],
			[ 22, 24, 26 ],
			[ 28, 30, 32 ]
		],
		[
			[ 34, 36, 38 ],
			[ 40, 42, 44 ],
			[ 46, 48, 50 ],
			[ 52, 54, 56 ]
		]
	];
	actual = ndarray2array( actual );
	t.deepEqual( actual, expected, 'returns expected value' );

	// Reverse order and skip every other element:
	x = new ctor( 'float64', xbuf, [ 2, 2, 2 ], [ 24, 12, 4 ], 16, 'row-major' ); // [ [ [ 16, 20 ], [ 28, 32 ] ], [ [ 40, 44 ], [ 52, 56 ] ] ]

	ybuf = azeros( 100, x.dtype );
	y = new ctor( x.dtype, ybuf, [ 2, 4, 3 ], [ 24, 6, 2 ], 4, 'row-major' );

	s0 = new Slice( null, null, -1 );
	s1 = new Slice( null, null, -2 );
	s2 = new Slice( null, null, -2 );
	s = new MultiSlice( s0, s1, s2 );
	actual = sliceAssign( x, y, s, true );

	t.strictEqual( isndarrayLike( actual ), true, 'returns expected value' );
	t.strictEqual( actual, y, 'returns expected value' );

	expected = [
		[
			[ 0, 0, 0 ],
			[ 56, 0, 52 ],
			[ 0, 0, 0 ],
			[ 44, 0, 40 ]
		],
		[
			[ 0, 0, 0 ],
			[ 32, 0, 28 ],
			[ 0, 0, 0 ],
			[ 20, 0, 16 ]
		]
	];
	actual = ndarray2array( actual );
	t.deepEqual( actual, expected, 'returns expected value' );

	// Reverse order and skip elements, starting from specified elements:
	x = new ctor( 'float64', xbuf, [ 2, 2, 2 ], [ 24, 12, 2 ], 10, 'row-major' ); // [ [ [ 10, 12 ], [ 22, 24 ] ], [ [ 34, 36 ], [ 46, 48 ] ] ]

	ybuf = azeros( 100, x.dtype );
	y = new ctor( x.dtype, ybuf, [ 2, 4, 3 ], [ 24, 6, 2 ], 4, 'row-major' );

	s0 = new Slice( null, null, 1 );
	s1 = new Slice( 2, null, -2 );
	s2 = new Slice( 1, null, -1 );
	s = new MultiSlice( s0, s1, s2 );
	actual = sliceAssign( x, y, s, true );

	t.strictEqual( isndarrayLike( actual ), true, 'returns expected value' );
	t.strictEqual( actual, y, 'returns expected value' );

	expected = [
		[
			[ 24, 22, 0 ],
			[ 0, 0, 0 ],
			[ 12, 10, 0 ],
			[ 0, 0, 0 ]
		],
		[
			[ 48, 46, 0 ],
			[ 0, 0, 0 ],
			[ 36, 34, 0 ],
			[ 0, 0, 0 ]
		]
	];
	actual = ndarray2array( actual );
	t.deepEqual( actual, expected, 'returns expected value' );

	// Set a sub-array:
	x = new ctor( 'float64', xbuf, [ 1, 2, 2 ], [ 24, 6, 2 ], 16, 'row-major' ); // [ [ [ 16, 118 ], [ 22, 24 ] ] ] ]

	ybuf = azeros( 100, x.dtype );
	y = new ctor( x.dtype, ybuf, [ 2, 4, 3 ], [ 24, 6, 2 ], 4, 'row-major' );

	s0 = new Slice( 0, 1, 1 );
	s1 = new Slice( 2, 0, -1 );
	s2 = new Slice( 0, 2, 1 );
	s = new MultiSlice( s0, s1, s2 );
	actual = sliceAssign( x, y, s, true );

	t.strictEqual( isndarrayLike( actual ), true, 'returns expected value' );
	t.strictEqual( actual, y, 'returns expected value' );

	expected = [
		[
			[ 0, 0, 0 ],
			[ 22, 24, 0 ],
			[ 16, 18, 0 ],
			[ 0, 0, 0 ]
		],
		[
			[ 0, 0, 0 ],
			[ 0, 0, 0 ],
			[ 0, 0, 0 ],
			[ 0, 0, 0 ]
		]
	];
	actual = ndarray2array( actual );
	t.deepEqual( actual, expected, 'returns expected value' );
	t.end();
});

tape( 'the function assigns input array element values to corresponding elements in an output array view (ndims=3, partial reduction)', function test( t ) {
	var expected;
	var actual;
	var xbuf;
	var ybuf;
	var s0;
	var s1;
	var s2;
	var x;
	var y;
	var s;

	xbuf = typedarray( zeroTo( 100 ), 'float64' );

	// Second row and second column:
	x = new ctor( 'float64', xbuf, [ 2 ], [ 24 ], 67, 'row-major' ); // [ 67, 91 ]

	ybuf = azeros( 100, x.dtype );
	y = new ctor( x.dtype, ybuf, [ 2, 4, 3 ], [ -24, -6, -2 ], 99, 'row-major' );

	s = new MultiSlice( null, 1, 1 );
	actual = sliceAssign( x, y, s, true );

	t.strictEqual( isndarrayLike( actual ), true, 'returns expected value' );
	t.strictEqual( actual, y, 'returns expected value' );

	expected = [
		[
			[ 0, 0, 0 ],
			[ 0, 67, 0 ],
			[ 0, 0, 0 ],
			[ 0, 0, 0 ]
		],
		[
			[ 0, 0, 0 ],
			[ 0, 91, 0 ],
			[ 0, 0, 0 ],
			[ 0, 0, 0 ]
		]
	];
	actual = ndarray2array( actual );
	t.deepEqual( actual, expected, 'returns expected value' );

	// Reverse order and skip elements:
	x = new ctor( 'float64', xbuf, [ 2, 3 ], [ 12, 2 ], 53, 'row-major' ); // [ [ 53, 55, 57 ], [ 65, 67, 69 ] ]

	ybuf = azeros( 100, x.dtype );
	y = new ctor( x.dtype, ybuf, [ 2, 4, 3 ], [ -24, -6, -2 ], 99, 'row-major' );

	s0 = 1;
	s1 = new Slice( null, null, -2 );
	s2 = new Slice( null, null, -1 );
	s = new MultiSlice( s0, s1, s2 );
	actual = sliceAssign( x, y, s, true );

	t.strictEqual( isndarrayLike( actual ), true, 'returns expected value' );
	t.strictEqual( actual, y, 'returns expected value' );

	expected = [
		[
			[ 0, 0, 0 ],
			[ 0, 0, 0 ],
			[ 0, 0, 0 ],
			[ 0, 0, 0 ]
		],
		[
			[ 0, 0, 0 ],
			[ 69, 67, 65 ],
			[ 0, 0, 0 ],
			[ 57, 55, 53 ]
		]
	];
	actual = ndarray2array( actual );
	t.deepEqual( actual, expected, 'returns expected value' );

	// Reverse order and skip elements:
	x = new ctor( 'float64', xbuf, [ 2, 2 ], [ 24, 4 ], 59, 'row-major' ); // [ [ 59, 63 ], [ 83, 87 ] ]

	ybuf = azeros( 100, x.dtype );
	y = new ctor( x.dtype, ybuf, [ 2, 4, 3 ], [ -24, -6, -2 ], 99, 'row-major' );

	s0 = new Slice( 1, null, -1 );
	s1 = 2;
	s2 = new Slice( null, null, 2 );
	s = new MultiSlice( s0, s1, s2 );
	actual = sliceAssign( x, y, s, true );

	t.strictEqual( isndarrayLike( actual ), true, 'returns expected value' );
	t.strictEqual( actual, y, 'returns expected value' );

	expected = [
		[
			[ 0, 0, 0 ],
			[ 0, 0, 0 ],
			[ 83, 0, 87 ],
			[ 0, 0, 0 ]
		],
		[
			[ 0, 0, 0 ],
			[ 0, 0, 0 ],
			[ 59, 0, 63 ],
			[ 0, 0, 0 ]
		]
	];
	actual = ndarray2array( actual );
	t.deepEqual( actual, expected, 'returns expected value' );

	// Set part of a column:
	x = new ctor( 'float64', xbuf, [ 2 ], [ 6 ], 65, 'row-major' ); // [ 65, 71 ]

	ybuf = azeros( 100, x.dtype );
	y = new ctor( x.dtype, ybuf, [ 2, 4, 3 ], [ -24, -6, -2 ], 99, 'row-major' );

	s0 = 1;
	s1 = new Slice( 0, 2, 1 );
	s2 = 2;
	s = new MultiSlice( s0, s1, s2 );
	actual = sliceAssign( x, y, s, true );

	t.strictEqual( isndarrayLike( actual ), true, 'returns expected value' );
	t.strictEqual( actual, y, 'returns expected value' );

	expected = [
		[
			[ 0, 0, 0 ],
			[ 0, 0, 0 ],
			[ 0, 0, 0 ],
			[ 0, 0, 0 ]
		],
		[
			[ 0, 0, 65 ],
			[ 0, 0, 71 ],
			[ 0, 0, 0 ],
			[ 0, 0, 0 ]
		]
	];
	actual = ndarray2array( actual );
	t.deepEqual( actual, expected, 'returns expected value' );
	t.end();
});

tape( 'the function supports broadcasting (ndims=1)', function test( t ) {
	var expected;
	var actual;
	var ybuf;
	var x;
	var y;
	var s;

	x = scalar2ndarray( 10.0, 'float64', 'row-major' );

	// Full slice:
	ybuf = azeros( 30, x.dtype );
	y = new ctor( x.dtype, ybuf, [ 6 ], [ 2 ], 4, 'row-major' );

	s = new MultiSlice( null );
	actual = sliceAssign( x, y, s, true );

	t.strictEqual( isndarrayLike( actual ), true, 'returns expected value' );
	t.strictEqual( actual, y, 'returns expected value' );

	expected = [ 10, 10, 10, 10, 10, 10 ];
	actual = ndarray2array( actual );
	t.deepEqual( actual, expected, 'returns expected value' );

	// Reverse order and skip every other element:
	ybuf = azeros( 30, x.dtype );
	y = new ctor( x.dtype, ybuf, [ 6 ], [ 2 ], 4, 'row-major' );

	s = new MultiSlice( new Slice( null, null, -2 ) );
	actual = sliceAssign( x, y, s, true );

	t.strictEqual( isndarrayLike( actual ), true, 'returns expected value' );
	t.strictEqual( actual, y, 'returns expected value' );

	expected = [ 0, 10, 0, 10, 0, 10 ];
	actual = ndarray2array( actual );
	t.deepEqual( actual, expected, 'returns expected value' );

	// Reverse order and skip every other element, starting from second-to-last element:
	ybuf = azeros( 30, x.dtype );
	y = new ctor( x.dtype, ybuf, [ 6 ], [ 2 ], 4, 'row-major' );

	s = new MultiSlice( new Slice( 4, null, -2 ) );
	actual = sliceAssign( x, y, s, true );

	t.strictEqual( isndarrayLike( actual ), true, 'returns expected value' );
	t.strictEqual( actual, y, 'returns expected value' );

	expected = [ 10, 0, 10, 0, 10, 0 ];
	actual = ndarray2array( actual );
	t.deepEqual( actual, expected, 'returns expected value' );

	// Skip every three elements, starting from second element:
	ybuf = azeros( 30, x.dtype );
	y = new ctor( x.dtype, ybuf, [ 6 ], [ 2 ], 4, 'row-major' );

	s = new MultiSlice( new Slice( 1, null, 3 ) );
	actual = sliceAssign( x, y, s, true );

	t.strictEqual( isndarrayLike( actual ), true, 'returns expected value' );
	t.strictEqual( actual, y, 'returns expected value' );

	expected = [ 0, 10, 0, 0, 10, 0 ];
	actual = ndarray2array( actual );
	t.deepEqual( actual, expected, 'returns expected value' );

	// Set a sub-array:
	ybuf = azeros( 30, x.dtype );
	y = new ctor( x.dtype, ybuf, [ 6 ], [ 2 ], 4, 'row-major' );

	s = new MultiSlice( new Slice( 4, 1, -1 ) );
	actual = sliceAssign( x, y, s, true );

	t.strictEqual( isndarrayLike( actual ), true, 'returns expected value' );
	t.strictEqual( actual, y, 'returns expected value' );

	expected = [ 0, 0, 10, 10, 10, 0 ];
	actual = ndarray2array( actual );
	t.deepEqual( actual, expected, 'returns expected value' );

	t.end();
});

tape( 'the function supports broadcasting (ndims=2)', function test( t ) {
	var expected;
	var actual;
	var ybuf;
	var s0;
	var s1;
	var x;
	var y;
	var s;

	x = scalar2ndarray( 10.0, 'float64', 'row-major' );

	// Full slice:
	ybuf = azeros( 30, x.dtype );
	y = new ctor( x.dtype, ybuf, [ 4, 3 ], [ 6, 2 ], 4, 'row-major' );

	s = new MultiSlice( null, null );
	actual = sliceAssign( x, y, s, true );

	t.strictEqual( isndarrayLike( actual ), true, 'returns expected value' );
	t.strictEqual( actual, y, 'returns expected value' );

	expected = [
		[ 10, 10, 10 ],
		[ 10, 10, 10 ],
		[ 10, 10, 10 ],
		[ 10, 10, 10 ]
	];
	actual = ndarray2array( actual );
	t.deepEqual( actual, expected, 'returns expected value' );

	// Reverse order and skip every other element:
	ybuf = azeros( 30, x.dtype );
	y = new ctor( x.dtype, ybuf, [ 4, 3 ], [ 6, 2 ], 4, 'row-major' );

	s0 = new Slice( null, null, -2 );
	s1 = new Slice( null, null, -2 );
	s = new MultiSlice( s0, s1 );
	actual = sliceAssign( x, y, s, true );

	t.strictEqual( isndarrayLike( actual ), true, 'returns expected value' );
	t.strictEqual( actual, y, 'returns expected value' );

	expected = [
		[ 0, 0, 0 ],
		[ 10, 0, 10 ],
		[ 0, 0, 0 ],
		[ 10, 0, 10 ]
	];
	actual = ndarray2array( actual );
	t.deepEqual( actual, expected, 'returns expected value' );

	// Reverse order and skip every other row, starting from second-to-last row:
	ybuf = azeros( 30, x.dtype );
	y = new ctor( x.dtype, ybuf, [ 4, 3 ], [ 6, 2 ], 4, 'row-major' );

	s0 = new Slice( 2, null, -2 );
	s1 = new Slice( 1, null, -1 );
	s = new MultiSlice( s0, s1 );
	actual = sliceAssign( x, y, s, true );

	t.strictEqual( isndarrayLike( actual ), true, 'returns expected value' );
	t.strictEqual( actual, y, 'returns expected value' );

	expected = [
		[ 10, 10, 0 ],
		[ 0, 0, 0 ],
		[ 10, 10, 0 ],
		[ 0, 0, 0 ]
	];
	actual = ndarray2array( actual );
	t.deepEqual( actual, expected, 'returns expected value' );

	// Set a sub-array:
	ybuf = azeros( 30, x.dtype );
	y = new ctor( x.dtype, ybuf, [ 4, 3 ], [ 6, 2 ], 4, 'row-major' );

	s0 = new Slice( 2, 0, -1 );
	s1 = new Slice( 0, 2, 1 );
	s = new MultiSlice( s0, s1 );
	actual = sliceAssign( x, y, s, true );

	t.strictEqual( isndarrayLike( actual ), true, 'returns expected value' );
	t.strictEqual( actual, y, 'returns expected value' );

	expected = [
		[ 0, 0, 0 ],
		[ 10, 10, 0 ],
		[ 10, 10, 0 ],
		[ 0, 0, 0 ]
	];
	actual = ndarray2array( actual );
	t.deepEqual( actual, expected, 'returns expected value' );
	t.end();
});

tape( 'the function supports broadcasting (ndims=3)', function test( t ) {
	var expected;
	var actual;
	var xbuf;
	var ybuf;
	var s0;
	var s1;
	var s2;
	var x;
	var y;
	var s;

	xbuf = typedarray( [ 10.0 ], 'float64' );
	x = new ctor( 'float64', xbuf, [ 1, 1 ], [ 1, 1 ], 0, 'row-major' );

	// Full slice:
	ybuf = azeros( 100, x.dtype );
	y = new ctor( x.dtype, ybuf, [ 2, 4, 3 ], [ 24, 6, 2 ], 4, 'row-major' );

	s = new MultiSlice( null, null, null );
	actual = sliceAssign( x, y, s, true );

	t.strictEqual( isndarrayLike( actual ), true, 'returns expected value' );
	t.strictEqual( actual, y, 'returns expected value' );

	expected = [
		[
			[ 10, 10, 10 ],
			[ 10, 10, 10 ],
			[ 10, 10, 10 ],
			[ 10, 10, 10 ]
		],
		[
			[ 10, 10, 10 ],
			[ 10, 10, 10 ],
			[ 10, 10, 10 ],
			[ 10, 10, 10 ]
		]
	];
	actual = ndarray2array( actual );
	t.deepEqual( actual, expected, 'returns expected value' );

	// Reverse order and skip every other element:
	ybuf = azeros( 100, x.dtype );
	y = new ctor( x.dtype, ybuf, [ 2, 4, 3 ], [ 24, 6, 2 ], 4, 'row-major' );

	s0 = new Slice( null, null, -1 );
	s1 = new Slice( null, null, -2 );
	s2 = new Slice( null, null, -2 );
	s = new MultiSlice( s0, s1, s2 );
	actual = sliceAssign( x, y, s, true );

	t.strictEqual( isndarrayLike( actual ), true, 'returns expected value' );
	t.strictEqual( actual, y, 'returns expected value' );

	expected = [
		[
			[ 0, 0, 0 ],
			[ 10, 0, 10 ],
			[ 0, 0, 0 ],
			[ 10, 0, 10 ]
		],
		[
			[ 0, 0, 0 ],
			[ 10, 0, 10 ],
			[ 0, 0, 0 ],
			[ 10, 0, 10 ]
		]
	];
	actual = ndarray2array( actual );
	t.deepEqual( actual, expected, 'returns expected value' );

	// Reverse order and skip elements, starting from specified elements:
	ybuf = azeros( 100, x.dtype );
	y = new ctor( x.dtype, ybuf, [ 2, 4, 3 ], [ 24, 6, 2 ], 4, 'row-major' );

	s0 = new Slice( null, null, 1 );
	s1 = new Slice( 2, null, -2 );
	s2 = new Slice( 1, null, -1 );
	s = new MultiSlice( s0, s1, s2 );
	actual = sliceAssign( x, y, s, true );

	t.strictEqual( isndarrayLike( actual ), true, 'returns expected value' );
	t.strictEqual( actual, y, 'returns expected value' );

	expected = [
		[
			[ 10, 10, 0 ],
			[ 0, 0, 0 ],
			[ 10, 10, 0 ],
			[ 0, 0, 0 ]
		],
		[
			[ 10, 10, 0 ],
			[ 0, 0, 0 ],
			[ 10, 10, 0 ],
			[ 0, 0, 0 ]
		]
	];
	actual = ndarray2array( actual );
	t.deepEqual( actual, expected, 'returns expected value' );

	// Set a sub-array:
	ybuf = azeros( 100, x.dtype );
	y = new ctor( x.dtype, ybuf, [ 2, 4, 3 ], [ 24, 6, 2 ], 4, 'row-major' );

	s0 = new Slice( 0, 1, 1 );
	s1 = new Slice( 2, 0, -1 );
	s2 = new Slice( 0, 2, 1 );
	s = new MultiSlice( s0, s1, s2 );
	actual = sliceAssign( x, y, s, true );

	t.strictEqual( isndarrayLike( actual ), true, 'returns expected value' );
	t.strictEqual( actual, y, 'returns expected value' );

	expected = [
		[
			[ 0, 0, 0 ],
			[ 10, 10, 0 ],
			[ 10, 10, 0 ],
			[ 0, 0, 0 ]
		],
		[
			[ 0, 0, 0 ],
			[ 0, 0, 0 ],
			[ 0, 0, 0 ],
			[ 0, 0, 0 ]
		]
	];
	actual = ndarray2array( actual );
	t.deepEqual( actual, expected, 'returns expected value' );
	t.end();
});

tape( 'the function supports safely casting input array elements to the data type of the output array', function test( t ) {
	var expected;
	var values;
	var actual;
	var x;
	var s;
	var v;
	var e;
	var i;
	var j;

	s = new MultiSlice( null );

	x = [
		scalar2ndarray( 10, 'float32', 'row-major' ),
		scalar2ndarray( 10, 'int8', 'row-major' ),
		scalar2ndarray( 10, 'uint16', 'row-major' ),
		scalar2ndarray( 10, 'float64', 'row-major' ),
		scalar2ndarray( new Complex64( 3.0, 5.0 ), 'complex64', 'row-major' )
	];
	values = [
		zeros( [ 2 ], { 'dtype': 'float64' } ),
		zeros( [ 2 ], { 'dtype': 'int16' } ),
		zeros( [ 2 ], { 'dtype': 'uint32' } ),
		zeros( [ 2 ], { 'dtype': 'complex128' } ),
		zeros( [ 2 ], { 'dtype': 'complex128' } )
	];
	expected = [
		[ 10, 10 ],
		[ 10, 10 ],
		[ 10, 10 ],
		[ 10, 10, 10, 10 ],
		[ 3, 5, 3, 5 ]
	];
	for ( i = 0; i < expected.length; i++ ) {
		actual = sliceAssign( x[ i ], values[ i ], s, true );

		t.strictEqual( isndarrayLike( actual ), true, 'returns expected value' );
		t.strictEqual( actual, values[ i ], 'returns expected value' );

		v = actual.data;
		e = expected[ i ];
		if ( isComplexDataType( actual.dtype ) ) {
			for ( j = 0; j < v.legnth; j++ ) {
				t.strictEqual( real( v[ j ] ), e[ j*2 ], 'returns expected value' );
				t.strictEqual( imag( v[ j ] ), e[ (j*2)+1 ], 'returns expected value' );
			}
		} else {
			for ( j = 0; j < v.length; j++ ) {
				t.strictEqual( v[ j ], e[ j ], 'returns expected value' );
			}
		}
	}
	t.end();
});

tape( 'the function supports downcasting floating-point input array elements to an output array data type of the same kind', function test( t ) {
	var expected;
	var values;
	var actual;
	var x;
	var s;
	var v;
	var e;
	var i;
	var j;

	s = new MultiSlice( null );

	x = [
		scalar2ndarray( 10, 'float64', 'row-major' ),
		scalar2ndarray( new Complex128( 3.0, 5.0 ), 'complex128', 'row-major' )
	];
	values = [
		zeros( [ 2 ], { 'dtype': 'float32' } ),
		zeros( [ 2 ], { 'dtype': 'complex64' } )
	];
	expected = [
		[ 10, 10 ],
		[ 3, 5, 3, 5 ]
	];
	for ( i = 0; i < expected.length; i++ ) {
		actual = sliceAssign( x[ i ], values[ i ], s, true );

		t.strictEqual( isndarrayLike( actual ), true, 'returns expected value' );
		t.strictEqual( actual, values[ i ], 'returns expected value' );

		v = actual.data;
		e = expected[ i ];
		if ( isComplexDataType( actual.dtype ) ) {
			for ( j = 0; j < v.legnth; j++ ) {
				t.strictEqual( real( v[ j ] ), e[ j*2 ], 'returns expected value' );
				t.strictEqual( imag( v[ j ] ), e[ (j*2)+1 ], 'returns expected value' );
			}
		} else {
			for ( j = 0; j < v.length; j++ ) {
				t.strictEqual( v[ j ], e[ j ], 'returns expected value' );
			}
		}
	}
	t.end();
});
