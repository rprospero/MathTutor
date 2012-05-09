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
Number.toString = function () {
    return "" + this.value;
};

var Plus = Object.create(Base);
Plus.type = "Plus";
Plus.left = Object.create(Number);
Plus.right = Object.create(Number);
Plus.combine = function () {
    var result = {success: false,
                  message: "Cannot add non-Numbers",
                  node: this};
    if (this.left.type === "Number" && this.right.type === "Number") {
        var x = Object.create(Number);
        x.value = this.left.value + this.right.value;
        result.node = x;
        result.success = true;
        result.message = "Added";
    }
    return result;
};
Plus.toString = function () {
    return this.left.toString() + " + " + this.right.toString();
}

var Mult = Object.create(Plus);
Mult.type = "Mult"
Mult.combine = function () {
    var result = {success: false,
                  message: "Cannot add non-Numbers",
                  node: this};
    if (this.left.type === "Number" && this.right.type === "Number") {
        var x = Object.create(Number);
        x.value = this.left.value * this.right.value;
        result.node = x;
        result.success = true;
        result.message = "Added";
    }
    return result;
};
Mult.toString = function () {
    //FIXME:  This needs parentheses when multiplying addition
    return this.left.toString() + " * " + this.right.toString();
}