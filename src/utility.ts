//====================================================================
// utility.js
// part of 'total-serialism' Package
// by Timo Hoogland (@t.mo / @tmhglnd), www.timohoogland.com
// MIT License
//
// Utility functions
//====================================================================

import { plot as asciichart, PlotConfig } from 'asciichart';

export const HALF_PI: number = Math.PI / 2.0;
export const TWO_PI: number = Math.PI * 2.0;
export const PI: number = Math.PI;

/**
 * Converts the input to an array if it is not already an array.
 *
 * @param {any} a - The input to be converted to an array.
 * @return {Array} - The input converted to an array, or the input itself if it is already an array.
 */
export function toArray(a: any): Array<any> {
	return Array.isArray(a) ? a : [a];
}

/**
 * Retrieves the value from an array at a specified index, or the value itself if it is not an array.
 *
 * @param {any|Array} a - The value or array to retrieve a value from.
 * @param {number} [i=0] - The index of the array to retrieve a value from. Default is 0.
 * @return {any} - The value from the array at the specified index, or the value itself if it is not an array.
 */
export function fromArray(a: any | any[], i: number = 0): any {
	return Array.isArray(a) ? a[i] : a;
}

/**
 * Returns the length of an array, or 1 if the input is not an array.
 * If the input is a number, it returns the integer value.
 *
 * @param {Array | number | unknown} input - The value to check.
 * @return {number} The length of the array, or 1 if the input is not an array.
 * If the input is a number, it returns the integer value.
 */
export function length(input: Array<any> | number | unknown): number {
	if (Array.isArray(input)) return input.length;
	else return 1;
}
export const size = length; // alias

/**
 * Wraps a value between a low and high range.
 * Similar to modulo operation, but the low range is also adjustable.
 *
 * @param {number | number[]} input - The input value or an array of values.
 * @param {number} [lo = 12] - The minimum value (default is 12).
 * @param {number} [hi = 0] - The maximum value (default is 0).
 * @returns {number | number[]} The remainder after division, or an array of remainders.
 */
export function wrap(input: number | number[] = 0, lo: number = 12, hi: number = 0): number | number[] {
	// Swap lo and hi if lo is greater than hi
	if (lo > hi) [lo, hi] = [hi, lo];
	// If input is not an array, wrap the single value
	if (!Array.isArray(input)) return _wrap(input, lo, hi);
	// Map over the array and wrap each value
	const wrappedArray = input.map((value) => _wrap(value, lo, hi));
	return wrappedArray;
}

/**
 * Helper function to wrap a single value between a low and high range.
 *
 * @param {number} value - The input value.
 * @param {number} lo - The minimum value.
 * @param {number} hi - The maximum value.
 * @returns {number} The remainder after division.
 */
function _wrap(value: number, lo: number, hi: number): number {
	const range = hi - lo;
	return ((((value - lo) % range) + range) % range) + lo;
}

/**
 * Constrains a value or an array of values between a low and high range.
 *
 * @param {number | number[]} input - The input value or an array of values to constrain.
 * @param {number} [lo = 12] - The minimum value (default is 12).
 * @param {number} [hi = 0] - The maximum value (default is 0).
 * @returns {number | number[]} The constrained value or an array of constrained values.
 */
export function constrain(input: number | number[] = 0, lo: number = 12, hi: number = 0): number | number[] {
	// Swap lo and hi if lo is greater than hi
	if (lo > hi) [lo, hi] = [hi, lo];
	// If input is not an array, constrain the single value
	if (!Array.isArray(input)) return Math.min(hi, Math.max(lo, input));
	// Map over the array and constrain each value
	const constrainedArray = input.map((value) => Math.min(hi, Math.max(lo, value)));
	return constrainedArray;
}
// Export aliases for constrain
export const bound = constrain;
export const clip = constrain;
export const clamp = constrain;

/**
 * Folds a value or an array of values between a low and high range.
 * When the value exceeds the range, it is folded inwards, creating a "bouncing" effect against the boundaries.
 *
 * @param {number | number[]} input - The input value or an array of values to fold.
 * @param {number} [lo = 12] - The minimum value (default is 12).
 * @param {number} [hi = 0] - The maximum value (default is 0).
 * @returns {number | number[]} The folded value or an array of folded values.
 */
