/**
 * SAM's voice can be altered by changing the frequencies of the
 * mouth formant (F1) and the throat formant (F2). Only the voiced
 * phonemes (5-29 and 48-53) are altered.
 *
 * This returns the three base frequency arrays.
 *
 * @param {Number} mouth  valid values: 0-255
 * @param {Number} throat valid values: 0-255
 *
 * @return {Array}
 */
export default function SetMouthThroat(mouth, throat) {
  const freqdata = [[],[],[]];
  frequencyData.map((v, i) => {
    freqdata[0][i] = v & 0xFF;
    freqdata[1][i] = (v >> 8) & 0xFF;
    freqdata[2][i] = (v >> 16) & 0xFF;
  });

  // recalculate formant frequencies 5..29 for the mouth (F1) and throat (F2)
  for(let pos = 5; pos < 30; pos++) {
    // recalculate mouth frequency
    freqdata[0][pos] = ((mouth * mouthFormants5_29[pos-5]) >> 8) << 1;

    // recalculate throat frequency
    freqdata[1][pos] = ((throat * throatFormants5_29[pos-5]) >> 8) << 1;
  }

  // recalculate formant frequencies 48..53
  for(let pos = 0; pos < 6; pos++) {
    // recalculate F1 (mouth formant)
    freqdata[0][pos+48] = ((mouth * mouthFormants48_53[pos]) >> 8) << 1;
    // recalculate F2 (throat formant)
    freqdata[1][pos+48] = ((throat * throatFormants48_53[pos]) >> 8) << 1;
  }

  return freqdata;
}
