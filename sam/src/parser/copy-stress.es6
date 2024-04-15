import { END } from '../common/constants.es6';
import { FLAG_VOWEL, FLAG_CONSONANT } from './constants.es6';
import { phonemeHasFlag } from './util.es6';

/**
 * Iterates through the phoneme buffer, copying the stress value from
 * the following phoneme under the following circumstance:
 *     1. The current phoneme is voiced, excluding plosives and fricatives
 *     2. The following phoneme is voiced, excluding plosives and fricatives, and
 *     3. The following phoneme is stressed
 *
 *  In those cases, the stress value+1 from the following phoneme is copied.
 *
 * For example, the word LOITER is represented as LOY5TER, with a stress
 * of 5 on the diphthong OY. This routine will copy the stress value of 6 (5+1)
 * to the L that precedes it.
 *
 * @param {getPhoneme}       getPhoneme Callback for retrieving phonemes.
 * @param {getPhonemeStress} getStress  Callback for retrieving phoneme stress.
 * @param {setPhonemeStress} setStress  Callback for setting phoneme stress.
 *
 * @return undefined
 */
export default function CopyStress(getPhoneme, getStress, setStress) {
  let position = 0;
  let phoneme;
  while ((phoneme = getPhoneme(position)) !== END) {
    if (phonemeHasFlag(phoneme, FLAG_CONSONANT)) {
      phoneme = getPhoneme(position + 1);
      if ((phoneme !== END) && phonemeHasFlag(phoneme, FLAG_VOWEL)) {
        let stress = getStress(position + 1);
        if ((stress !== 0) && (stress < 0x80)) {
          setStress(position, stress + 1);
        }
      }
    }
    ++position;
  }
}
