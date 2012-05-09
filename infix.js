
function isNumber (n) {
    return !isNaN(parseFloat(n)) && iaFinite(n);
};

function fromInfix (string) {
    stack = [];
    postfix = [];

    

    tokens = string.split(" ");

    var i = 0;

    while (i < tokens.length) {	
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
    return postfix.concat(stack.reverse());
};