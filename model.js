//This file contains the data model for the equations

"use strict";

if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        var F = function () {};
        F.prototype = o;
        return new F();
    };
}

var FONTATTRS = {"font-size":45,fill:"#000"};

var Base = {type: "Node"};
Base.toString = function () {return "Error";};

var Number = Object.create(Base);
Number.type = "Number";
Number.value = 0;
Number.precedence = 9000;
Number.toString = function () {
    return "" + this.value;
};
Number.drawAt = function (paper,x,y) {
    var t = paper.text(x,y,""+this.value);
    t.attr(FONTATTRS);
    var bbox = t.getBBox();
    t.translate(bbox.width/2,bbox.height/2);
    bbox = t.getBBox()
    return bbox;
};

var Atom = Object.create(Base);
Atom.type = "Atom";
Atom.value = "a"
Atom.precedence = 9000;
Atom.toString = function () {
    return this.value;
};
Atom.drawA = function (paper,x,y) {
    var t = paper.text(x,y,""+this.value);
    t.attr(FONTATTRS);
    var bbox = t.getBBox();
    t.translate(bbox.width/2,bbox.height/2);
    bbox = t.getBBox()
    return bbox;
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
BinaryOp.drawAt = function (paper,x,y) {
    if (this.left.precedence < this.precedence) {
	var leftBBox = drawWithParentheses(this.left,paper,x,y);
    } else {
	var leftBBox = this.left.drawAt(paper,x,y)
    }
    
    var op = paper.text(x+leftBBox.width,y,this.text);
    op.attr(FONTATTRS);
    var opBBox = op.getBBox();
    op.translate(opBBox.width/2,opBBox.height/2)
    op.attr({fill: "#F00"});
    opBBox = op.getBBox();

    if (this.right.precedence < this.precedence) {
	var rightBBox = drawWithParentheses(this.right,paper,
					    x+leftBBox.width+opBBox.width,
					    y);
    } else {
	var rightBBox = this.right.drawAt(paper,
					  x+leftBBox.width+opBBox.width,y);
    }
    var width = leftBBox.width + opBBox.width + rightBBox.width;
    var height = leftBBox.height + opBBox.height + rightBBox.height;

    return {x:x,y:y,x2:x+width,y2:y+height,width:width,height:height};
};

function drawWithParentheses (ob,paper,x,y) {
    var left = paper.text(x,y,"(");
    left.attr(FONTATTRS);
    var leftBBox = left.getBBox();
    left.translate(leftBBox.width/2,leftBBox.height/2);
    
    var mainbbox = ob.drawAt(paper,x+leftBBox.width,y);

    var right = paper.text(x+leftBBox.width+mainbbox.width,y,")");
    right.attr(FONTATTRS);
    var rightBBox = right.getBBox();
    right.translate(rightBBox.width/2,rightBBox.height/2);
    rightBBox = right.getBBox();

    return {x:x,y:y,x2:rightBBox.x2,
	    y2:rightBBox.y2,
	    width:rightBBox.x2-x,
	    height:rightBBox.y2-y};
}

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
