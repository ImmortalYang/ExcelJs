import $ from 'jquery';
import Sheet from './modules/Sheet';

$(document).ready(function(){
	var sheet = new Sheet();
	$('.root').append(sheet.el);
	// Refresh the spread sheet
	$('#refresh').click(function(){
		sheet.refresh();
		$('.root').append(sheet.el);
	});

});



