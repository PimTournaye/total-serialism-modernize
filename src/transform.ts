//=======================================================================
// transform.js
// part of 'total-serialism' Package
// by Timo Hoogland (@t.mo / @tmhglnd), www.timohoogland.com
// MIT License
//
// Methods that transform number sequences
// These are called the "transformers"
// A transformer always takes an input list as the first argument
// A transformer never destructively changes the input list
// The output of the transformer is the modified input list(s)
// 
// TODO:
// - make invert() work with note-values 'c' etc.
// 
// credits:
// - Many functions are based on Laurie Spiegel's suggestion to 
// "extract a basic "library" consisting of the most elemental 
// transformations which have consistently been successfully used on 
// musical patterns, a basic group of "tried-and-true" musical 
// manipulations.", in Manipulation of Musical Patterns (1981)
//=======================================================================

// require the Utility methods
// const Rand = require('./gen-stochastic');
// import { sort } from './statistic';
import { flatten, add, maximum, minimum, lerp, toArray, length, unique, arrayCombinations, type InterpolationMode } from './utility';

/**
 * Clones an array multiple times,
 * optionally adding an offset to every value when duplicating.
 * Also works with 2-dimensional arrays.
 * If a string is provided, the values will be concatenated.
 *
 * @param {Array} a - The array to clone.
 * @param {...(number|string)} clones - The amount of clones with optional integer offset or string concatenation.
 * @return {Array} The cloned array.
 * @example // duplicate an array with an offset added to every value
 *					clone([0, 5, 7], 0, 12, -12) // => [ 0, 5, 7, 12, 17, 19, -12, -7, -5 ] 
 *					// works with multidimensional arrays
 *					clone([0, 5, [7, 12]], 0, 12, -12) //=> [ 0, 5, [ 7, 12 ], 12, 17, [ 19, 24 ], -12, -7, [ -5, 0 ] ]
 *					// works with strings
 *					clone(['c', ['e', 'g']], ['4', '5', '#3']) // => [ 'c4', [ 'e4', 'g4' ], 'c5', [ 'e5', 'g5' ], 'c#3', [ 'e#3', 'g#3' ] ]
 */
export function clone(a: Array<any> = [0], ...clones: number[] | string[]): Array<any> {
	const offsetArray = toArray(clones).flatMap(offset => Array(offset).fill(a).flat());
	return [a, ...offsetArray].flatMap(values => values.map((value: number | number[] | undefined, index: string | number) =>
		typeof clones[index] === 'string' ? `${value}${clones[index]}` : add(value, clones[index])
	));
}

/**
 * Combines multiple arrays into a single array.
 * @param arrs - arrays to be combined
 * @returns the combined array
 * @example const arr1 = [1, 2, 3];
 *					const arr2 = ['a', 'b'];
 *					const arr3 = [true, false];
 *					const result = combine(arr1, arr2, arr3);
 *					// result has type number[] | string[] | boolean[]
 */
export function combine<T extends readonly any[]>(...arrs: T[]): ConcatArray<T[number]> {
	return [...arrs.flat()] as ConcatArray<T[number]>;
}

/**
 * Duplicates an array a certain number of times .
 *
 * @param {Array} arr - The array to duplicate.
 * @param {number} [duplicates=2] - The number of duplicates. Default is 2.
 * @return {Array} The duplicated array.
 * @example
 * // Duplicates an array three times
 * duplicate([0, 7, 12], 3);
 * //=> [ 0, 7, 12, 0, 7, 12, 0, 7, 12 ]
 *
 * // Works with 2D-arrays
 * duplicate([0, [3, 7], 12], 2);
 * //=> [ 0, [ 3, 7 ], 12, 0, [ 3, 7 ], 12 ]
 *
 * // Works with strings
 * duplicate(['c', 'f', 'g'], 3);
 * //=> [ 'c', 'f', 'g', 'c', 'f', 'g', 'c', 'f', 'g' ]
 */
export function duplicate(arr: Array<any> = [0], duplicates: number = 2): Array<any> {
	return Array(Math.max(1, duplicates)).flatMap(value => Array.from(arr));
}


