jquery-box-sizing
=================

Mimmic border-box behavior in IE7. If the current browser supports border-box already, the plugin does nothing.

####Usage

	$(document).ready(function(){
		$('*').boxSizing();
	});


Extras
-------------------

A $.support.boxSizing boolean.

An emPx() plugin for getting the px size of an em.

####Usage
	$('.something').emPx();
	
