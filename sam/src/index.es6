import { PlayBuffer, RenderBuffer } from './util/player.es6';
import TextToPhonemes from './reciter/reciter.es6';
import { SamProcess, SamBuffer } from './sam/sam.es6';

const convert = TextToPhonemes;
const buf8 = SamProcess;
const buf32 = SamBuffer;

/**
* SAM text-to-speech constructor.
* @param {Object} [options]
* @param {Boolean} [options.phonetic=false] Whether the input text is already phonetic.
* @param {Boolean} [options.singmode=false] Whether to enable sing mode.
* @param {Boolean} [options.debug=false] Whether to enable debug mode.
* @param {Number} [options.pitch=64] Pitch value (0-255).
* @param {Number} [options.speed=72] Speed value (0-255).
* @param {Number} [options.mouth=128] Mouth width value (0-255).
* @param {Number} [options.throat=128] Throat width value (0-255).
*/
function SamJs(options) {
const opts = options || {};

const ensurePhonetic = (text, phonetic) => {
if (!(phonetic || opts.phonetic)) {
return convert(text);
}
return text.toUpperCase();
};

/**
* Render the passed text as an 8-bit wave buffer array.
* @param {string} text The text to render or phoneme string.
* @param {boolean} [phonetic] Flag indicating if the input text is already phonetic data.
* @return {Uint8Array|Boolean} The rendered buffer array or false if rendering failed.
*/
this.buf8 = (text, phonetic) => {
return buf8(ensurePhonetic(text, phonetic), opts);
};

/**
* Render the passed text as a 32-bit wave buffer array.
* @param {string} text The text to render or phoneme string.
* @param {boolean} [phonetic] Flag indicating if the input text is already phonetic data.
* @return {Float32Array|Boolean} The rendered buffer array or false if rendering failed.
*/
this.buf32 = (text, phonetic) => {
return buf32(ensurePhonetic(text, phonetic), opts);
};

/**
* Render the passed text as a wave buffer and play it over the speakers.
* @param {string} text The text to render or phoneme string.
* @param {boolean} [phonetic] Flag indicating if the input text is already phonetic data.
* @return {Promise} A promise resolving once the audio playback finishes.
*/
this.speak = (text, phonetic) => {
return PlayBuffer(this.buf32(text, phonetic));
};

/**
* Render the passed text as a wave buffer and download it via URL API.
* @param {string} text The text to render or phoneme string.
* @param {boolean} [phonetic] Flag indicating if the input text is already phonetic data.
*/
this.download = (text, phonetic) => {
RenderBuffer(this.buf8(text, phonetic));
};
}

// Static methods and properties
SamJs.buf8 = buf8;
SamJs.buf32 = buf32;
SamJs.convert = convert;

export default SamJs;
