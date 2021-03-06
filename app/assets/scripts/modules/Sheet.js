import $ from 'jquery';
import Cell from './Cell';

class Sheet{
	constructor(){
		this.cells = Array(101).fill().map(() => Array(101));
		this.currentCell = null;
		this.operand1 = null;
		this.operand2 = null;
		this.result = null;
		this.operations = {
			'+': (x, y) => x + y,
			'-': (x, y) => x - y,
			'*': (x, y) => x * y,
			'/': (x, y) => x / y,
			'%': (x, y) => x % y,
			'SUM': (args) => args.reduce((a, b) => a + b, 0),
			'AVG': (args) => (args.reduce((a, b) => a + b, 0)) / args.length,
			'MIN': (args) => args.reduce((a, b) => a < b ? a : b),
			'MAX': (args) => args.reduce((a, b) => a > b ? a : b),
			'POW': (args) => Math.pow(args[0], args[1]),
		}
		this.refresh();
		this.events();
	}

	// Refresh the grid and reload cell data
	refresh(){
		this.el = $(document.createElement('table'));
		// Initialize the grid
		for(let i = 0; i <= 100; i++){
			// Create and append row
			let row = document.createElement('tr');
			for(let j = 0; j <= 100; j++){
				// Append cells or load cells data
				if(!this.cells[i][j]){
					let cell = new Cell(i, j, cell);
					cell.el[0].addEventListener('calc', (e) => this.calcEventHandler(e));
					cell.el[0].addEventListener('cellClicked', (e) => this.cellClickEventHandler(e));

					this.cells[i][j] = cell;
				}
				$(row).append((this.cells[i][j]).el);	
			}
			this.el.append(row);
		}
	}

	changeFont(fontName){
		if(this.currentCell){
			this.currentCell.el.toggleClass(fontName);
			// if(fontName === 'highlight'){
			// 	if(this.currentCell.formula){
			// 		this.currentCell.el.toggleClass('orange');
			// 	}
			// 	else{
			// 		this.currentCell.el.toggleClass('blue');
			// 	}
			// }
		}
	}

	calcEventHandler(e){
		this.currentCell = this.cells[e.detail.row][e.detail.col];
		this.currentCell.data = this.parse(e.detail.expr.substr(1), e.detail.addListner);
	}

	dataChangedEventHandler(e, row, col){
		console.log(row);
		console.log(col);
		this.cells[row][col].reCalc();
	}

	cellClickEventHandler(e){
		this.currentCell = this.cells[e.detail.row][e.detail.col];
	}

	// Parse a string expression and return the calculated result
	parse(str, addListner){
		if(!Array.isArray(str)){
			var strArr = Array.from(str);
		}
		// Function operation
		if(this.isFunction(str)){
			// Range operation
			let args = str.substr(4, str.length - 5).split(':');
			let func = str.substr(0, 3);
			if(args.length == 2){
				let row1 = this.getRowNo(args[0]);
				let row2 = this.getRowNo(args[1]);
				let col1 = this.getColNo(args[0]);
				let col2 = this.getColNo(args[1]);
				
				let fullArgs = new Array();
				let cellToBeCaptured = this.currentCell;

				if(row1 == row2){
					for(let j = Math.min(col1, col2); j <= Math.max(col1, col2); j++){
						fullArgs.push(parseFloat(this.cells[row1][j].data));
						if(addListner){
							//this.cells[row1][j].el[0].removeEventListener('dataChanged', (e) => this.dataChangedEventHandler(e, cellToBeCaptured.row, cellToBeCaptured.col));
							this.cells[row1][j].el[0].addEventListener('dataChanged', 
								(e) => this.dataChangedEventHandler(e, cellToBeCaptured.row, cellToBeCaptured.col),
								{
									once: true,
								}
							);
						}
					}
					return this.operations[func](fullArgs);
				}
				else if(col1 == col2){
					for(let i = Math.min(row1, row2); i <= Math.max(row1, row2); i++){
						fullArgs.push(parseFloat(this.cells[i][col1].data));
						if(addListner){
							this.cells[i][col1].el[0].addEventListener('dataChanged', 
								(e) => this.dataChangedEventHandler(e, cellToBeCaptured.row, cellToBeCaptured.col),
								{
									once: true,
								}
							);
						}
					}
					return this.operations[func](fullArgs);
				}
			}
			else{
				args = str.substr(4, str.length - 5).split(',');
				args.forEach((str) => {
					let row = this.getRowNo(str);
					let col = this.getColNo(str);
					this.cells[row][col].el[0].addEventListener('dataChanged', (e) => this.dataChangedEventHandler(e));
				});
				let fullArgs = args.map((str) => this.parse(str));
				return this.operations[func](fullArgs);
			}
		}
		// Find operator position
		let operatorIndex = strArr.findIndex(this.isBinaryOperator);
		// If no operator found, parse the entire string
		if(operatorIndex === -1){
			this.result = parseFloat(str) || this.parseCellData(str);

		}
		else{
			let operator = str[operatorIndex];
			let operand1 = parseFloat(str.substr(0, operatorIndex)) || this.parseCellData(str.substr(0, operatorIndex));
			let operand2 = this.parse(str.substr(operatorIndex + 1));
			this.result = this.operations[operator](operand1, operand2);
		}
		return this.result;
	}

	// Parse the coordination string of a cell and return the data of that cell
	parseCellData(str){
		if(!Array.isArray(str)){
			var strArr = Array.from(str);
		}
		// Find the first digit
		let firstDigitIndex = strArr.findIndex(this.isDigit);
		
		let rowStr = str.substr(firstDigitIndex);
		let colStr = str.substr(0, firstDigitIndex);
		let row = parseFloat(rowStr);
		if(isNaN(row) || row > 100 || row < 1)
			return NaN;
		let col = this.parseColNo(colStr);
		if(isNaN(col)){
			return NaN;
		}
		// Cell found
		else{
			return this.parse(this.cells[row][col].data);
		}
	}

	// Find if a char is binary operator
	isBinaryOperator(char){
		return char === '+' || char === '-' || char === '*' || char === '/' || char === '%';
	}

	isDigit(char){
		return !isNaN(char);
	}

	isFunction(str){
		if(!isNaN(str))
			return false;
		// Assume function names are always 3 characters
		var funcName = str.substr(0,3);
		return (funcName == 'SUM' || funcName == 'AVG' || funcName == 'MIN' || funcName == 'MAX' || funcName == 'POW') 
				&& str.substr(3, 1) == '(' && str.substr(str.length - 1) == ')';
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

	getRowNo(cellName){
		let firstDigitIndex = Array.from(cellName).findIndex(this.isDigit);
		
		let rowStr = cellName.substr(firstDigitIndex);
		let row = parseFloat(rowStr);
		if(isNaN(row) || row > 100 || row < 1)
			return NaN;
		else 
			return row;
	}

	getColNo(cellName){
		let firstDigitIndex = Array.from(cellName).findIndex(this.isDigit);
		let colStr = cellName.substr(0, firstDigitIndex);
		let col = this.parseColNo(colStr); 
		return col;
	}

	events(){
		
	}
}

export default Sheet;
