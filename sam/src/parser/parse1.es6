import { PhonemeNameTable, StressTable } from './tables.es6';

function full_match(sign1, sign2) {
  const index = PhonemeNameTable.findIndex(value => value === sign1 + sign2 && value[1] !== '*');
  return index !== -1 ? index : false;
}

function wild_match(sign1) {
  const index = PhonemeNameTable.findIndex(value => value === sign1 + '*');
  return index !== -1 ? index : false;
}

export default function Parser1(input, addPhoneme, addStress) {
  for (let srcPos = 0; srcPos < input.length; srcPos++) {
    if (process.env.DEBUG_SAM === true) {
      const tmp = input.toLowerCase();
      console.log(
        `processing "${tmp.substr(0, srcPos)}%c${tmp.substr(srcPos, 2).toUpperCase()}%c${tmp.substr(srcPos + 2)}"`,
        'color: red;',
        'color: normal;'
      );
    }
    const sign1 = input[srcPos];
    const sign2 = input[srcPos + 1] || '';
    let match;
    if ((match = full_match(sign1, sign2)) !== false) {
      srcPos++; // Skip the second character of the input as we've matched it
      addPhoneme(match);
      continue;
    }
    if ((match = wild_match(sign1)) !== false) {
      addPhoneme(match);
      continue;
    }

    // Search through the stress table backwards to find stress character
    match = StressTable.lastIndexOf(sign1);
    if (match === -1) {
      if (process.env.NODE_ENV === 'development') {
        throw new Error(`Could not parse char ${sign1}`);
      }
      throw new Error();
    }
    addStress(match); // Set stress for prior phoneme
  }
}
