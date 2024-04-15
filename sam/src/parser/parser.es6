import { BREAK, END } from '../common/constants.es6';
import { PhonemeNameTable } from './tables.es6';
import Parser1 from './parse1.es6';
import Parser2 from './parse2.es6';
import AdjustLengths from './adjust-lengths.es6';
import CopyStress from './copy-stress.es6';
import SetPhonemeLength from './set-phoneme-length.es6';
import InsertBreath from './insert-breath.es6';
import ProlongPlosiveStopConsonantsCode41240 from './prolong-plosive-stop-consonants.es6';

export default function Parser(input) {
  if (!input) {
    return false;
  }

  const stress = [];
  const phonemeLength = [];
  const phonemeIndex = [];

  let pos = 0;
  Parser1(
    input,
    (value) => {
      stress[pos] = 0;
      phonemeLength[pos] = 0;
      phonemeIndex[pos++] = value;
    },
    (value) => {
      stress[pos - 1] = value;
    }
  );
  phonemeIndex[pos] = END;

  if (process.env.DEBUG_SAM === true) {
    printPhonemes(phonemeIndex, phonemeLength, stress);
  }

  const getPhoneme = (pos) => (pos === phonemeIndex.length - 1 ? END : phonemeIndex[pos]);
  const setPhoneme = (pos, value) => {
    if (process.env.DEBUG_SAM === true) {
      console.log(`${pos} CHANGE: ${PhonemeNameTable[phonemeIndex[pos]]} -> ${PhonemeNameTable[value]}`);
    }
    phonemeIndex[pos] = value;
  };
  const insertPhoneme = (pos, value, stressValue, length = 0) => {
    if (process.env.DEBUG_SAM === true) {
      console.log(`${pos} INSERT: ${PhonemeNameTable[value]}`);
    }
    for (let i = phonemeIndex.length - 1; i >= pos; i--) {
      phonemeIndex[i + 1] = phonemeIndex[i];
      phonemeLength[i + 1] = phonemeLength[i];
      stress[i + 1] = stress[i];
    }
    phonemeIndex[pos] = value;
    phonemeLength[pos] = length;
    stress[pos] = stressValue;
  };
  const getStress = (pos) => stress[pos] || 0;
  const setStress = (pos, stressValue) => {
    if (process.env.DEBUG_SAM === true) {
      console.log(
        `${pos} "${PhonemeNameTable[phonemeIndex[pos]]}" SET STRESS: ${stress[pos] || 0} -> ${stressValue}`
      );
    }
    stress[pos] = stressValue;
  };
  const getLength = (pos) => phonemeLength[pos] || 0;
  const setLength = (pos, length) => {
    if (process.env.DEBUG_SAM === true) {
      console.log(
        `${pos} "${PhonemeNameTable[phonemeIndex[pos]]}" SET LENGTH: ${phonemeLength[pos] || 0} -> ${length}`
      );
      if ((length & 128) !== 0) {
        throw new Error('Got the flag 0x80, see CopyStress() and SetPhonemeLength() comments!');
      }
      if (pos < 0 || pos > phonemeIndex.length) {
        throw new Error('Out of bounds: ' + pos);
      }
    }
    phonemeLength[pos] = length;
  };

  Parser2(insertPhoneme, setPhoneme, getPhoneme, getStress);
  CopyStress(getPhoneme, getStress, setStress);
  SetPhonemeLength(getPhoneme, getStress, setLength);
  AdjustLengths(getPhoneme, setLength, getLength);
  ProlongPlosiveStopConsonantsCode41240(getPhoneme, insertPhoneme, getStress);

  for (let i = 0; i < phonemeIndex.length; i++) {
    if (phonemeIndex[i] > 80) {
      phonemeIndex[i] = END;
      break;
    }
  }

  InsertBreath(getPhoneme, setPhoneme, insertPhoneme, getStress, getLength, setLength);

  if (process.env.DEBUG_SAM === true) {
    printPhonemes(phonemeIndex, phonemeLength, stress);
  }

  return phonemeIndex.map((v, i) => [v, phonemeLength[i] || 0, stress[i] || 0]);
}

function printPhonemes(phonemeIndex, phonemeLength, stress) {
  function pad(num) {
    let s = '000' + num;
    return s.substr(s.length - 3);
  }

  console.log('==================================');
  console.log('Internal Phoneme presentation:');
  console.log(' pos  idx  phoneme  length  stress');
  console.log('----------------------------------');
  for (let i = 0; i < phonemeIndex.length; i++) {
    const name = (phoneme) => {
      if (phonemeIndex[i] < 81) {
        return PhonemeNameTable[phonemeIndex[i]];
      }
      if (phoneme === BREAK) {
        return '  ';
      }
      return '??';
    };
    console.log(
      ' %s  %s  %s       %s     %s',
      pad(i),
      pad(phonemeIndex[i]),
      name(phonemeIndex[i]),
      pad(phonemeLength[i] || 0),
      pad(stress[i] || 0)
    );
  }
  console.log('==================================');
}