export function fold(input: number | number[] = 0, lo: number = 12, hi: number = 0): number | number[] {
	// Swap lo and hi if lo is greater than hi
	if (lo > hi) [lo, hi] = [hi, lo];
	// If input is not an array, fold the single value
	if (!Array.isArray(input)) return _fold(input, lo, hi);
	// Map over the array and fold each value
	const foldedArray = input.map((value) => _fold(value, lo, hi));
	return foldedArray;
}

/**
 * Helper function to fold a single value between a low and high range.
 *
 * @param {number} value - The input value to fold.
 * @param {number} lo - The minimum value.
 * @param {number} hi - The maximum value.
 * @returns {number} The folded value.
 */
function _fold(value: number, lo: number, hi: number): number {
	value = _map(value, lo, hi, -1, 1);
	value = Math.asin(Math.sin(value * HALF_PI)) / HALF_PI;
	return _map(value, -1, 1, lo, hi);
}

/**
 * Maps a value from one range to another.
 *
 * @param {number} value - The input value to map.
 * @param {number} inLo - The minimum value of the input range.
 * @param {number} inHi - The maximum value of the input range.
 * @param {number} outLo - The minimum value of the output range.
 * @param {number} outHi - The maximum value of the output range.
 * @returns {number} The mapped value.
 */
function _map(value: number, inLo: number, inHi: number, outLo: number, outHi: number): number {
	return ((value - inLo) / (inHi - inLo)) * (outHi - outLo) + outLo;
}
export const bounce = fold; // alias

/**
 * Performs linear interpolation (lerp) between two values or arrays.
 * Both input values/arrays can be single values or arrays.
 * The interpolation factor can be set as the third argument.
 *
 * @param {number | number[]} a - The first input value or array.
 * @param {number | number[]} b - The second input value or array.
 * @param {number} [f = 0.5] - The interpolation factor (default is 0.5).
 * @returns {number | number[]} The interpolated value or array.
 */
export function lerp(a: number | number[] = 0, b: number | number[] = 0, f: number = 0.5): number | number[] {
	return arrayCalc(a, b, (a, b) => a * (1 - f) + b * f);
}
export const mix = lerp; // alias

/**
 * Performs an arithmetic operation on two values or arrays.
 *
 * @param {number | number[]} a - The first input value or array.
 * @param {number | number[]} b - The second input value or array.
 * @param {Function} operation - The arithmetic operation to perform.
 * @returns {number | number[]} The result of the operation.
 * 
 * @example arrayCalc([1, 2, 3], [4, 5, 6], (a, b) => a + b) => [5, 7, 9]
 * arrayCalc([0, 1, [2, 3]], [[5, 7], 10], (a,b) => { return (a+b)/2 }) => [ [ 2.5, 3.5 ], 5.5, [ 3.5, 5 ] ]
 * arrayCalc([10, 2, 1, 5], [4, 9, 7, 3], (a,b) => { return Math.max(a,b) }) => [ 10, 9, 7, 5 ] 
 */
export function arrayCalc(a: number | number[], b: number | number[], operation: (a: number, b: number) => number): number | number[] {
	// If the right-hand input is an array
	if (Array.isArray(b)) {
		const right: number[] = b;
		// Convert the left-hand input to an array if it's not already
		const left: number[] = toArray(a);
		// Initialize an empty result array
		let result: number[] = [];
		// Determine the length of the longest input array
		let length = Math.max(left.length, right.length);
		// Iterate over the indices of the arrays
		result = Array.from({ length: length }, (_, i) => operation(fromArray(left, i % left.length), fromArray(right, i % right.length)));
		return result;
	}
	// If both inputs are not arrays
	if (!Array.isArray(a)) {
		// Apply the function to the inputs
		const result = operation(a, b);
		return result;
	}
	// If the left-hand input is an array and the right-hand input is not
	const left: number[] = a;
	const right: number = b;
	const result = left.map(x => arrayCalc(x, right, operation) as number);
	return result;
}

/**
 * Adds two values or arrays.
 *
 * @param {number | number[]} a - The first input value or array.
 * @param {number | number[]} b - The second input value or array.
 * @returns {number | number[]} The sum of the inputs.
 */
export function add(a: number | number[] = 0, b: number | number[] = 0): number | number[] {
	return arrayCalc(a, b, (a, b) => a + b);
}

