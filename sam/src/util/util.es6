/**
 * Test if a bit is set.
 *
 * @param {Number} bits The bits.
 * @param {Number} mask The mask to test.
 *
 * @return {boolean} True if the bit is set, otherwise false.
 */
export function matchesBitmask(bits, mask) {
  return (bits & mask) !== 0;
}

/**
 * Convert text to Uint8Array.
 *
 * @param {string} text The text to convert.
 *
 * @return {Uint8Array} The Uint8Array representation of the text.
 */
export function textToUint8Array(text) {
  const buffer = new Uint8Array(text.length);
  text.split('').forEach((e, index) => {
    buffer[index] = e.charCodeAt(0);
  });
  return buffer;
}

/**
 * Convert Uint8Array to text.
 *
 * @param {Uint8Array} buffer The Uint8Array to convert.
 *
 * @return {string} The text representation of the Uint8Array.
 */
export function uint8ArrayToText(buffer) {
  let text = '';
  for (let i = 0; i < buffer.length; i++) {
    text += String.fromCharCode(buffer[i]);
  }
  return text;
}

/**
 * Convert Uint32 to Uint8Array.
 *
 * @param {Number} uint32 The Uint32 value to convert.
 *
 * @return {Uint8Array} The Uint8Array representation of the Uint32 value.
 */
export function uint32ToUint8Array(uint32) {
  const result = new Uint8Array(4);
  result[0] = uint32;
  result[1] = uint32 >> 8;
  result[2] = uint32 >> 16;
  result[3] = uint32 >> 24;
  return result;
}

/**
 * Convert Uint16 to Uint8Array.
 *
 * @param {Number} uint16 The Uint16 value to convert.
 *
 * @return {Uint8Array} The Uint8Array representation of the Uint16 value.
 */
export function uint16ToUint8Array(uint16) {
  const result = new Uint8Array(2);
  result[0] = uint16;
  result[1] = uint16 >> 8;
  return result;
}