/**
 * Add zeroes to an array with a number sequence. The division determines the amount of values per bar. The total length equals the bars times division. This method is very useful for rhythms that must occur once in a while, but can also be use for melodic phrases. Also works with strings.
 * This function creates an array with a specified length by repeating the values from the input array. The length of the output array is determined by the number of bars multiplied by the division, and the shift parameter determines the number of divisions to shift the output array.
 *
 * @param {number[]} a - The input array to be repeated.
 * @param {number} [bars=1] - The number of bars. Default is 1.
 * @param {number} [div=16] - The number of values per bar. Default is 16.
 * @param {any} [pad=0] - The value used for padding. Default is 0.
 * @param {number} [shift=0] - The number of divisions to shift the output array. Default is 0.
 * @return {Array} The array with repeated values.
 * 
 * @example // add zeroes to a rhythm to make it play once over a certain amount of bars
 *					every([1, 0, 1, 1, 1], 2, 8);
 *					//=> [ 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
 *					 
 *					// change the padding value with an optional 3rd argument
 *					every([3, 0, 7, 9, 11], 2, 8, 12);
 *					//=> [ 3, 0, 7, 9, 11, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12 ]
 *					
 *					// change the shift (rotation) with an optional 4th argument
 *					every([1, 0, 0, 1, 1], 2, 8, 0, 1);
 *					//=> [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0 ]
 *					
 *					// works with 2D-array
 *					every([3, [0, 7, 9], 11], 1, 12);
 *					//=> [ 3, [ 0, 7, 9 ], 11, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] 
 *					
 *					// Works with strings
 *					every(['c4', 'eb4', 'g4', 'f4', 'eb4'], 2, 8, 'r');
 *					//=> [ 'c4',  'eb4', 'g4', 'f4',
 *					//     'eb4', 'r',   'r',  'r',
 *					//     'r',   'r',   'r',  'r',
 *					//     'r',   'r',   'r',  'r' ] 
 */
export function every(a: number[] = [0], bars: number = 1, div: number = 16, pad: any = 0, shift: number = 0): Array<any> {
	const len = Math.floor(bars * div);
	const sft = Math.floor(shift * div);
	return padding(a, len, pad, sft);
}

/**
 * Pads an array with a specified value up to the desired length.
 * The padding value can optionally be changed and the shift argument rotates the list by a specified number of steps.
 * This function is similar to `Array.prototype.slice()` except that it pads the array to a specified length.
 * 
 * @param {number[]} a - The array to pad.
 * @param {number} [length=0] - The desired length of the output array.
 * @param {*} [pad=0] - The value to use for padding.
 * @param {number} [shift=0] - The number of steps to shift the output array.
 * @returns {Array} - The padded array.
 * @example
 * pad([3, 7, 11, 12], 9); //=> [3, 7, 11, 12, 0, 0, 0, 0, 0]
 * pad(['c', 'f', 'g'], 11, '-', 4); //=> ['-', '-', '-', '-', 'c', 'f', 'g', '-', '-', '-', '-']
 */
export function padding(a: number[] = [], length: number = 0, pad: any = 0, shift: number = 0): Array<any> {
	const arr = Array(length - a.length).fill(pad);
	return rotate([...a, ...arr], shift);
}

/**
 * Remove one or multiple values from an array.
 *
 * @param {Array} a - The array to filter.
 * @param {(number|string|Array)} f - The values to filter.
 * @return {Array} - The filtered array.
 *
 * @example
 * filter([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [3, 8, 10]);
 * //=> [0, 1, 2, 4, 5, 6, 7, 9]
 */
export function filter(a: (number | string)[] = [], f: (number | string)[] = []): Array<any> {
	const arr = Array.isArray(a) ? a : [a];
	return arr.filter(value => !f.includes(value));
}

/**
 * Filter one or multiple data types from an array.
 * 
 * @param {Array} a - The array to filter.
 * @param {(string|string[])} t - The types to filter (default is 'number').
 * @return {Array} - The filtered array.
 * 
 * Default filter is set to 'number'.
 * 
 * @example
 * // Return only a specific data type (in this case, you specify the type to return)
 * filterType([0, 1, [1, 2], 'foo', 2, null, true, {bar: 5}, 3.14, undefined], 'number');
 * //=> [ 0, 1, 2, 3.14 ] 
 */
export function filterType(a: (number | string | Array<any>)[] = [0], t: string | string[] = 'number'): (number | string)[] {
	const array = Array.isArray(a) ? [...a] : [a];
	const types = toArray(t);

	const filteredArray: (number | string)[] = [];
	for (const type of types) {
		let index = array.findIndex(value => typeof value === type);
		while (index !== -1) {
			const [value] = array.splice(index, 1);
			filteredArray.push(value);
			index = array.findIndex(value => typeof value === type);
		}
	}
	return filteredArray;
}
exports.filterType = filterType;
exports.tFilter = filterType;