/**
 * Subtracts two values or arrays.
 *
 * @param {number | number[]} a - The first input value or array.
 * @param {number | number[]} b - The second input value or array.
 * @returns {number | number[]} The difference of the inputs.
 */
export function subtract(a: number | number[] = 0, b: number | number[] = 0): number | number[] {
	return arrayCalc(a, b, (a, b) => a - b);
}

/**
 * Multiplies two values or arrays.
 *
 * @param {number | number[]} a - The first input value or array.
 * @param {number | number[]} b - The second input value or array.
 * @returns {number | number[]} The product of the inputs.
 */
export function multiply(a: number | number[] = 0, b: number | number[] = 1): number | number[] {
	return arrayCalc(a, b, (a, b) => a * b);
}

/**
 * Divides two values or arrays.
 *
 * @param {number | number[]} a - The first input value or array.
 * @param {number | number[]} b - The second input value or array.
 * @returns {number | number[]} The quotient of the inputs.
 */
export function divide(a: number | number[] = 0, b: number | number[] = 1): number | number[] {
	return arrayCalc(a, b, (a, b) => a / b);
}

/**
 * Calculates the remainder after division of two values or arrays.
 *
 * @param {number | number[]} a - The first input value or array.
 * @param {number | number[]} b - The second input value or array.
 * @returns {number | number[]} The remainder after division.
 */
export function mod(a: number | number[] = 0, b: number | number[] = 12): number | number[] {
	return arrayCalc(a, b, (a, b) => ((a % b) + b) % b);
}

/**
 * Raises a value or array to the power of another value or array.
 *
 * @param {number | number[]} a - The base value or array.
 * @param {number | number[]} b - The exponent value or array.
 * @returns {number | number[]} The result of the power operation.
 */
export function pow(a: number | number[] = 0, b: number | number[] = 1): number | number[] {
	return arrayCalc(a, b, (a, b) => Math.pow(a, b));
}

/**
 * Calculates the square root of a value or array.
 *
 * @param {number | number[]} a - The input value or array.
 * @returns {number | number[]} The square root of the input.
 */
export function sqrt(a: number | number[] = 0): number | number[] {
	return arrayCalc(a, 0, (a) => Math.sqrt(a));
}

/**
 * Flattens a multi-dimensional array to the specified depth.
 *
 * @param {any[]} a - The input array.
 * @param {number} [depth=Infinity] - The depth to which the array should be flattened (default is Infinity).
 * @returns {any[]} The flattened array.
 */
export function flatten(a: any[] = [0], depth: number = Infinity): any[] {
	return toArray(a).flat(depth);
}

/**
 * Truncates all the values in an array towards zero.
 *
 * @param {number | number[]} a - The input value or array.
 * @returns {number | number[]} The truncated value or array.
 */
export function truncate(a: number | number[] = [0]): number | number[] {
	if (!Array.isArray(a)) return Math.trunc(a);
	return a.map(x => Math.trunc(x));
}

/**
 * Calculates the sum of all values in the input array.
 *
 * @param {number[]} a - The input array.
 * @returns {number} The sum of all values in the array.
 */
export function sum(a: number[] = [0]): number {
	let s = 0;
	flatten(toArray(a)).forEach((v) => s += isNaN(v) ? 0 : v);
	return s;
}

/**
 * Returns the maximum value from an array.
 *
 * @param {number[]} a - The input array.
 * @returns {number} The maximum value in the array.
 */
function maximum(a: number[] = [0]): number {
	if (!Array.isArray(a)) return a;
	return Math.max(...flatten(a));
}
/**
 * Returns the minimum value from an array.
 *
 * @param {number[]} a - The input array.
 * @returns {number} The minimum value in the array.
 */
function minimum(a: number[] = [0]): number {
	return !Array.isArray(a) ? a : Math.min(...flatten(a));
}

/**
 * Normalizes all the values in an array between 0 and 1.
 * The highest value will be 1, and the lowest value will be 0.
 *
 * @param {number | number[]} a - The input value or array.
 * @returns {number | number[]} The normalized value or array.
 */
function normalize(a: number | number[] = [0]): number | number[] {
	if (!Array.isArray(a)) a = toArray(a);
	const min = minimum(a);
	const range = maximum(a) - min;
	const normalizedRange = range ? range : 0;
	return divide(subtract(a, min), normalizedRange);
}

