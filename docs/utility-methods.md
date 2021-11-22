# Utility

Basic arithmetic and methods necessary to run functions in the libraries above. Can also be of help in your own algorithmic processes. Also includes a `plot()` method which generates an asciichart of the array printed to the console.

## Include

```js
const Util = require('total-serialism').Utility;
```

# Methods

- wrap
- bound
- fold
- map
- add
- subtract
- multiply
- divide
- mod
- pow
- sqrt
- sum
- minimum
- maximum
- normalize
- flatten
- plot
- draw

Mapping and scaling methods

```js
// Apply modulus (%) operation to an array
Util.wrap([0, [1, [2, 3]], [4, 5], 6], 2, 5);
//=> [ 3, [ 4, [ 2, 3 ] ], [ 4, 2 ], 3 ] 

Util.wrap(Gen.spread(30), 2, 8);
//=>  7.00 ┤╭╮    ╭╮    ╭╮    ╭╮    ╭╮    
//    6.00 ┼╯│   ╭╯│   ╭╯│   ╭╯│   ╭╯│    
//    5.00 ┤ │  ╭╯ │  ╭╯ │  ╭╯ │  ╭╯ │  ╭ 
//    4.00 ┤ │ ╭╯  │ ╭╯  │ ╭╯  │ ╭╯  │ ╭╯ 
//    3.00 ┤ │╭╯   │╭╯   │╭╯   │╭╯   │╭╯  
//    2.00 ┤ ╰╯    ╰╯    ╰╯    ╰╯    ╰╯    

// Constrain an array between low and high values
Util.constrain([0, [1, [2, 3]], [4, 5], 6], 2, 5);
//=> [ 2, [ 2, [ 2, 3 ] ], [ 4, 5 ], 5 ] 

Util.constrain(Gen.cosine(30, 1), 5, 9);
//=>  9.00 ┼─────╮                   ╭─── 
//    8.20 ┤     │                  ╭╯    
//    7.40 ┤     ╰╮                ╭╯     
//    6.60 ┤      ╰╮              ╭╯      
//    5.80 ┤       │              │       
//    5.00 ┤       ╰──────────────╯ 

// Alias: bound(), clip(), clamp()

// Fold an array between low and high values
// Higher/lower values will bounce back instead of wrap
Util.fold([0, [1, [2, 3]], [4, 5], 6], 2, 5);
//=> [ 4, [ 3, [ 2, 3 ] ], [ 4, 5 ], 4 ]

Util.fold(Gen.spreadFloat(30, -9, 13), 0, 1);
//=>  1.00 ┼╮         ╭╮      ╭╮          
//    0.80 ┤│ ╭╮   ╭╮ ││ ╭╮╭╮ ││ ╭╮   ╭╮  
//    0.60 ┤│ ││╭─╮││ ││╭╯││╰╮││ ││╭─╮││  
//    0.40 ┤│╭╯││ ││╰─╯││ ││ ││╰─╯││ ││╰╮ 
//    0.20 ┤╰╯ ││ ╰╯   ╰╯ ││ ╰╯   ╰╯ ││ ╰ 
//    0.00 ┤   ╰╯         ╰╯         ╰╯    

// Alias: bounce()

// Scale values from an input range to output range
Util.map([0, [1, [2, 3]], 4], 0, 4, -1, 1);
//=> [ -1, [ -0.5, [ 0, 0.5 ] ], 1 ] 

// Alias: scale()
```

Basic arithmetic methods that accept n-dimensional arrays in both arguments. Outputlength is always the length of the longest list. 

