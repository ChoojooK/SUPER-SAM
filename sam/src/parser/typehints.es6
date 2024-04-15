/**
* Retrieves a phoneme from the buffer.
*
* @callback GetPhoneme
* @param {number} position The position in the phoneme array to get.
* @returns {number}
*/

/**
* Set a phoneme in the buffer.
*
* @callback SetPhoneme
* @param {number} position The position in the phoneme array to set.
* @param {number} phoneme The phoneme to set.
*/

/**
* Insert a phoneme at the given position.
*
* @callback InsertPhoneme
* @param {number} position The position in the phoneme array to insert at.
* @param {number} phoneme The phoneme to insert.
* @param {number} stressValue The stress.
* @param {number} [length=0] The optional phoneme length.
*/

/**
* Set the length for a phoneme in the buffer.
*
* @callback SetPhonemeLength
* @param {number} position The position in the phoneme array to set.
* @param {number} length The phoneme length to set.
*/

/**
* Retrieve the length for a phoneme from the buffer.
*
* @callback GetPhonemeLength
* @param {number} position The position in the phoneme array to get.
* @returns {number}
*/

/**
* Set the stress for a phoneme in the buffer.
*
* @callback SetPhonemeStress
* @param {number} position The position in the phoneme array to set.
* @param {number} stress The phoneme stress to set.
*/

/**
* Retrieve the stress for a phoneme from the buffer.
*
* @callback GetPhonemeStress
* @param {number} position The position in the phoneme array to get.
* @returns {number}
*/
