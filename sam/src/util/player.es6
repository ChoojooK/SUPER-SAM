import { textToUint8Array, uint32ToUint8Array, uint16ToUint8Array } from '../util/util.es6';

/**
 * Play an audio buffer.
 *
 * @param {AudioContext} context
 * @param {Float32Array} audiobuffer
 *
 * @return {Promise}
 */
function play(context, audiobuffer) {
  return new Promise((resolve) => {
    const source = context.createBufferSource();
    const soundBuffer = context.createBuffer(1, audiobuffer.length, 22050);
    const buffer = soundBuffer.getChannelData(0);
    for (let i = 0; i < audiobuffer.length; i++) {
      buffer[i] = audiobuffer[i];
    }
    source.buffer = soundBuffer;
    source.connect(context.destination);
    source.onended = () => {
      resolve(true);
    };
    source.start(0);
  });
}

let context = null;

/**
 * Play an audio buffer.
 *
 * @param {Float32Array} audiobuffer
 *
 * @return {Promise}
 */
export function playBuffer(audiobuffer) {
  if (null === context) {
    context = new AudioContext();
  }

  if (!context) {
    if (process.env.NODE_ENV === 'development') {
      throw new Error('No player available!');
    }
    throw new Error();
  }

  return play(context, audiobuffer);
}

/**
 * Convert a Uint8Array wave buffer to a Float32Array WaveBuffer.
 *
 * @param {Uint8Array} buffer
 *
 * @return {Float32Array}
 */
export function uint8ArrayToFloat32Array(buffer) {
  const audio = new Float32Array(buffer.length);
  for (let i = 0; i < buffer.length; i++) {
    audio[i] = (buffer[i] - 128) / 256;
  }
  return audio;
}

/**
 * Render an audio buffer.
 *
 * @param {Uint8Array} audiobuffer
 *
 * @return {void}
 */
export function renderBuffer(audiobuffer) {
  const filename = 'sam.wav';

  // Calculate buffer size.
  const realbuffer = new Uint8Array(
    4 + // "RIFF"
    4 + // uint32 filesize
    4 + // "WAVE"
    4 + // "fmt "
    4 + // uint32 fmt length
    2 + // uint16 fmt
    2 + // uint16 channels
    4 + // uint32 sample rate
    4 + // uint32 bytes per second
    2 + // uint16 block align
    2 + // uint16 bits per sample
    4 + // "data"
    4 + // uint32 chunk length
    audiobuffer.length
  );

  let pos = 0;
  const write = (buffer) => {
    realbuffer.set(buffer, pos);
    pos += buffer.length;
  };

  // RIFF header
  write(textToUint8Array('RIFF')); // chunkID
  write(uint32ToUint8Array(audiobuffer.length + 12 + 16 + 8 - 8)); // ChunkSize
  write(textToUint8Array('WAVE')); // riffType
  // format chunk
  write(textToUint8Array('fmt '));
  write(uint32ToUint8Array(16)); // ChunkSize
  write(uint16ToUint8Array(1)); // wFormatTag - 1 = PCM
  write(uint16ToUint8Array(1)); // channels
  write(uint32ToUint8Array(22050)); // samplerate
  write(uint32ToUint8Array(22050)); // bytes/second
  write(uint16ToUint8Array(1)); // blockalign
  write(uint16ToUint8Array(8)); // bits per sample
  // data chunk
  write(textToUint8Array('data'));
  write(uint32ToUint8Array(audiobuffer.length)); // buffer length
  write(audiobuffer);

  const blob = new Blob([realbuffer], { type: 'audio/vnd.wave' });

  const url = (window.URL || window.webkitURL);
  const fileURL = url.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = fileURL;
  a.target = '_blank';
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  url.revokeObjectURL(fileURL);
}
