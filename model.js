//This file contains the data model for the equations

if (typeof Object.create !== 'function') {
    Object.create = function (o) {
	var F = function() {};
	F.prototype = o;
	return new F();
    };
};

Base = {type: "Node"}

Number = Base.create()

Number.type = "Number"
Number.value = 0

Plus = Base.Create()
Plus.left = Number.Create()
Plus.Right = Number.Create()
Plus.combine = function() {
    if(this.left.type !== "Number" || this.right.type !== "Number") {
	return {success: false,
		message: "Cannot add non-Numbers",
		node: this};
    }
    else {
	x = Number.create()
	x.value = this.left.value + this.right.value;
	return {success: true,
		node: x};
    };
};
