	// Roman Numerals Utilities
	// Author: HoldOffHunger
	// License: BSD 3-Clause


					// Globals
					// ---------------------------------------------------------
					// ---------------------------------------------------------
					// ---------------------------------------------------------
			
		/* getTimeOutDelay()
		
			Get the delay of the timeout for typing.
		
		*/
			
	function getTimeOutDelay() {
		return 1000;	// 1 seconds
	}
	
		/* processingText()
			
			Get the text to display when the keyword list generator is thinking.
			
		*/
	
	function processingText() {
		return 'Processing';
	}
	
		/* waitingForUserText()
		
			Get the text to display when the keyword list generator is waiting.
		
		*/
	
	function waitingForUserText() {
		return 'Waiting for User';
	}

$(document).ready(function(e){


					// Event and Element Handlers
					// ---------------------------------------------------------
					// ---------------------------------------------------------
					// ---------------------------------------------------------
		
		/* $('.input-area').keyup(function(e) {...})
		
			Run findKeywords() only after so much time has delayed from keyup movements.
		
		*/
		
	var timeout = false;
	
	$('.input-area').keyup(function(e) {
		$('#status-text').text(processingText());
		if(timeout) {
			clearTimeout(timeout);
		}
		timeout = setTimeout(function() {
			convertNumbers();
		}, getTimeOutDelay());
		return true;
	});
	
		/* $('.input-area').click(function(e) {...})
		
			Clear the input area of its default instruction set when input area is clicked.
		
		*/
	
	$('.input-area').click(function(e) {
		return initiateApp();
	});
	
		/* $('.find-keywords-button').click(function(e) {...})
		
			User clicked the "Find Keywords" button.
			
			Regenerate the keyword list.
		
		*/
	
	$('#activate-function').click(function(e) {
		return convertNumbers();
	});
	
	$('#list-numbers').click(function(e) {
		return listNumbers();
	});
	
		/* $('#casing').change(function(e) {...})
		
			User changed the sort order of the keyword lists.
			
			Regenerate the keyword list.
		
		*/
	
	$('#casing').change(function(e) {
		return convertNumbers();
	});
	
		/* initiateApp()
		
			Clear the input area of its default instruction set.
			
			Bound to many event handlers.
		
		*/
		
	var started = false;
	
	function initiateApp() {
		if(!started) {
			$('.input-area').val('');
			started = true;
		}
		
		return true;
	}
});

				// Input Cleanup
				// ---------------------------------------------------------
				// ---------------------------------------------------------
				// ---------------------------------------------------------

	/* getInput()
	
		Get the input source for generating the keyword list.
	
	*/

function getInput() {
	var inputtext = $('.input-area').val();
	var cleantext = cleanupInput({'input':inputtext});
	
	return cleantext;
}

	/* cleanupInput(args)
		
		Cleanup the input from the user.
		
	*/

function cleanupInput(args) {
	var input = formatInput({'input':args.input});
	
	var replacements = getCleanupReplacements();
	
	return replaceBulk({
		'string':input,
		'replacements':replacements,
	});
}

	/* formatInput(args)
	
		Format the input from the user.
		
		Specifically, lowercase and, if necessary, strip HTML.
	
	*/

function formatInput(args) {
	var input = args.input;
	
	input = $('<div/>').html(input).text();
	
	ipnut = $.trim(input).toLowerCase();
	
	return input;
}

	/* getCleanupReplacements()
	
		Get text replacements for cleanup.
	
	*/

function getCleanupReplacements() {
	return {
		"\t":'',
		"\n":'',
		"\r":'',
		"":'',
		"":'',
		"":'',
		"":'',
		
		',':'',
		'!':'',
		';':'',
		':':'',
		'?':'',
		'.':'',
		'(':'',
		')':'',
		'[':'',
		']':'',
		'{':'',
		'}':'',
		'"':'',
		'*':'',
		'•':'',
		'“':'',
		'”':'',
		
		'’':'',
		'`':'',
		
		' \' ':'',
	};
}

	/* replaceBulk(args)
	
		Replace the cleanup replacements with their correct values.
	
	*/

