import { END } from '../common/constants.es6';
import { PhonemeNameTable } from './tables.es6';
import { phonemeHasFlag } from './util.es6';
import {
  pR,
  pD,
  pT,
  FLAG_ALVEOLAR,
  FLAG_UNVOICED_STOPCONS,
  FLAG_DIPTHONG,
  FLAG_DIP_YX,
  FLAG_VOWEL
} from './constants.es6';

export default function Parser2(insertPhoneme, setPhoneme, getPhoneme, getStress) {
  const handleUW_CH_J = (phoneme, pos) => {
    switch (phoneme) {
      case 53: {
        if (phonemeHasFlag(getPhoneme(pos - 1), FLAG_ALVEOLAR)) {
          setPhoneme(pos, 16); // UX
        }
        break;
      }
      case 42: {
        insertPhoneme(pos + 1, 43, getStress(pos)); // '**'
        break;
      }
      case 44: {
        insertPhoneme(pos + 1, 45, getStress(pos)); // '**'
        break;
      }
    }
  };

  const changeAX = (position, suffix) => {
    setPhoneme(position, 13); // 'AX'
    insertPhoneme(position + 1, suffix, getStress(position));
  };

  let pos = -1;
  let phoneme;

  while ((phoneme = getPhoneme(++pos)) !== END) {
    if (phoneme === 0) {
      continue;
    }

    if (phonemeHasFlag(phoneme, FLAG_DIPTHONG)) {
      if (process.env.DEBUG_SAM === true) {
        console.log(
          !phonemeHasFlag(phoneme, FLAG_DIP_YX)
            ? `${pos} RULE: insert WX following diphthong NOT ending in IY sound`
            : `${pos} RULE: insert YX following diphthong ending in IY sound`
        );
      }
      insertPhoneme(pos + 1, phonemeHasFlag(phoneme, FLAG_DIP_YX) ? 21 : 20, getStress(pos));
      handleUW_CH_J(phoneme, pos);
      continue;
    }
    if (phoneme === 78) {
      changeAX(pos, 24);
      continue;
    }
    if (phoneme === 79) {
      changeAX(pos, 27);
      continue;
    }
    if (phoneme === 80) {
      changeAX(pos, 28);
      continue;
    }
    if (phonemeHasFlag(phoneme, FLAG_VOWEL) && getStress(pos)) {
      if (!getPhoneme(pos + 1)) {
        phoneme = getPhoneme(pos + 2);
        if (phoneme !== END && phonemeHasFlag(phoneme, FLAG_VOWEL) && getStress(pos + 2)) {
          if (process.env.DEBUG_SAM === true) {
            console.log(`${pos + 2} RULE: Insert glottal stop between two stressed vowels with space between them`);
          }
          insertPhoneme(pos + 2, 31, 0); // 31 = 'Q'
        }
      }
      continue;
    }

    let priorPhoneme = (pos === 0) ? END : getPhoneme(pos - 1);

    if (phoneme === pR) {
      switch (priorPhoneme) {
        case pT: {
          setPhoneme(pos - 1, 42); // 'T*' 'R*' -> 'CH' 'R*'
          break;
        }
        case pD: {
          setPhoneme(pos - 1, 44); // 'J*'
          break;
        }
        default: {
          if (phonemeHasFlag(priorPhoneme, FLAG_VOWEL)) {
            setPhoneme(pos, 18); // 'RX'
          }
        }
      }
      continue;
    }

    if ((phoneme === 24) && phonemeHasFlag(priorPhoneme, FLAG_VOWEL)) {
      setPhoneme(pos, 19); // 'LX'
      continue;
    }

    if (priorPhoneme === 60 && phoneme === 32) {
      setPhoneme(pos, 38);
      continue;
    }

    if (phoneme === 60) {
      let phoneme = getPhoneme(pos + 1);
      if (!phonemeHasFlag(phoneme, FLAG_DIP_YX) && (phoneme !== END)) {
        setPhoneme(pos, 63); // 'GX'
      }
      continue;
    }

    if (phoneme === 72) {
      let Y = getPhoneme(pos + 1);
      if (!phonemeHasFlag(Y, FLAG_DIP_YX) || Y === END) {
        setPhoneme(pos, 75);
        phoneme = 75;
      }
    }

    if (phonemeHasFlag(phoneme, FLAG_UNVOICED_STOPCONS) && (priorPhoneme === 32)) {
      setPhoneme(pos, phoneme - 12);
    } else if (!phonemeHasFlag(phoneme, FLAG_UNVOICED_STOPCONS)) {
      handleUW_CH_J(phoneme, pos);
    }

    if (phoneme === 69 || phoneme === 57) {
      if ((pos > 0) && phonemeHasFlag(getPhoneme(pos - 1), FLAG_VOWEL)) {
        phoneme = getPhoneme(pos + 1);
        if (!phoneme) {
          phoneme = getPhoneme(pos + 2);
        }
        if (phonemeHasFlag(phoneme, FLAG_VOWEL) && !getStress(pos + 1)) {
          if (process.env.DEBUG_SAM === true) {
            console.log(`${pos} Soften T or D following vowel or ER and preceding a pause -> DX`);
          }
          setPhoneme(pos, 30);
        }
      }
      continue;
    }

    if (process.env.DEBUG_SAM === true) {
      console.log(`${pos}: ${PhonemeNameTable[phoneme]}`);
    }
  }
}