```js
// Add two arrays sequentially
Util.add([1, 2, 3, 4], [1, 2, 3]);
//=> [ 2, 4, 6, 5 ] 

// Works with n-dimensional arrays
Util.add([1, [2, 3]], [10, [20, 30, 40]]);
//=> [ 11, [ 22, 33, 42 ] ] 

// Subtract two arrays sequentially
Util.subtract([1, 2, 3, 4], [1, 2, 3]);
//=> [ 0, 0, 0, 3 ] 

Util.sub([1, [2, 3]], [10, [20, 30, 40]]);
//=> [ -9, [ -18, -27, -38 ] ] 

// Multiply two arrays sequentially
Util.multiply([1, 2, 3, 4], [1, 2, 3]);
//=> [ 1, 4, 9, 4 ] 

Util.mul([1, [2, 3]], [10, [20, 30, 40]]);
//=> [ 10, [ 40, 90, 80 ] ] 

// Divide two arrays sequentially
Util.divide([1, 2, 3, 4], [1, 2, 3]);
//=> [ 1, 1, 1, 4 ] 

Util.div([1, [2, 3]], [10, [20, 30, 40]]);
//=> [ 0.1, [ 0.1, 0.1, 0.05 ] ] 

// Raise one array to the power of another
Util.pow([1, 2, 3, 4], [2, 3, 4]);
//=> [ 1, 8, 81, 16 ] 

Util.pow([1, [2, 3]], [10, [2, 3, 4]]);
//=> [ 1, [ 4, 27, 16 ] ] 

// Return the squareroot of an array
Util.sqrt([2, [9, [16, 25], 144]]);
//=> [ 1.4142135623730951, [ 3, [ 4, 5 ], 12 ] ] 

```

## arrayCalc

Evaluate a function for a multi-dimensional array. Input the left and righthand side of the evaluation and set a function as third argument.

**arguments**
- {Array|Number} -> left hand input array
- {Array|Number} -> right hand input array
- {Function} -> function to Evaluate

```js 

Util.arrayCalc([0, 1, [2, 3]], [[5, 7], 10], (a,b) => { return (a+b)/2 });
//=> [ [ 2.5, 3.5 ], 5.5, [ 3.5, 5 ] ]

Util.arrayCalc([10, 2, 1, 5], [4, 9, 7, 3], (a,b) => { return Math.max(a,b) });
//=> [ 10, 9, 7, 5 ] 

```

## sum

Return the sum of all values in an array. Ignores all non-numeric values.

```js
Util.sum([1, 2, 3, 4]);
//=> 10 

Util.sum([10, 'foo', 11, 'bar', 22]);
//=> 43 
```

## minimum

Return the minimum value from an array (Also part of `.Statistic`)

```js
Util.minimum([-38, -53, -6, 33, 88, 32, -8, 73]);
//=> -53 

// Also works with n-dimensional arrays
Stat.minimum([-38, [-53, [-6, 33], 88, 32], [-8, 73]]);
//=> -53 

// Alias: Util.min()
```

## maximum

Return the maximum value from an array (Also part of `.Statistic`)

```js
Util.maximum([-38, -53, -6, 33, 88, 32, -8, 73]);
//=> 88 

// Also works with n-dimensional arrays
Stat.maximum([-38, [-53, [-6, 33], 88, 32], [-8, 73]]);
//=> 88 

// Alias: Util.max()
```

## normalize

Normalize all the values in an array between 0. and 1.
The highest value will be 1, the lowest value will be 0.

**arguments**
- {Number/Array} -> input values
- {Int/Array} -> normailzed values

```js
Util.normalize([0, 1, 2, 3, 4]);
//=> [ 0, 0.25, 0.5, 0.75, 1 ]

// works with n-dimensional arrays
Util.normalize([5, [12, [4, 17]], 3, 1]);
//=> [ 0.25, [ 0.6875, [ 0.1875, 1 ] ], 0.125, 0 ]  
```

## flatten

Flatten a multidimensional array to a single dimension. Optionally set the depth for the flattening.

**arguments**
- {Array} -> array to flatten
- {Number} -> depth of flatten

```js 
Util.flatten([1, [2, 3, [4, 5], 6], 7]);
// => [ 1, 2, 3, 4, 5, 6, 7 ]
```

## plot

Plot an array of values to the console in the form of an ascii chart and return chart from function. If you just want the chart returned as text and not log to console set { log: false }. Using the asciichart package by x84. 