/**
 * Normalizes all the values in an array between -1 and 1.
 * The highest value will be 1, and the lowest value will be -1.
 *
 * @param {number | number[]} a - The input value or array.
 * @returns {number | number[]} The signed normalized value or array.
 */
export function signedNormalize(a: number | number[] = [0]): number | number[] {
	return subtract(multiply(normalize(a), 2), 1);
}

/**
 * Filters duplicate items from an array.
 * Note: This function flattens 2-dimensional arrays.
 *
 * @param {any[]} a - The input array.
 * @returns {any[]} The array with duplicates removed.
 */
export function unique(a: any[] = [0]): any[] {
	// If the input is a 2D array, flatten it first
	a = a.reduce((acc, val) => acc.concat(val), []);
	return [...new Set(toArray(a))];
}

/**
 * Plots an array of values to the console in the form of an ASCII chart.
 * If you want the chart returned as text instead of logged to the console, set { log: false }.
 * Uses the asciichart package by x84.
 *
 * @param {number | number[] | string} a - The value or array to plot.
 * @param {PlotConfig} [prefs] - An object containing preferences for the plot.
 * @param {boolean} [logs.log=true] - Whether to log the chart to the console.
 * @param {boolean} [logs.data=false] - Whether to log the chart data to the console.
 * @param {boolean} [logs.decimals=2] - The number of decimal places to display in the chart data.
 * @param {number} [prefs.height] - The fixed chart line-height in pixels.
 * @returns {string} The ASCII chart.
 */
export function plot(a: number | number[] | string = [0], prefs: PlotConfig = {}, logs: { log: boolean, data: boolean, decimals: number } = { log: true, data: false, decimals: 2 }): string {
	a = toArray(a);
	prefs = typeof prefs !== 'undefined' ? prefs : {};
	const { decimals, data, log } = logs;
	const p = asciichart(a, prefs);
	if (data) console.log('chart data: [', a.map(x => x.toFixed(decimals)).join(', '), ']\n');
	if (log) console.log(p, '\n');
	return p;
}

/**
 * Draws a 2D array of values to the console in the form of an ASCII grayscale image.
 * If you want the image returned as text instead of logged to the console, set { log: false }.
 * If you want to print using a character set under ASCII code 256, set { extend: false }.
 *
 * @param {number[] | number[][]} a - The 2D array of values to draw.
 * @param {Object} [prefs] - An object containing preferences for the drawing.
 * @param {boolean} [prefs.log=true] - Whether to log the image to the console.
 * @param {boolean} [prefs.extend=true] - Whether to use extended ASCII characters.
 * @param {boolean} [prefs.error=false] - Whether to use an error character for error reporting.
 * @returns {string} The ASCII grayscale image as a string.
 */
export function draw(a: number[] | number[][] = [0], prefs: { log: boolean; extend: boolean; error: boolean; } = { log: true, extend: true, error: false }): string {
	// If our input is a 1D array, convert it to a 2D array
	const array2D: number[][] = (Array.isArray(a[0])) ? a : toArray(a);
	
	// when using extended ascii set
	let chars = (prefs.extend) ? ' ░▒▓█'.split('') : ' .-=+#'.split('');
	// when flagging NaN values
	let err = (prefs.error) ? ((prefs.extend) ? '�' : '?') : ' ';

	// get the lowest and highest value from input and calculate range
	let min = array2D.flat().reduce((acc, val) => Math.min(acc, val), Infinity);
	let max = array2D.flat().reduce((acc, val) => Math.max(acc, val), -Infinity);
	let range = max - min;

	// Convert the 2D array to a string of ASCII characters
	const p = array2D.flatMap(row => 
	  // Map each row to an ASCII character
	  row.map(val => 
	    // If the value is NaN or the range is NaN, use the error character
	    isNaN(val) || isNaN(range) 
	      ? err 
	      // Otherwise, look up the ASCII character based on the normalized value
	      : chars[Math.trunc((val - min) / range * (chars.length - 1))]
	  ).join('')
	).join( // Join the rows with a linebreak if multiple lines
	array2D.length > 1 ? '\n' : ''
	);
	if (prefs.log) { console.log(p); }
	return p;
}
