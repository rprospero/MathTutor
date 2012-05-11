
function isNumber (n) {
    return !isNaN(parseFloat(n)) && iaFinite(n);
};

function fromInfix (string) {
    stack = [];
    postfix = [];


    console.log(tokens);

    tokens = string.split(" ");

    var i = 0;

    while (i < tokens.length) {	
	console.log(postfix);
	t = tokens[i];
	switch (t) {
	case "(":
	    stack.push(t);
	    break;
	case ")":
	    while(stack.length > 0) {
		head = stack.pop();
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
		head = stack.pop();
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
    postfix.concat(stack.reverse());
    return postfix;
};

function makeExpr (string) {
    var post = fromInfix(string);
    console.log(post);

    var stack = [];
    post.reverse();

    while (post.length > 0) {
	head = post.pop();
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