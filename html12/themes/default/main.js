// js by davidguoshuang at gmail.com

//hoverClass
jQuery.fn.hoverClass = function(c) {
	return this.each(function(){
		$(this).hover( 
			function() { $(this).addClass(c); },
			function() { $(this).removeClass(c); }
		);
	});
};

//hoverClass
jQuery.fn.focusClass = function(c) {
	$(this).focus(function() { $(this).addClass(c); });
	$(this).blur(function() { $(this).removeClass(c); });
};

function shakeTime(){
	var obj=$('#serverinfo_res');
	if(obj.css('opacity')==0){
		$('#serverinfo_res').animate({opacity:1},500,'swing',shakeTime)
	}else{
		$('#serverinfo_res').delay(1000).animate({opacity:0},500,'swing',shakeTime)
	}
		
}

jQuery(function($){
///////////////////////

$('h2.collapsable .t').click(function(){
	var obj=$(this).parent();
	obj.toggleClass('closed').next().toggleClass('hide');	
	var oStatus=obj.hasClass('closed')?'closed':'opened';	
}).mouseenter(function(){
	$(this).addClass('thover');
}).mouseleave(function(){
	$(this).removeClass('thover');
}).disableSelection()

$('h2.collapsable').hoverClass('chover')

$(':input').addClass('text');

//$('table.gGrid tbody tr').hoverClass('h')
$('table.gGrid tbody tr:odd').addClass('h')

shakeTime();

///////////////////////
})