// invert a list of values by mapping the lowest value
// to the highest value and vice versa, flipping everything
// in between. 
// Second optional argument sets the center to flip values against. 
// Third optional argument sets a range to flip values against.
// 
// @param {Array} -> array to invert
// @param {Int} -> invert center / low range (optional)
// @param {Int} -> high range (optional)
// @return {Array}
// 
function invert(a = [0], lo: number | undefined, hi: number | undefined) {
	a = toArray(a);

	if (lo === undefined) {
		// if no center value set lo/hi based on min/max
		hi = maximum(a);
		lo = minimum(a);
	} else if (hi === undefined) {
		// if no hi defined set hi to be same as lo
		hi = lo;
	}
	return a.slice().map(v => {
		// apply the algorithm recursively for all items
		if (Array.isArray(v)) {
			return invert(v, lo, hi);
		}
		return hi - v + lo;
	});
}
exports.invert = invert;

// interleave two or more arrays
// 
// @param {Array0, Array1, ..., Array-n} -> arrays to interleave
// @return {Array}
//  
function lace(...arrs: any[][]) {
	if (!arrs.length) { return [0]; }
	// get the length of longest list
	var l = 0;
	for (let i = 0; i < arrs.length; i++) {
		arrs[i] = toArray(arrs[i]);
		l = Math.max(arrs[i].length, l);
	}
	// for the max length push all values of the various lists
	var arr = [];
	for (var i = 0; i < l; i++) {
		for (var k = 0; k < arrs.length; k++) {
			let v = arrs[k][i];
			if (v !== undefined) { arr.push(v); }
		}
	}
	return arr;
}
exports.lace = lace;
exports.zip = lace;

// Build an array of items based on another array of indeces 
// The values are wrapped within the length of the lookup array
// Works with n-dimensional arrays by applying a recursive lookup
// 
// @param {Array} -> Array with indeces to lookup
// @param {Array} -> Array with values returned from lookup
// @return {Array} -> Looked up values
// 
function lookup(idx = [0], arr = [0]) {
	idx = toArray(idx);
	arr = toArray(arr);
	let a = [];
	let len = arr.length;
	for (let i = 0; i < idx.length; i++) {
		// recursively lookup values for multidimensional arrays
		if (Array.isArray(idx[i])) {
			a.push(lookup(idx[i], arr));
		} else {
			if (!isNaN(idx[i])) {
				let look = (Math.floor(idx[i]) % len + len) % len;
				a.push(arr[look]);
			}
		}
	}
	return a;
}
exports.lookup = lookup;

// merge all values of two arrays on the same index
// into a 2D array. preserves length of longest list
// flattens multidimensional arrays to 2 dimensions on merge
// 
// @params {Array0, Array1, ..., Array-n} -> Arrays to merge
// @return {Array}
// 
function merge(...arrs: any[][]) {
	if (!arrs.length) { return [0]; }
	let l = 0;
	for (let i = 0; i < arrs.length; i++) {
		arrs[i] = toArray(arrs[i]);
		l = Math.max(arrs[i].length, l);
	}
	let arr = [];
	for (let i = 0; i < l; i++) {
		let a = [];
		for (let k = 0; k < arrs.length; k++) {
			let v = arrs[k][i];
			if (v !== undefined) {
				if (Array.isArray(v)) a.push(...v);
				else a.push(v);
			}
		}
		arr[i] = a;
	}
	return arr;
}
exports.merge = merge;

// reverse an array and concatenate to the input
// creating a palindrome of the array
// 
// @param {Array} -> array to make palindrome of
// @param {Bool} -> no-double flag (optional, default=false)
// @return {Array}
// 
function palindrome(arr: any[] | undefined, noDouble = false) {
	if (arr === undefined) { return [0] };
	if (!Array.isArray(arr)) { return [arr] };

	let rev = arr.slice().reverse();
	if (noDouble) {
		rev = rev.slice(1, rev.length - 1);
	}
	return arr.concat(rev);
}
exports.palindrome = palindrome;
exports.palin = palindrome;
exports.mirror = palindrome;

// repeat the values of an array n-times
// Using a second array for repeat times iterates over that array
// 
// @param {Array} -> array with values to repeat
// @param {Int/Array} -> array or number of repetitions per value
// @return {Array}
// 
function repeat(arr = [0], rep = 1) {
	arr = toArray(arr);
	rep = toArray(rep);

	let a = [];
	for (let i = 0; i < arr.length; i++) {
		let r = rep[i % rep.length];
		r = (isNaN(r) || r < 0) ? 0 : r;
		for (let k = 0; k < r; k++) {
			a.push(arr[i]);
		}
	}
	return a;
}
exports.repeat = repeat;

