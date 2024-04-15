import {
  signInputTable1,
  signInputTable2,
  stressInputTable,
  flags,
  phonemeLengthTable,
  phonemeStressedLengthTable
} from './tables.es6';

import {
  pR,
  pD,
  pT,
  FLAG_8000,
  FLAG_4000,
  FLAG_FRICATIVE,
  FLAG_LIQUIC,
  FLAG_NASAL,
  FLAG_ALVEOLAR,
  FLAG_0200,
  FLAG_PUNCT,
  FLAG_VOWEL,
  FLAG_CONSONANT,
  FLAG_DIP_YX,
  FLAG_DIPTHONG,
  FLAG_0008,
  FLAG_VOICED,
  FLAG_STOPCONS,
  FLAG_UNVOICED_STOPCONS,
} from '../constants.es6';

import { BREAK, END } from '../../common/constants.es6';

import { text2Uint8Array } from '../../../src/util/util.es6';

function full_match(sign1, sign2) {
  let Y = 0;
  do {
    let A = signInputTable1[Y];

    if (A === sign1) {
      A = signInputTable2[Y];
      if (A !== 42 && A === sign2) {
        return Y;
      }
    }
  } while (++Y !== 81);
  return -1;
}

function wild_match(sign1) {
  let Y = 0;
  do {
    if (signInputTable2[Y] === 42 && signInputTable1[Y] === sign1) {
      return Y;
    }
  } while (++Y !== 81);
  return -1;
}

function Parser1(input, { phonemeindex, stress }) {
  let i;

  for (i = 0; i < 256; i++) {
    stress[i] = 0;
  }

  let sign1;
  let sign2;
  let position = 0;
  let srcpos = 0;
  while ((sign1 = input[srcpos]) !== 155) {
    sign2 = input[++srcpos];
    let match = 0;
    if ((match = full_match(sign1, sign2)) !== -1) {
      phonemeindex[position++] = match;
      ++srcpos;
    } else if ((match = wild_match(sign1)) !== -1) {
      phonemeindex[position++] = match;
    } else {
      match = 8;
      while ((sign1 !== stressInputTable[match]) && (match > 0)) {
        --match;
      }

      if (match === 0) {
        return 0;
      }

      stress[position - 1] = match;
    }
  }

  phonemeindex[position] = END;
  return 1;
}

function Insert({ phonemeindex, phonemeLength, stress }, position, index, length, stressValue) {
  for (let i = 253; i >= position; i--) {
    phonemeindex[i + 1] = phonemeindex[i];
    phonemeLength[i + 1] = phonemeLength[i];
    stress[i + 1] = stress[i];
  }

  phonemeindex[position] = index;
  phonemeLength[position] = length;
  stress[position] = stressValue;
}

function Parser2({ phonemeindex, phonemeLength, stress }) {
  // Rule functions and parsing logic here...
}

function CopyStress({ phonemeindex, stress }) {
  // Copy stress logic here...
}

function SetPhonemeLength({ phonemeindex, phonemeLength, stress }) {
  // Set phoneme length logic here...
}

function AdjustLengths({ phonemeindex, phonemeLength }) {
  // Adjust lengths logic here...
}

export { Parser1, Parser2, CopyStress, SetPhonemeLength, AdjustLengths };
