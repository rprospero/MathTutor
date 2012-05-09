//This file contains the data model for the equations

"use strict";

if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        var F = function () {};
        F.prototype = o;
        return new F();
    };
}

var Base = {type: "Node"};
Base.toString = function () {return "Error";};

var Number = Object.create(Base);
Number.type = "Number";
Number.value = 0;
Number.precedence = 9000;
Number.toString = function () {
    return "" + this.value;
};

var Atom = Object.create(Base);
Atom.type = "Atom";
Atom.value = "a"
Atom.precedence = 9000;
Atom.toString = function () {
    return this.value;
};

function makeNumber (n) {
    var result = Object.create(Number);
    result.value = n;
    return result;
};

var BinaryOp = Object.create(Base);
BinaryOp.type = "BinaryOp";
BinaryOp.precedence = -1;
BinaryOp.left = Object.create(Number);
BinaryOp.right = Object.create(Number);
BinaryOp.op = function (x,y) { return x; }
BinaryOp.combine = function () {
    var result = {success: false,
                  message: "Cannot add non-Numbers",
                  node: this};
    if (this.left.type === "Number" && this.right.type === "Number") {
        var x = Object.create(Number);
        x.value = this.op(this.left.value,this.right.value);
        result.node = x;
        result.success = true;
        result.message = "Combined";
    }
    return result;
}; 
BinaryOp.text = "op";
BinaryOp.toString = function () {
    var result = "";
    if (this.left.precedence < this.precedence) {
	result = "( " + this.left.toString() + " )";
    } else {
	result = this.left.toString();
    }
    result += " " + this.text + " ";
    if (this.right.precedence < this.precedence) {
	result += "( " + this.right.toString() + " )";
    } else {
	result += this.right.toString();
    }
    return result;
};

var Plus = Object.create(BinaryOp);
Plus.type = "Plus";
Plus.op = function (x,y) { return x+y;};
Plus.text = "+"
Plus.precedence = 0

var Mult = Object.create(BinaryOp);
Mult.type = "Mult";
Mult.op = function (x,y) { return x*y;};
Mult.text = "*"
Mult.precedence = 1