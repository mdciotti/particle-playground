export default class Enum {
	constructor(...names) {
		let i = 0;
		names.forEach(n => {
			this[n] = i++;
		});
	}
}

export class TaggedUnion {
	constructor(hash) {
		this._data = [];
		this._current = null;
		this._currentData = null;

		let i = 0;
		for (let key in hash) {
			if (hash.hasOwnProperty(key)) {
				this[key] = i++;
				this._data.push(hash[key]);
			}
		}
		this.setCurrent(0);
	}

	setCurrent(i) {
		if (i >= 0 && i < this._data.length) {
			this._current = i;
			this._currentData = this._data[i];
		}
	}
}