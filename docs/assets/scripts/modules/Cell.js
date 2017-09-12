import $ from 'jquery';

class Cell{
	constructor(row, col, cell){
		// DOM element (td)
		this.el = $(document.createElement('td'));
		this.row = row;
		this.col = col;
		this.data = 0;
		this.formula = null;
		// Add header text
		if(col == 0){
			this.el.html(row);
		}
		else if(row == 0){
			this.el.html(this.getHeaderText(col));
		}
		// If not header, add input field
		else{
			this.input = $(document.createElement('input'));
			this.el.append(this.input);
		}
		this.events();
	}

	events(){
		if(this.input){
			this.input.focusout(() => {
				this.processData();
				this.input.val(this.data);
			});
			this.input.focus(() => {
				if(this.formula)
					this.input.val(this.formula);
			});
		}
	}

	reCalc(){
		if(this.formula){
			this.onCalculate();
			this.input.val(this.data);
			this.onDataChanged();
		}
	}

	/*
		Process the cell data
	*/
	processData(){
		this.data = this.input.val();
		// Deal with formulae
		if(this.data.charAt(0) == '='){
			this.formula = this.data;
			// Raise the calc event
			this.onCalculate();
		}
		else{
			this.formula = null;
		}
		// Rising event to notify subscriber cell(s)
		this.onDataChanged();
	}

	// calc Event dispatch
	onCalculate(){
		// Custome event calc, with argument expression
		this.calcEv = new CustomEvent(
			'calc', 
			{
				detail: {
					expr: this.formula, 
					row: this.row, 
					col: this.col,
				},
				cancelable: true,
			});
		this.el[0].dispatchEvent(this.calcEv);
	}

	// dataChanged Event dispatch
	onDataChanged(){
		this.dataChangedEv = new CustomEvent(
			'dataChanged',
			{
				detail: {

				},
				cancelable: true,
			});
		this.el[0].dispatchEvent(this.dataChangedEv);
	}

	/*
		Get the header text (A - Z, AA - AZ, etc) from decimal column number (1 - 100)
		@colNo: decimal column number
	*/
	getHeaderText(colNo){
		let letters = " ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		if(colNo % 26 == 0){
			return letters.charAt(colNo / 26 - 1) + letters.charAt(26);
		}
		return letters.charAt(colNo / 26) + letters.charAt(colNo % 26);
	}
}

export default Cell;
