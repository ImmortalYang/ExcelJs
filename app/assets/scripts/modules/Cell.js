import $ from 'jquery';

class Cell{
	constructor(row, col, cell){
		// DOM element (td)
		this.el = $(document.createElement('td'));
		this.row = row;
		this.col = col;
		this.data = 0;
		this.formula = null;
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
		// Raised when data has been changed in this cell
		this.dataChangedEv = new CustomEvent(
			'dataChanged',
			{
				detail: {

				},
				cancelable: true,
			});

		this.clickEv = new CustomEvent(
			'cellClicked',
			{
				detail: {
					row: this.row,
					col: this.col,
				}
			});
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
				this.input.removeClass('highlight');
				this.processData(true);
				this.input.val(this.data);
			});
			this.input.focus(() => {
				if(this.formula){
					this.input.addClass('highlight orange');
					this.input.val(this.formula);
				}
				else{
					this.input.addClass('highlight blue');
				}
			});
			this.input.click(() => {
				this.onClick();
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
	processData(addListner){
		this.data = this.input.val();
		// Deal with formulae
		if(this.data.charAt(0) == '='){
			this.formula = this.data;
			// Raise the calc event
			this.onCalculate(addListner);
		}
		else{
			this.formula = null;
		}
		// Rising event to notify subscriber cell(s)
		this.onDataChanged();
	}

	// calc Event dispatch
	onCalculate(addListner){
		// Custome event calc, with argument expression
		this.calcEv = new CustomEvent(
			'calc', 
			{
				detail: {
					expr: this.formula, 
					row: this.row, 
					col: this.col,
					addListner: addListner,
				},
				cancelable: true,
			});
		this.el[0].dispatchEvent(this.calcEv);
	}

	// dataChanged Event dispatch
	onDataChanged(){
		this.el[0].dispatchEvent(this.dataChangedEv);
	}

	onClick(){
		this.clickEv = new CustomEvent(
			'cellClicked',
			{
				detail: {
					row: this.row,
					col: this.col,
				}
			});
		this.el[0].dispatchEvent(this.clickEv);
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