**arguments**
- {Number/Array/String} -> values to plot
- {Object} -> { log: false } don't log to console and only return
	- -> { data: true } log the original array data
	- -> { decimals: 2 } adjust the number of decimals
	- -> { height: 10 } set a fixed chart line-height
	- -> other preferences for padding, colors, offset. See the asciichart documentation

```js 

Util.plot(Gen.sine(20, 3.1415, 0, 24), { height: 10 });
//=>     23.00 ┼╭─╮    ╭╮    ╭╮     
//       20.70 ┤│ │    ││    │╰╮    
//       18.40 ┤│ │   ╭╯╰╮   │ │    
//       16.10 ┤│ │   │  │  ╭╯ │    
//       13.80 ┤│ ╰╮  │  │  │  │    
//       11.50 ┼╯  │  │  │  │  ╰╮   
//        9.20 ┤   │  │  │  │   │ ╭ 
//        6.90 ┤   │ ╭╯  ╰╮ │   │ │ 
//        4.60 ┤   │ │    │╭╯   │ │ 
//        2.30 ┤   ╰╮│    ││    │ │ 
//        0.00 ┤    ╰╯    ╰╯    ╰─╯  

```

## draw

Draw a grayscale ascii character image of the input 2D-array to the console and return drawing as a string. If you just want the graph returned as string and not log to console set `{ log: false }`. If you want to print using a characterset under ascii-code 256 use `{ extend: false }`. For error reporting when values are `NaN` use `{ error: true }`.

**arguments**

- {Array/2D-Array} -> values to draw
- {Object} -> preferences
	- -> { log: false } don't log to console and only return
	- -> { extend: true } use extended ascii characters
	- -> { error: false } use error character for error reporting

```js 

let drawing = [];
Rand.seed(628);
for (let i=0; i<10; i++){
	drawing.push(Rand.drunk(42, 5));
}
Util.draw(drawing);

// ░░▒░▒▒▓██▓▒▓▒▒▒▓▓▓█▓███▓▒▓▓█▓██▓▒▓▓██▓█▓▒▒
// ░░░░   ░     ░░        ░░▒▒░░░░░▒▓█▒▒▓█▓▒▒
// ░▒░▒▒▒░░░▒▒█▒▒▒▒▒▒▒▓▒▒▒▒▒▒▒▓▒▒▒▒▒▓██▓▓▓▒▒░
// ▒░░    ░  ░▒░░░    ░           ░        ░▒
// ▒▓█▓▓▓█▓▒▒▒▓▓▓██▓▓▓▒▒░░▒░▒░░▒░░  ░▒▒▓▓██▓▓
// ▒░▒▓▒▓▒░▒░ ░░░░░   ░▒▓▓▓▓▒░▒▒░░░░░░░░░    
// ░░░░░      ░        ░      ░    ░░░▒▒░░ ░░
// ░ ░░░   ░░░▒░▒▒░▒▒▓█▒▒▒▒▒▒▒░░▒░░░░░ ░░    
// ░▒░░░░▒▓█▓▒▒▒░ ░░ ░▒░░░    ░▒▒▒▒▒▒▓█▓▓█▓▒█
// ░   ░░░░▒▒▒░░  ░▒▒▒▒▒▒▒▒▒░▒▒▓█▓▒▒░░░░░    

let harmonics = [];
for (let i=0; i<10; i++){
	harmonics.push(Gen.sine(42, i+1));
}
Util.draw(harmonics, { extend: false });

// --==+++########+++==---..              ..-
// -=++####+=--.       .-=++####+=--.       .
// -=+##+=-.    .-=+##+=-.    .-=+##+=-.    .
// -+##+-.   .=+##=-    -+##+-.   .=+##=-    
// -+#+-   .=##=.   -+#+-   -+##=.  .=##+-   
// -+#=.  -+#=.  -+#=.  -+#=.  -+#=.  -+#=.  
// -##-  -##-  -##-  -##-  -##-  -##-  -##-  
// -#+. .+#-  +#-  =#=  -#+. .+#-  +#-  =#=  
// -#=  =#- .++. -#=  =#- .++. -#=  =#- .++. 
// -#- .#=  ++  +#. =#- -#- .#=  ++  +#. =#- 

```