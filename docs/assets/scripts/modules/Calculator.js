

class Calculator{
	constructor(cells){
		this.cells = cells;
		this.operand1 = null;
		this.operand2 = null;
		this.result = null;
		this.operations = {
			'+': (x, y) => x + y,
			'-': (x, y) => x - y,
			'*': (x, y) => x * y,
			'/': (x, y) => x / y,
			'%': (x, y) => x % y,
		}
	}

	parse(str){
		console.log(this.cells[0][0]);
		if(!Array.isArray(str)){
			str = Array.from(str);
		}
		// Find operator position
		let operatorIndex = str.findIndex(this.isBinaryOperator);
		// If no operator found, parse the entire string
		if(operatorIndex === -1){
			this.result = Number.parseFloat(str) || this.parseCellData(str);
		}
		else{
			let operator = str[operatorIndex];
			let operand1 = Number.parseFloat(str.slice(0, operatorIndex));
			let operand2 = this.parse(str.slice(operatorIndex + 1));
			this.result = this.operations[operator](operand1, operand2);
		}
		return this.result;
	}

	// 
	parseCellData(str){
		if(!Array.isArray(str)){
			str = Array.from(str);
		}
		// Find the first digit
		let firstDigitIndex = str.findIndex(this.isDigit);
		let colStr = str.splice(0, firstDigitIndex);
		let rowStr = str.splice(firstDigitIndex);
		let row = Number.parseFloat(rowStr);
		if(isNaN(row) || row > 100 || row < 1)
			return NaN;
		let col = this.parseColNo(colStr);
		return this.parse(this.cells[row][col].data);
	}

	// Find if a char is binary operator
	isBinaryOperator(char){
		return char === '+' || char === '-' || char === '*' || char === '/' || char === '%';
	}

	isDigit(char){
		return char >= '0' && char <= '9';
	}

	// Get the column number from column string e.g. AA
	parseColNo(colStr){
		let result = 0;
		let letters = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		for(let i = 0; i < colStr.length; i++){
			result += Math.pow(26, i) * letters.indexOf(colStr[colStr.length-i-1]);
		}
		if(isNaN(result) || result > 100 || result < 1){
			return NaN;
		}
		else{
			return result;
		}
	}

	events(){
		
	}
}

export default Calculator;
