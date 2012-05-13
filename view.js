
"use strict";

var FONTATTRS = {"font-size":45,fill:"#000"};

function fullBBox(a,b,c) {
    var result = {};
    result.x = Math.min(a.x,b.x,c.x);
    result.y = Math.min(a.y,b.y,c.y);
    result.x2 = Math.max(a.x2,b.x2,c.x2);
    result.y2 = Math.max(a.y2,b.y2,c.y2);
    result.width = a.width + b.width + c.width;
    result.height = Math.max(a.height,b.height,c.height);
    return result;
}
    

var EqElement = {node:Object.create(Base),x:0,y:0}
EqElement.create = function(node,paper) {
    var result = Object.create(EqElement);
    result.paper = paper
    result.node = node;
    result.make();
    if (node.left !== undefined) {
	result.left = EqElement.create(node.left,paper);
    }
    if (node.right !== undefined) {
	result.right = EqElement.create(node.right,paper);
    }
    return result;
}

EqElement.make = function () {
    var t = null;
    if (this.node.text===undefined) {
	t = this.paper.text(0,0,""+this.node.value);
	t.attr(FONTATTRS);
    } else {
	t = this.paper.text(0,0,this.node.text);
	t.attr(FONTATTRS);
	t.attr({fill:"F00"});
    }
	
    var bbox = t.getBBox();
    t.transform("t"+(bbox.width/2)+","+(bbox.height/2));
    this.elem = t;

    var that = this;
    t.click(function () {
	var result = that.node.combine();
	if (result.success) {
	    var transform = that.elem.transform();
	    that.remove();

	    //This code is to copy the new reult code into the main
	    //tree.  Simply resetting that.node doesn't change the
	    //tree for the parent, so we need to do a copy for right now.
	    //There must be a better way to do this.
	    that.node.text = result.node.text;
	    that.node.value = result.node.value;
	    that.node.left = result.node.left;
	    that.node.right = result.node.right;
	    that.node.precedence = result.node.precedence;
	    that.node.type = result.node.type;


	    var temp = EqElement.create(result.node,that.paper);
	    temp.elem.transform(transform);
	    that.elem = temp.elem;
	} else {
	    alert(result.message);
	    console.log(that.node);
	}
    });
}

EqElement.remove = function() {
    this.elem.remove();
    if (this.left !== undefined) {
	this.left.remove();
    }
    if (this.right !== undefined) {
	this.right.remove();
    }
}


EqElement.drawAt = function(x,y) {
    var bbox = null;
    switch (this.node.type) {
    case "Number":
    case "Atom":
	this.elem.transform("t"+x+","+y);
	bbox = this.elem.getBBox();
	return bbox;
	break;    
    case "Plus":
    case "Mult":
	var leftbbox = this.left.drawAt(x,y);
	if (this.left.node.precedence < this.node.precedence) {
	    var left = this.paper.text(x,y,"(")
	    left.attr(FONTATTRS);
	    var left_p_bbox = left.getBBox();
	    leftbbox = this.left.drawAt(x+left_p_bbox.width,y);
	    var right = this.paper.text(x+left_p_bbox.width+
					leftbbox.width,y,")");
	    right.attr(FONTATTRS);
	    leftbbox = fullBBox(left_p_bbox,leftbbox,right.getBBox());
	}
	
	this.elem.transform("t"+(x+leftbbox.width)+","+y)
	var bbox = this.elem.getBBox();

	var rightbbox = this.right.drawAt(x+leftbbox.width+bbox.width,y);
	if (this.right.node.precedence < this.node.precedence) {
	    var x1 = x+leftbbox.width+bbox.width;
	    var left = this.paper.text(x1,y,"(")
	    left.attr(FONTATTRS);
	    var left_p_bbox = left.getBBox();
	    left_p_bbox = left.getBBox();
	    rightbbox = this.right.drawAt(x1+left_p_bbox.width+5,y);
	    var right = this.paper.text(x1+left_p_bbox.width+
					rightbbox.width,y,")");
	    right.attr(FONTATTRS);
	    rightbbox = fullBBox(left_p_bbox,rightbbox,right.getBBox());
	}

	bbox.x = leftbbox.x
	bbox.y = Math.min(leftbbox.y,bbox.y,rightbbox.y);
	bbox.x2 = rightbbox.x2
	bbox.y2 = Math.max(leftbbox.y2,bbox.y2,rightbbox.y2);
	bbox.width = leftbbox.width + bbox.width + rightbbox.width;
	bbox.height = Math.max(leftbbox.height,
			       bbox.height,
			       rightbbox.height);
	return bbox;
//	return fullBBox(leftbbox,bbox,rightbbox);
	break;
    }
    console.log(this.node.type);
}
