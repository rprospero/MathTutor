"use strict";

function isNumber (n) {
    return !isNaN(parseFloat(n)) && iaFinite(n);
};

function fromInfix (string) {
    var stack = [];
    var postfix = [];


    var tokens = string.split(" ");

    var i = 0;

    while (i < tokens.length) {	
	var t = tokens[i];
	switch (t) {
	case "(":
	    stack.push(t);
	    break;
	case ")":
	    while(stack.length > 0) {
		var head = stack.pop();
		if (head !== "(") {
		    postfix.push(head);
		} else{
		    break;
		}
	    }
	    break;
	case "*":
	case "/":
	    stack.push(t);
	    break;
	case "+":
	case "-":
	    while(stack.length > 0) {
		var head = stack.pop();
		if (head === "*" || head === "/" || head === "^") {
		    postfix.push(head);
		} else {
		    stack.push(head);
		    break;
		}
	    }
	    stack.push(t);
	    break;
	default:
	    postfix.push(t);
	    break;
	}
	i += 1;
    }
    return postfix.concat(stack.reverse());
};

function makeExpr (string) {
    var post = fromInfix(string);
    console.log(post);

    var stack = [];
    post.reverse();

    while (post.length > 0) {
	var head = post.pop();
	switch (head) {
	case "+":
	    var p = Object.create(Plus);
	    p.left = stack.pop();
	    p.right = stack.pop();
	    stack.push(p);
	    break;
	case "*":
	    var m = Object.create(Mult);
	    m.left = stack.pop();
	    m.right = stack.pop();
	    stack.push(m);
	    break;
	default:
	    stack.push(makeNumber(head));
	}
    }
    return stack.pop();
};