import { combinedPhonemeLengthTable } from './tables.es6';
import { END } from '../common/constants.es6';

/**
* Change phoneme length dependent on stress.
*
* @param {getPhoneme} getPhoneme Callback for retrieving phonemes.
* @param {getPhonemeStress} getStress Callback for retrieving phoneme length.
* @param {setPhonemeLength} setLength Callback for setting phoneme length.
*
* @return undefined
*/
export default function SetPhonemeLength(getPhoneme, getStress, setLength) {
let position = 0;
let phoneme;
while ((phoneme = getPhoneme(position)) !== END) {
let stress = getStress(position);
let length = combinedPhonemeLengthTable[phoneme] || 0;
if (stress === 0 || stress > 0x7F) {
setLength(position, length & 0xFF);
} else {
setLength(position, length >> 8);
}
position++;
}
}
