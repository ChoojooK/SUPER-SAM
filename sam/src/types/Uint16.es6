export default class Uint16 {
constructor(value) {
this.set(value || 0);
}

get() {
return this._value;
}

set(value) {
this._value = value & 0xFFFF;
return this;
}

inc(delta = 1) {
this.set(this.get() + delta);
return this;
}

dec(delta = 1) {
this.set(this.get() - delta);
return this;
}

valueOf() {
return this.get();
}

asUint8Array() {
const result = new Uint8Array(2);
result[0] = this._value & 0xFF;
result[1] = (this._value >> 8) & 0xFF;
return result;
}
}
