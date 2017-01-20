'use strict';


/**
 * Since JS can provide a maximum precision of 53 bits,
 * accurate handling of a 64-bit integer ID returned by the Twitter API can be done only if we treat it as a String.
 *
 * decrementBigInteger accepts the id_str value of a status object, decrements it (by 1) and returns the string.
 * Since there is no conversion to Number, this method accurately decrements the given number.
 *
 * @param {String} bigInt
 */
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