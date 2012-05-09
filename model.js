//This file contains the data model for the equations

"use strict";

if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        var F = function() {};
        F.prototype = o;
        return new F();
    };
};

var Base = {type:"Node"}

var Number = Object.create(Base);

Number.type = "Number";
Number.value = 0;

var Plus = Object.create(Base);
Plus.type = "Plus";
Plus.left = Object.create(Number);
Plus.right = Object.create(Number);
Plus.combine = function() {
    if(this.left.type !== "Number" || this.right.type !== "Number") {
        return {success: false,
                message: "Cannot add non-Numbers",
                node: this};
    }
    else {
        var x = Object.create(Number)
        x.value = this.left.value + this.right.value;
        return {success: true,
                node: x};
    };
};
