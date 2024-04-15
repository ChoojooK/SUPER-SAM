import { PlayBuffer, UInt8ArrayToFloat32Array } from '../util/player.es6';
import Parser from '../parser/parser.es6';
import Renderer from '../renderer/renderer.es6';

/**
* Process the input and play the audio buffer.
*
* @param {String} input
*
* @param {object} [options]
* @param {Boolean} [options.singmode] Default false.
* @param {Boolean} [options.debug] Default false.
* @param {Number} [options.pitch] Default 64.
* @param {Number} [options.speed] Default 72.
* @param {Number} [options.mouth] Default 128.
* @param {Number} [options.throat] Default 128.
*
* @return {Promise}
*/
export function SamSpeak(input, options) {
return new Promise((resolve, reject) => {
const buffer = SamBuffer(input, options);
if (buffer instanceof Float32Array) {
PlayBuffer(buffer)
.then(() => resolve())
.catch(() => reject());
} else {
reject();
}
});
}

/**
* Process the input and return the audio buffer.
*
* @param {String} input
*
* @param {object} [options]
* @param {Boolean} [options.singmode] Default false.
* @param {Boolean} [options.debug] Default false.
* @param {Number} [options.pitch] Default 64.
* @param {Number} [options.speed] Default 72.
* @param {Number} [options.mouth] Default 128.
* @param {Number} [options.throat] Default 128.
*
* @return {Float32Array|Boolean}
*/
export function SamBuffer(input, options) {
const buffer = SamProcess(input, options);
if (buffer instanceof Uint8Array) {
return UInt8ArrayToFloat32Array(buffer);
} else {
return false;
}
}

/**
* Process the input and return the audiobuffer.
*
* @param {String} input
*
* @param {object} [options]
* @param {Boolean} [options.singmode] Default false.
* @param {Boolean} [options.debug] Default false.
* @param {Number} [options.pitch] Default 64.
* @param {Number} [options.speed] Default 72.
* @param {Number} [options.mouth] Default 128.
* @param {Number} [options.throat] Default 128.
*
* @return {Uint8Array|Boolean}
*/
export function SamProcess(input, options = {}) {
const parsed = Parser(input);
if (parsed) {
return Renderer(parsed, options.pitch || 64, options.mouth || 128, options.throat || 128, options.speed || 72, options.singmode || false);
} else {
return false;
}
}
