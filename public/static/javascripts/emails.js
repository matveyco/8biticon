function sender() {
	var email = $('#emailfield').val();
	var name = $('#namefield').val();

	if(!email) {
		alert("Please enter email");
		return;
	}
	if(!name) {
		alert("Please enter name");
		return;
	}
	if(!validateEmail(email)) {
		alert("Enter correct e-mail");
		return;
	}

	function validateEmail(email) {
	    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	    return re.test(email);
	}

	var data = {email: email,
				name: name};
	$.post( "/emailswriter", data, function( data ) {
	  if (data == 1) {
	  	$('#emailfield').hide("fast");
	  	$('.coffesubmiter').hide("fast");
	  	$('#namefield').hide("fast", function () {
	  		$('#compliete').show("slow")
	  	});
	  }
	})
}