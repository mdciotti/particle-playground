import defaults from 'defaults';

export default class Constraint {
	constructor(p1, p2, opts) {
		this.options = defaults(opts, {
			disableSelfCollisions: true
		});
		this.p1 = p1;
		this.p2 = p2;
		p1.constraints.push(this);
		p2.constraints.push(this);
	}

	update() {

	}

	destroy() {
		this.p1.constraints.splice(this.p1.constraints.indexOf(this), 1);
		this.p2.constraints.splice(this.p2.constraints.indexOf(this), 1);
		this.willDelete = true;
	}
}