// reverse the order of items in an Array
// 
// @param {Array} -> array to reverse
// @return {Array}
// 
function reverse(a = [0]) {
	if (!Array.isArray(a)) { return [a]; }
	return a.slice().reverse();
}
exports.reverse = reverse;

// rotate the position of items in an array 
// 1 = direction right, -1 = direction left
// 
// @param {Array} -> array to rotate
// @param {Int} -> steps to rotate (optional, default=0)
// @return {Array}
// 
function rotate(a = [0], r = 0) {
	if (!Array.isArray(a)) { return [a]; }
	var l = a.length;
	var arr = [];
	for (var i = 0; i < l; i++) {
		// arr[i] = a[Util.mod((i - r), l)];
		arr[i] = a[((i - r) % l + l) % l];
	}
	return arr;
}
exports.rotate = rotate;

// slice an array in one or multiple parts 
// slice lengths are determined by the second argument array
// outputs an array of arrays of the result
//
// @params {Array} -> array to slice
// @params {Number|Array} -> slice points
// @return {Array}
// 
function slice(a = [0], s = [0], r = true) {
	a = toArray(a);
	s = toArray(s);

	let arr = [];
	let _s = 0;
	for (let i = 0; i < s.length; i++) {
		if (s[i] > 0) {
			let _t = _s + s[i];
			arr.push(a.slice(_s, _t));
			_s = _t;
		}
	}
	if (r) {
		let rest = a.slice(_s, a.length);
		// attach the rest if not an empty array and r=true
		if (rest.length > 0) { arr.push(rest); }
	}
	return arr;
}
exports.slice = slice;

// Similar to slice in that it also splits an array
// excepts slice recursively splits until the array is
// completely empty 
// 
// @params {Array} -> array to split
// @params {Number/Array} -> split sizes to iterate over
// @return {Array} -> 2D array of splitted values
// 
function split(a = [0], s = [1]) {
	a = toArray(a);
	s = toArray(s);

	return _split(a, s);
}
exports.split = split;

function _split(a: string | any[] | undefined, s: any[] | undefined) {
	if (s[0] > 0) {
		let arr = a.slice(0, s[0]);
		let res = a.slice(s[0], a.length);

		if (res.length < 1) { return [arr]; }
		return [arr, ...split(res, rotate(s, -1))];
	}
	return [...split(a, rotate(s, -1))];
}

// spray the values of one array on the 
// places of values of another array if 
// the value is greater than 0
// 
// param {Array} -> array to spread
// param {Array} -> positions to spread to
// return {Array}
// 
function spray(values = [0], beats = [0]) {
	values = toArray(values);
	beats = toArray(beats);

	var arr = beats.slice();
	var c = 0;
	for (let i in beats) {
		if (beats[i] > 0) {
			arr[i] = values[c++ % values.length];
		}
	}
	return arr;
}
exports.spray = spray;


/**
 * Alternates through multiple lists consecutively.
 * 
 * This function interleaves through 2 or more arrays, giving a similar result
 * as 'lace', except the output length is the lowest common denominator of the
 * input lists, so that every combination of consecutive values is included.
 *
 * @param {...Array} arrs - The arrays to interleave.
 * @return {Array} - The array of results, one dimension less.
 */
export function step(...arrs: any[]): Array<any> {
	// If no arrays are provided, return an array with a single 0.
	if (!arrs.length) { return [0]; }
	// Flatten the array combinations and return the result.
	return flatten(arrayCombinations(...arrs), 1);
}

/**
 * Stretches (or shrinks) an array to a specified length, linearly interpolating between all values within the array.
 * Minimum output length is 2 (which will be the outmost values from the array).
 * Interpolation modes available: 'none', 'linear', 'cosine', and 'cubic'.
 *
 * @param {number[]} a - The array to stretch.
 * @param {number} len - The desired output length of the array.
 * @param {InterpolationMode} [mode='linear'] - The interpolation mode to use (default is 'linear').
 * @returns {number[]} The stretched array.
 */
export function stretch(a: number[] = [0], len: number = 1, mode: InterpolationMode = 'linear'): number[] {
	a = toArray(a);
	if (len < 2) return a;
	len = length(len);

	let arr: number[] = [];
	const l = a.length;

	for (let i = 0; i < len; i++) {
		const val: number = i / (len - 1) * (l - 1);
		const a0: number = a[Math.max(Math.trunc(val), 0)];
		const a1: number = a[Math.min(Math.trunc(val) + 1, l - 1) % a.length];
		arr.push(lerp(a0, a1, val % 1, mode) as number);
	}
	return arr;
}