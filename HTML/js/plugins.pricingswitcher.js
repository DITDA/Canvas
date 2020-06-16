window.scwPricingSwitcherPlugin = window.scwPricingSwitcherPlugin || {};

var SEMICOLON = SEMICOLON || {};

SEMICOLON._pricingSwitcherFn = function( checkbox, parent, pricing, defClass, actClass ) {
	parent.find('.pts-left,.pts-right').removeClass( actClass ).addClass( defClass );
	pricing.find('.pts-switch-content-left,.pts-switch-content-right').addClass('d-none');

	if( checkbox.filter(':checked').length > 0 ) {
		parent.find('.pts-right').removeClass( defClass ).addClass( actClass );
		pricing.find('.pts-switch-content-right').removeClass('d-none');
	} else {
		parent.find('.pts-left').removeClass( defClass ).addClass( actClass );
		pricing.find('.pts-switch-content-left').removeClass('d-none');
	}
};

SEMICOLON._pricingSwitcherInit = function( $pricingSwitcherEl ){

	$pricingSwitcherEl = $pricingSwitcherEl.filter(':not(.customjs)');

	if( $pricingSwitcherEl.length < 1 ){
		return true;
	}

	$pricingSwitcherEl.each( function(){
		var element		= $(this),
			elCheck		= element.find(':checkbox'),
			elParent	= $(this).parents('.pricing-tenure-switcher'),
			elDefClass	= $(this).attr('data-default-class') || 'text-muted op-05',
			elActClass	= $(this).attr('data-active-class') || 'font-weight-bold',
			elPricing	= $( elParent.attr('data-container') );

		SEMICOLON._pricingSwitcherFn( elCheck, elParent, elPricing, elDefClass, elActClass );

		elCheck.on( 'change', function(){
			SEMICOLON._pricingSwitcherFn( elCheck, elParent, elPricing, elDefClass, elActClass );
		});
	});

};

