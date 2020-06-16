window.scwInstagramPlugin = window.scwInstagramPlugin || {};

var SEMICOLON = SEMICOLON || {};

SEMICOLON._instagramPhotosInit = function( $instagramPhotosEl ){

	if( $instagramPhotosEl.length < 1 ){
		return true;
	}

	$instagramPhotosEl.each(function() {
		let element		= $(this),
			elUsername	= element.attr('data-user'),
			elLimit		= element.attr('data-count') || 12;

		if( Number( elLimit ) > 12 ) {
			elLimit = 12;
		}

		SEMICOLON._getInstagramPhotos( element, elUsername, elLimit );
	});

};


SEMICOLON._getInstagramPhotos = function( element, username, limit, nextkey = '', images = false ) {

	let newimages = '';

	$.getJSON( 'https://www.instagram.com/'+ username +'/?__a=1'+nextkey, function( instagram ){

		let instaUser		= instagram.graphql.user,
			instaTimeline	= instaUser.edge_owner_to_timeline_media,
			instaPrivate	= instaUser.is_private;

		if( !instaPrivate ) {

			if( images ) {
				images = images.concat( instaTimeline.edges );
			} else {
				images = instaTimeline.edges;
			}

			if( nextkey != '' ) {
				nextkey = '&max_id='+instaTimeline.page_info.end_cursor;
			}

			if( images.length < limit ) {
				images = SEMICOLON._getInstagramPhotos( element, username, limit, nextkey, images );
			}

			if( images.length > 0 ) {
				let html = '';
				for (let i = 0; i < limit; i++) {
					if ( i === limit )
						continue;

					let photo = images[i];

					html = html+'<a class="grid-item" href="https://instagram.com/p/'+ photo.node.shortcode +'" target="_blank"><img src="'+ photo.node.thumbnail_resources[2].src +'" alt="Image"></a>';
				}

				element.html( html ).removeClass('customjs');
				SEMICOLON.widget.masonryThumbs();
			}

		} else {
			console.log( 'Private Account!' );
			return false;
		}

	});

	return newimages;

}
