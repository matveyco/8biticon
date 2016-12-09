$('.male').click(function() {
	$('.male').addClass( "focusedmale" );
	$('.female').removeClass( "focusedfemale" );
});

$('.female').click(function() {
	$('.female').addClass( "focusedfemale" );
	$('.male').removeClass( "focusedmale" );
});