export default class Uint8 {
constructor(value) {
this.set(value || 0);
}

/**
* Retrieve the value.
* @returns {Number}
*/
get() {
return this._value;
}

/**
* Set the value.
*
* @param {Number} value
*
* @returns {Uint8}
*/
set(value) {
this._value = value & 0xFF;
return this;
}

/**
* Increment.
*
* @param {Number} [delta=1]
*
* @returns {Uint8}
*/
inc(delta = 1) {
this.set(this.get() + delta);
return this;
}

/**
* Decrement.
*
* @param {Number} [delta=1]
*
* @returns {Uint8}
*/
dec(delta = 1) {
this.set(this.get() - delta);
return this;
}

valueOf() {
return this.get();
}
}
