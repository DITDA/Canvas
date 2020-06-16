window.scwAjaxPortfolioPlugin = window.scwAjaxPortfolioPlugin || {};

var SEMICOLON = SEMICOLON || {};

let $portfolioAjaxItems			= $('.portfolio-ajax').find('.portfolio-item'),
	$portfolioDetails			= $('#portfolio-ajax-wrap'),
	$portfolioDetailsContainer	= $('#portfolio-ajax-container'),
	$portfolioAjaxLoader		= $('#portfolio-ajax-loader'),
	prevPostPortId				= '';

SEMICOLON._portfolioAjaxloadInit = function(){
	if( $('.portfolio-ajax').length < 1 ){
		return true;
	}

	$('.portfolio-ajax .portfolio-item a.portfolio-ajax-trigger').off( 'click' ).on( 'click', function(e) {
		let portPostId = $(this).parents('.portfolio-item').attr('id');
		if( !$(this).parents('.portfolio-item').hasClass('portfolio-active') ) {
			SEMICOLON._portfolioLoadItem(portPostId, prevPostPortId);
		}
		e.preventDefault();
	});
};

SEMICOLON._portfolionewNextPrev = function( portPostId ){
	let portNext = SEMICOLON._portfolioGetNextItem(portPostId);
	let portPrev = SEMICOLON._portfolioGetPrevItem(portPostId);
	$('#next-portfolio').attr('data-id', portNext);
	$('#prev-portfolio').attr('data-id', portPrev);
};

SEMICOLON._portfolioLoadItem = function( portPostId, prevPostPortId, getIt ){
	if(!getIt) { getIt = false; }
	let portNext = SEMICOLON._portfolioGetNextItem(portPostId);
	let portPrev = SEMICOLON._portfolioGetPrevItem(portPostId);
	if(getIt == false) {
		SEMICOLON._portfolioCloseItem();
		$portfolioAjaxLoader.fadeIn();
		let portfolioDataLoader = $('#' + portPostId).attr('data-loader');
		$portfolioDetailsContainer.load(portfolioDataLoader, { portid: portPostId, portnext: portNext, portprev: portPrev },
		function(){
			SEMICOLON._portfolioInitializeAjax(portPostId);
			SEMICOLON._portfolioOpenItem();
			$portfolioAjaxItems.removeClass('portfolio-active');
			$('#' + portPostId).addClass('portfolio-active');
		});
	}
};

SEMICOLON._portfolioCloseItem = function(){
	if( $portfolioDetails && $portfolioDetails.height() > 32 ) {
		$portfolioAjaxLoader.fadeIn();
		$portfolioDetails.find('#portfolio-ajax-single').fadeOut('600', function(){
			$(this).remove();
		});
		$portfolioDetails.removeClass('portfolio-ajax-opened');
	}
};

SEMICOLON._portfolioOpenItem = function(){
	let noOfImages = $portfolioDetails.find('img').length;
	let noLoaded = 0;

	if( noOfImages > 0 ) {
		$portfolioDetails.find('img').on('load', function(){
			noLoaded++;
			let topOffsetScroll = SEMICOLON.initialize.topScrollOffset();
			if(noOfImages === noLoaded) {
				$portfolioDetailsContainer.css({ 'display': 'block' });
				$portfolioDetails.addClass('portfolio-ajax-opened');
				$portfolioAjaxLoader.fadeOut();
				setTimeout(function(){
					SEMICOLON.widget.loadFlexSlider();
					SEMICOLON.initialize.lightbox({ 'parent': $portfolioDetails });
					SEMICOLON.initialize.resizeVideos();
					SEMICOLON.widget.masonryThumbs();
					$('html,body').stop(true).animate({
						'scrollTop': $portfolioDetails.offset().top - topOffsetScroll
					}, 900, 'easeOutQuad');
				},500);
			}
		});
	} else {
		let topOffsetScroll = SEMICOLON.initialize.topScrollOffset();
		$portfolioDetailsContainer.css({ 'display': 'block' });
		$portfolioDetails.addClass('portfolio-ajax-opened');
		$portfolioAjaxLoader.fadeOut();
		setTimeout(function(){
			SEMICOLON.widget.loadFlexSlider();
			SEMICOLON.initialize.lightbox({ 'parent': $portfolioDetails });
			SEMICOLON.initialize.resizeVideos();
			SEMICOLON.widget.masonryThumbs();
			$('html,body').stop(true).animate({
				'scrollTop': $portfolioDetails.offset().top - topOffsetScroll
			}, 900, 'easeOutQuad');
		},500);
	}
};

SEMICOLON._portfolioGetNextItem = function( portPostId ){
	let portNext = '';
	let hasNext = $('#' + portPostId).next();
	if(hasNext.length != 0) {
		portNext = hasNext.attr('id');
	}
	return portNext;
};

SEMICOLON._portfolioGetPrevItem = function( portPostId ){
	let portPrev = '';
	let hasPrev = $('#' + portPostId).prev();
	if(hasPrev.length != 0) {
		portPrev = hasPrev.attr('id');
	}
	return portPrev;
};

SEMICOLON._portfolioInitializeAjax = function( portPostId ){
	prevPostPortId = $('#' + portPostId);

	$('#next-portfolio, #prev-portfolio').off( 'click' ).on( 'click', function() {
		let portPostId = $(this).attr('data-id');
		$portfolioAjaxItems.removeClass('portfolio-active');
		$('#' + portPostId).addClass('portfolio-active');
		SEMICOLON._portfolioLoadItem(portPostId,prevPostPortId);
		return false;
	});

	$('#close-portfolio').off( 'click' ).on( 'click', function() {
		$portfolioDetailsContainer.fadeOut('600', function(){
			$portfolioDetails.find('#portfolio-ajax-single').remove();
		});
		$portfolioDetails.removeClass('portfolio-ajax-opened');
		$portfolioAjaxItems.removeClass('portfolio-active');
		return false;
	});
};

