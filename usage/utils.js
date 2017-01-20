'use strict';

exports.decrementBigInteger = (bigInt) => {
	if (typeof bigInt !== 'string') {
		throw new Error ('Invalid argument');
	}

	let result = bigInt, i = bigInt.length - 1;

	while (i > -1) {
		if (bigInt [i] === "0") {
			result = result.substring (0, i) + "9" + result.substring (i + 1);
			i--;
		} else {
			result =
				result.substring (0, i) + (parseInt (bigInt [i], 10) - 1).toString () + result.substring (i + 1);
			return result;
		}
	}

	return result;
};