function replaceBulk(args) {
	var solution = args.string;
	var replaceArray = args.replacements;
	var findArray = Object.keys(replaceArray);
	
	var regex = [], map = {}; 
	for(var i = 0; i < findArray.length; i++) {
		var orig = findArray[i];
		regex.push( findArray[i].replace(/([-[\]{}()*+?.\\^$|#,])/g,'\\$1') );
		map[orig] = replaceArray[orig]; 
	}
	regex = regex.join('|');
	solution = solution.replace( new RegExp( regex, 'g' ), function(matched){
		if(map[matched]) {
			return map[matched];
		}
		
		return matched;
	});
	return solution;
}

				// Number-Conversion Logic
				// ---------------------------------------------------------
				// ---------------------------------------------------------
				// ---------------------------------------------------------
	
	/* convertNumbers()
	
		Main function for converting numbers.
	
	*/
			
function convertNumbers() {
	var input = getInput();
	var direction = $('#direction').val();
	
	var convertargs = {
		'number':input,
	};
	
	var finaloutput = '';
	
	if(direction === 'roman-to-integer') {
		finaloutput = convertRomanToInteger(convertargs);
	} else {
		finaloutput = convertIntegerToRoman(convertargs);
	}
	
	finaloutput = formatFinalOutput({'output':finaloutput, 'input':input});
	
	$('.output-area').html(finaloutput);
	$('.output-area').change();
	$('#status-text').text(waitingForUserText());
	
	return true;
}

	/* formatFinalOutput(args)
	
		Given output to display to user, format it.
	
	*/

function formatFinalOutput(args) {
	var finaloutput = args.output;
	
	if(finaloutput === false) {
		return 'invalid input';
	}
	
	if(typeof finaloutput !== 'string') {
		var input = args.input;
		return formatOutputWithLines({'finaloutput':input}) + '<br>' + finaloutput.toLocaleString();
	}
	
	var finaloutputstring = formatOutputWithLines({'finaloutput':finaloutput});
	
	return finaloutputstring;
}

	/* formatOutputWithLines(args)
		
		Given a Roman Numeral value, format it so that it displays the lines/dashes overhead of the number, if applicable.
		
	*/

function formatOutputWithLines(args) {
	var finaloutput = args.finaloutput;
	
	var finaloutputpieces = finaloutput.split('');
	
	var insideoverline = false;
	var finaloutputstring = '';
	
	for(var i = 0; i < finaloutputpieces.length; i++) {
		var finaloutputpiece = finaloutputpieces[i];
		var nextletter = finaloutputpieces[i + 1];
		
		var specialtext = formatOutputWithLines_specialPiece({'piece':finaloutputpiece, 'nextletter':nextletter});
		
		if(specialtext.length !== 0) {
			insideoverline = true;
			finaloutputstring += specialtext;
		} else {
			if(!insideoverline) {
				finaloutputstring += '<span>';
			}
			finaloutputstring += finaloutputpiece;
			finaloutputstring += '</span>';
			insidoverline = false;
		}
	}
	
	if($('#casing').val() === 'upper') {
		finaloutputstring = finaloutputstring.toUpperCase();
	}
	
	return finaloutputstring;
}

	/* formatOutputWithLines_specialPiece(args)
	
		Put the necessary amount of lines or dashes overhead of a Roman Numeral, based on its size.
	
	*/

function formatOutputWithLines_specialPiece(args) {
	var piece = args.piece;
	var nextletter = args.nextletter;
	var output = '';
	
	if(piece == 'o') {
		output += '<span data-letter="' + nextletter + '" class="overline">';
	} else if(piece == 'u') {
		output += '<span data-letter="' + nextletter + '" class="double-overline">';
	} else if(piece == 't') {
		output += '<span data-letter="' + nextletter + '" class="triple-overline">';
	}
	
	return output;
}

	/* convertRomanToInteger(args)
	
		Given a Roman Numeral, convert it to a base-10integer.
	
	*/

function convertRomanToInteger(args) {
	var number = args.number;
	
	var romanvalue = 0;
	var currentvalue = 0;
	var lastvalue = 0;
	var multiplyer = 1;
	
	var numberpieces = number.split('');
	var numberpiecescount = numberpieces.length;
	
	var incrementershash = convertIntegerToRoman_getIncrementersHash();
	
	for(var i = numberpiecescount - 1; i >= 0; i--) {
		var numberpiece = numberpieces[i];
		
		if(!incrementershash[numberpiece]) {
			var previouspiece;
			
			if(numberpieces[i - 1]) {
				previouspiece = numberpieces[i - 1];
			}
			
			if(incrementershash[previouspiece]) {
				multiplyer = incrementershash[previouspiece];
			}
		
			if(numberpiece === 'm') {
				currentvalue = 1000;
			} else if(numberpiece === 'd') {
				currentvalue = 500;
			} else if (numberpiece === 'c') {
				currentvalue = 100;
			} else if (numberpiece === 'l') {
				currentvalue = 50;
			} else if (numberpiece === 'x') {
				currentvalue = 10;
			} else if (numberpiece === 'v') {
				currentvalue = 5;
			} else if (numberpiece === 'i') {
				currentvalue = 1;
			} else {
				return false;
			}
			
			currentvalue *= multiplyer;
			
			if(currentvalue >= lastvalue) {
				romanvalue += currentvalue;
				lastvalue = currentvalue;
			} else {
				romanvalue -= currentvalue;
			}
			
			multiplyer = 1;
		}
	}
	
	return romanvalue;
}

	/* convertIntegerToRoman(args)
	
		Given an Integer (int format), convert it to a Roman Numeral string.
	
	*/

function convertIntegerToRoman(args) {
	var number = args.number;
	
	var numremaining = parseInt(number, 10);
	var romannumber = '';
	
	var incrementers = convertIntegerToRoman_getIncrementers();
	
	var maxincrement = Math.pow(10, ((incrementers.length) * 3) + 2);
	var maxincrementlimit = Math.floor(maxincrement * 9.999999999999);

	if(numremaining > maxincrementlimit) {
		return 'Error - Cannot Convert Greater Than ' + maxincrementlimit;
	}
	
	var calculations = {
		'numremaining':numremaining,
		'romannumber':romannumber,
	};
	
	calculations = convertIntegerToRoman_calculate4PointBlocks({'calculations':calculations, 'incrementers':incrementers, 'maxincrement':maxincrement});
	calculations = convertIntegerToRoman_calculate3PointBlocks({'calculations':calculations});
	
	romannumber = calculations.romannumber;
	
	if(!romannumber) {
		return false;
	}
	
	return romannumber;
}

	/* convertIntegerToRoman_calculate4PointBlocks(args)
	
		Calculate each set of 4 point blocks, in terms of converting from an integer to a Roman numeral.
	
	*/

function convertIntegerToRoman_calculate4PointBlocks(args) {
	var calculations = args.calculations;
	var incrementers = args.incrementers;
	var maxincrement = args.maxincrement;
	
	var incrementcurrent = maxincrement;
	
	for(var i = 0; i < incrementers.length; i++) {
		var incrementer = incrementers[i];
		
		var nextincrementer;
		
		if(incrementers[i + 1]) {
			nextincrementer = incrementers[i + 1];
		} else {
			nextincrementer = '';
		}
		
		var points = [
			incrementer + 'c' + incrementer + 'x' + incrementer + 'c',
			incrementer + 'c' + incrementer + 'l',
			incrementer + 'c' + incrementer +  'x' + incrementer + 'l',
			incrementer + 'c',
		];
		
		calculations = calculate4PointRomanBlock({'calculations':calculations, 'increment':incrementcurrent, 'points':points});
		
		incrementcurrent = incrementcurrent / 10;
		
		points = [
			incrementer + 'x' + incrementer + 'i' + incrementer + 'x',
			incrementer + 'l',
			incrementer + 'x' + incrementer + 'i' + incrementer + 'v',
			incrementer + 'x',
		];
		
		calculations = calculate4PointRomanBlock({'calculations':calculations, 'increment':incrementcurrent, 'points':points});
		
		incrementcurrent = incrementcurrent / 10;
		
		points = [
			incrementer + 'i' + incrementer + 'x',
			incrementer + 'v',
			incrementer + 'i' + incrementer + 'v',
			nextincrementer + 'm',
		];
		
		calculations = calculate4PointRomanBlock({'calculations':calculations, 'increment':incrementcurrent, 'points':points});
		
		incrementcurrent = incrementcurrent / 10;
	}
	
	return calculations;
}

	/* convertIntegerToRoman_calculate3PointBlocks(args)
	
		Calculate each set of 3 point blocks, in terms of converting from an integer to a Roman numeral.
	
	*/

function convertIntegerToRoman_calculate3PointBlocks(args) {
	var calculations = args.calculations;

	calculations = calculate3PointRomanBlock({'calculations':calculations, 'increment':100, 'points':['m', 'd', 'c']});
	calculations = calculate3PointRomanBlock({'calculations':calculations, 'increment':10, 'points':['c', 'l', 'x']});
	calculations = calculate3PointRomanBlock({'calculations':calculations, 'increment':1, 'points':['x', 'v', 'i']});
	
	return calculations;
}

	/* calculate4PointRomanBlock(args)
	
		Given a large Roman Numeral, i.e., a large one, above 1,000, calculate the integer value.
		
		A 4-point-block is lexicographically more complex than the 3-point-block.  The 4-point-block uses more memorization and less logic.
	
	*/

function calculate4PointRomanBlock(args) {
	var calculations = args.calculations;
	var increment = args.increment;
	var points = args.points;
	var numremaining = calculations.numremaining;
	var romannumber = calculations.romannumber;
	
	var nine = 9 * increment;
	var five = 5 * increment;
	var four = 4 * increment;
	var one = 1 * increment;
	
	if(numremaining >= nine) {
		numremaining -= nine;
		romannumber += points[0];
	} else if(numremaining >= five) {
		numremaining -= five;
		romannumber += points[1];
	} else if(numremaining >= four) {
		numremaining -= four;
		romannumber += points[2];
	}
	
	while(numremaining >= one) {
		numremaining -= one;
		romannumber += points[3];
	}
	
	calculations.numremaining = numremaining;
	calculations.romannumber = romannumber;
	
	return calculations;
}

	/* calculate3PointRomanBlock(args)

		Given ordinary Roman Numeral, i.e., a small one, below 1,000, calculate the integer value.
		
		A 3-point-block is lexicographically-simpler than the 4 point-block.  The 3-point-block uses more logic and less memorization.
	
	*/

function calculate3PointRomanBlock(args) {
	var calculations = args.calculations;
	var increment = args.increment;
	var points = args.points;
	var numremaining = calculations.numremaining;
	var romannumber = calculations.romannumber;
	
	var nine = 9 * increment;
	var five = 5 * increment;
	var four = 4 * increment;
	var one = 1 * increment;
	
	if(numremaining >= nine) {
		numremaining -= nine;
		romannumber += points[2] + points[0];
	} else if(numremaining >= five) {
		numremaining -= five;
		romannumber += points[1];
	} else if(numremaining >= four) {
		numremaining -= four;
		romannumber += points[2] + points[1];
	}
	
	while(numremaining >= one) {
		numremaining -= one;
		romannumber += points[2];
	}
	
	calculations.numremaining = numremaining;
	calculations.romannumber = romannumber;
	
	return calculations;
}

	/* convertIntegerToRoman_getIncrementersHash()
	
		Build a hash that represents the values of the Roman numeral prefix multiplyers.
	
	*/

function convertIntegerToRoman_getIncrementersHash() {
	var incrementers = convertIntegerToRoman_getIncrementers();
	var incrementerscount = incrementers.length;
	
	var hash = {};
	
	var maxincrementervalue = Math.pow(10, incrementerscount * 3);
	
	for(var i = 0; i < incrementerscount; i++) {
		var incrementer = incrementers[i];
		
		hash[incrementer] = maxincrementervalue;
		
		maxincrementervalue = maxincrementervalue / 1000;
	}
	
	return hash;
}
				// List Builder
				// ---------------------------------------------------------
				// ---------------------------------------------------------
				// ---------------------------------------------------------

	/* getIgnoreKeywords_romanNumerals_numbersOnly()
	
		Get a list of Roman numerals to ignore.
		
		For example: i, ii, iii, etc..
	
	*/

function listNumbers() {
	var min = parseInt(cleanupInput({'input':$('#input-area-min').val()}), 10);
	var max = parseInt(cleanupInput({'input':$('#input-area-max').val()}), 10);
	
	var direction = $('#direction').val();
	
	var output = '';
	
	var genargs = {
		'min':min,
		'max':max,
	};
	
	if(direction === 'roman-numeral') {
		output = generateRomanNumerals(genargs);
		output = formatRomanNumerals({'output':output});
	} else {
		output = generateIntegerNumbers(genargs);
	}
	
	var finaloutput = output.join("<BR>");
	
	$('.output-area').html(finaloutput);
	$('.output-area').change();
	$('#status-text').text(waitingForUserText());
	
	return true;
}

	/* generateIntegerNumbers(args)
	
		Given a min and a max, return a list of integer numbers bound by that constraint.
	
	*/

function generateIntegerNumbers(args) {
	var min = args.min;
	var max = args.max;
	
	var numbers = [];
	
	for(var i = min; i <= max; i++) {
		numbers.push(i);
	}
	
	return numbers;
}

	/* generateRomanNumerals(args)
	
		Given a min and a max, return a list of Roman Numerals bound by that constraint.
	
	*/

function generateRomanNumerals(args) {
	var min = args.min;
	var max = args.max;
	
	var digit1 = getRomanNumerals_firstDigitValues();
	
	var numerals = digit1;
	
	if(max > 9) {
		var digit2 = getRomanNumerals_secondDigitValues();
		numerals = getIgnoreKeywords_romanNumerals_mergeLists({'mainlist':digit2, 'mergedlist':numerals});
	}
	
	if(max > 99) {
		var digit3 = getRomanNumerals_thirdDigitValues();
		numerals = getIgnoreKeywords_romanNumerals_mergeLists({'mainlist':digit3, 'mergedlist':numerals});
	}
	
	if(max > 999) {
		var digit4 = getRomanNumerals_fourthDigitValues();
		numerals = getIgnoreKeywords_romanNumerals_mergeLists({'mainlist':digit4, 'mergedlist':numerals});
	}
	
	if(max > 9999) {
		var digit5 = getRomanNumerals_fifthDigitValues();
		numerals = getIgnoreKeywords_romanNumerals_mergeLists({'mainlist':digit5, 'mergedlist':numerals});
	}
	
	if(max > 99999) {
		var digit6 = getRomanNumerals_sixthDigitValues();
		numerals = getIgnoreKeywords_romanNumerals_mergeLists({'mainlist':digit6, 'mergedlist':numerals});
	}
	
	if(max > 999999) {
		var digit7 = getRomanNumerals_seventhDigitValues();
		numerals = getIgnoreKeywords_romanNumerals_mergeLists({'mainlist':digit7, 'mergedlist':numerals});
	}
	
	if(max > 9999999) {
		var digit8 = getRomanNumerals_eighthDigitValues();
		numerals = getIgnoreKeywords_romanNumerals_mergeLists({'mainlist':digit8, 'mergedlist':numerals});
	}
	
	var integer = 0;
	
	for(var i = 0; i < numerals.length; i++) {
		if(i in numerals && (integer < min || integer > max)) {
			numerals.splice(i, 1);
			i--;
		}
		integer++;
	}
	
	return numerals;
}

	/* formatRomanNumerals(args)
	
		Given an array of Roman numerals, format each element.
	
	*/

function formatRomanNumerals(args) {
	var output = args.output;
	var formatted = [];
	
	for(var i = 0; i < output.length; i++) {
		var outputpiece = output[i];
		formatted.push(formatOutputWithLines({'finaloutput':outputpiece}));
	}
	
	return formatted;
}

	/* getIgnoreKeywords_romanNumerals_mergeLists(args)
	
		Given two lists of roman numerals, merge them together.
		
		For example: (i)x, (ii)x, (iii)x, (iv)x,... (ix)x. etc..
	
	*/

function getIgnoreKeywords_romanNumerals_mergeLists(args) {
	var mainlist = args.mainlist;
	var mergedlist = args.mergedlist;
	
	var mainlistlength = mainlist.length;
	var mergedlistlength = mergedlist.length;
	
	for(var i = 1; i < mainlistlength; i++) {
		var mainlistitem = mainlist[i];
		for(var j = 0; j < mergedlistlength; j++) {
			var mergedlistitem = mergedlist[j];
			
			mergedlist.push(mainlistitem + mergedlistitem);
		}
	}
	
	return mergedlist;
}

	/* convertIntegerToRoman_getIncrementers()
	
		Get the prefix incrementers, listed in reverse order.
		
		These are the values before a roman number that cause to be multiplied in value and to appear with so-many dashes overhead.
		
		Active, Enabled, and Tested: O, U, T, A. (trillions)
		
		Disabled for Memory Constraints: B, E, F, G, H, J, K, L, N, P, Q, R, S, W, Y, Z.
	
	*/

			// Implemented
			// ---------------------
		// o - overline, *10, 10^1
		// u - overline, *100, 10^2
		// t - overline, *1000, 10^3
		// a - overline, *10^4
		
			// Disabled
			// (to prevent memory
			// overflow issues)
			// ---------------------
		// b - *10^5
		// e - *10^6
		// f - *10^7
		// g - *10^8
		// h - *10^9
		// j - *10^10
		// k - *10^11
		// l - *10^12
		// n - *10^13
		// p - *10^14
		// q - *10^15
		// r - *10^16
		// s - *10^17
		// w - *10^18
		// y - *10^19
		// z - *10^20

function convertIntegerToRoman_getIncrementers() {
	var incrementers = [
		/*
		
		'z',	// *10^20
		'y',	// *10^19
		'w',	// *10^18
		's',	// *10^17
		'r',	// *10^16
		'q',	// *10^15
		'p',	// *10^14
		'n',	// *10^13
		'l',	// *10^12
		'k',	// *10^11
		'j',	// *10^10
		'h',	// *10^9
		'g',	// *10^8
		'f',	// *10^7
		'e',	// *10^6
		'b',	// *10^5
		
		*/
		
		'a',	// *10^4
		't',	// *10^3
		'u',	// *10^2
		'o',	// *10^1
	];
	
	return incrementers;
}

	/* getRomanNumerals_firstDigitValues()
	
		Get the first digit (0-9) values for the Roman Numeral system.
		
		For example: (nothing; i.e., zero), i, ii, iii, etc..
	
	*/

function getRomanNumerals_firstDigitValues() {
	return [
		'',
		'i',
		'ii',
		'iii',
		'iv',
		'v',
		'vi',
		'vii',
		'viii',
		'ix',
	];
}

	/* getRomanNumerals_secondDigitValues()
	
		Get the second digit (00-90) values for the Roman Numeral system.
		
		For example: (nothing; i.e., zero), x (10), xx (20), xxx (30), etc..
	
	*/

function getRomanNumerals_secondDigitValues() {
	return [
		'',
		'x',
		'xx',
		'xxx',
		'xl',
		'l',
		'lx',
		'lxx',
		'lxxx',
		'xc',
	];
}

	/* getRomanNumerals_thirdDigitValues()
	
		Get the third digit (000-900) values for the Roman Numeral system.
		
		For example: (nothing; i.e., zero), c (100), cc (200), ccc (300), etc..
	
	*/

function getRomanNumerals_thirdDigitValues() {
	return [
		'',
		'c',
		'cc',
		'ccc',
		'cd',
		'd',
		'dc',
		'dcc',
		'dccc',
		'cm',
	];
}

	/* getRomanNumerals_fourthDigitValues()
	
		Get the fourth digit (0000-9000) values for the Roman Numeral system.
		
		For example: (nothing; i.e., zero), m (1000), mm (2000), mmm (3000), etc..
	
	*/

function getRomanNumerals_fourthDigitValues() {
	return [
		'',
		'm',
		'mm',
		'mmm',
		'oiov',
		'ov',
		'ovm',
		'ovmm',
		'ovmmm',
		'oiox',
	];
}

	/* getRomanNumerals_fifthDigitValues()
	
		Get the fourth digit (00000-90000) values for the Roman Numeral system.
		
		For example: (nothing; i.e., zero), ox (10000), oxox (20000), oxoxox (30000), etc..
	
	*/

function getRomanNumerals_fifthDigitValues() {
	return [
		'',
		'ox',
		'oxox',
		'oxoxox',
		'oxoiov',
		'ol',
		'olox',
		'oloxox',
		'oloxoxox',
		'oxoc',
	];
}

	/* getRomanNumerals_sixthDigitValues()
	
		Get the fourth digit (000000-900000) values for the Roman Numeral system.
		
		For example: (nothing; i.e., zero), oc (100000), ococ (200000), ocococ (300000), etc..
	
	*/

function getRomanNumerals_sixthDigitValues() {
	return [
		'',
		'oc',
		'ococ',
		'ocococ',
		'ocod',
		'od',
		'odoc',
		'odococ',
		'odocococ',
		'ocom',
	];
}

	/* getRomanNumerals_seventhDigitValues()
	
		Get the fourth digit (0000000-9000000) values for the Roman Numeral system.
		
		For example: (nothing; i.e., zero), om (1000000), omom (2000000), omomom (3000000), etc..
	
	*/

function getRomanNumerals_seventhDigitValues() {
	return [
		'',
		'om',
		'omom',
		'omomom',
		'uiuv',
		'uv',
		'uvui',
		'uvuiui',
		'uvuiuiui',
		'uiux',
	];
}

	/* getRomanNumerals_eighthDigitValues()
	
		Get the fourth digit (00000000-90000000) values for the Roman Numeral system.
		
		For example: (nothing; i.e., zero), om (10000000), omom (20000000), omomom (30000000), etc..
	
	*/

function getRomanNumerals_eighthDigitValues() {
	return [
		'',
		'ux',
		'uxux',
		'uxuxux',
		'uxul',
		'ul',
		'ulux',
		'uluxux',
		'uluxuxux',
		'uxuc',
	];
}
