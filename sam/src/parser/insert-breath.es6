import { BREAK, END } from '../common/constants.es6';
import { FLAG_PUNCT } from './constants.es6';
import { phonemeHasFlag } from './util.es6';

export default function InsertBreath(getPhoneme, setPhoneme, insertPhoneme, setStress, getLength, setLength) {
  let mem54 = 255;
  let len = 0; // mem55
  let index; //variable Y
  let pos = -1;
  while((index = getPhoneme(++pos)) !== END) {
    len += getLength(pos);
    if (len < 232) {
      if (phonemeHasFlag(index, FLAG_PUNCT)) {
        len = 0;
        insertPhoneme(pos + 1, BREAK, 0, 0);
        continue;
      }
      if (index === 0) {
        mem54 = pos;
      }
      continue;
    }
    pos = mem54;
    setPhoneme(pos, 31); // 'Q*' glottal stop
    setLength(pos, 4);
    setStress(pos, 0);
    len = 0;
    insertPhoneme(pos + 1, BREAK, 0, 0);
  }
}
