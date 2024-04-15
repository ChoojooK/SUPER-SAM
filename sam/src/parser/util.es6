import { phonemeFlags } from './tables.es6';

import { matchesBitmask } from '../util/util.es6';

/**
* Test if a phoneme has the given flag.
*
* @param {number} phoneme The phoneme to test.
* @param {number} flag The flag to test (see constants.es6).
* @returns {boolean} True if the phoneme has the given flag, false otherwise.
*/
export function phonemeHasFlag(phoneme, flag) {
return matchesBitmask(phonemeFlags[phoneme], flag);
}
