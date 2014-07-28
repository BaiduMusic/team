$(function() {
	var $body = $('body')

	$body.on('click', 'nav li:not(.on)', function(e) {
		$(this).addClass('on').siblings().removeClass('on');
		PageTransitions.nextPage($(this).index());
	});

	var PageTransitions = (function() {

		var $main = $( '#pt-main' ),
			$pages = $main.children( '.pt-page' ),
			pagesCount = $pages.length,
			current = 0,
			isAnimating = false,
			endCurrPage = false,
			endNextPage = false,
			// animation end event name
			animEndEventName = 'webkitAnimationEnd',
			// support css animations
			support = true;

		function init() {
			$pages.each( function() {
				var $page = $( this );
				$page.data( 'originalClassList', $page.attr( 'class' ) );
			} );
			var $curPage = $pages.eq( current );
			_.each($curPage.find('.animated'), function(elem) {
				$(elem).addClass($(elem).data('animation'));
			});
			$curPage.addClass( 'pt-page-current' );
		}

		function nextPage(next) {

			if( isAnimating ) {
				return false;
			}

			isAnimating = true;

			var $currPage = $pages.eq( current );

			if (next !== undefined) {
				current = next;
			} else {
				if( current < pagesCount - 1 ) {
					++current;
				}
				else {
					current = 0;
				}
			}

			var $nextPage = $pages.eq( current ).addClass( 'pt-page-current' ),
				outClass = 'pt-page-moveToRight', inClass = 'pt-page-moveFromLeft';

			_.each($nextPage.find('.animated'), function(elem) {
				$(elem).addClass($(elem).data('animation'));
			});

			$currPage.addClass( outClass ).on( animEndEventName, function() {
				$currPage.off( animEndEventName );
				endCurrPage = true;
				if( endNextPage ) {
					onEndAnimation( $currPage, $nextPage );
				}
			} );

			$nextPage.addClass( inClass ).on( animEndEventName, function() {
				$nextPage.off( animEndEventName );
				endNextPage = true;
				if( endCurrPage ) {
					onEndAnimation( $currPage, $nextPage );
				}
			} );

			if( !support ) {
				onEndAnimation( $currPage, $nextPage );
			}

		}

		function onEndAnimation( $outpage, $inpage, $animatedElems ) {
			endCurrPage = false;
			endNextPage = false;
			resetPage( $outpage, $inpage );
			isAnimating = false;
		}

		function resetPage( $outpage, $inpage ) {
			_.each($outpage.find('.animated'), function(elem) {
				$(elem).removeClass($(elem).data('animation'));
			});
			$outpage.attr( 'class', $outpage.data( 'originalClassList' ) );
			$inpage.attr( 'class', $inpage.data( 'originalClassList' ) + ' pt-page-current' );
		}

		return {
			init : init,
			nextPage : nextPage
		};

	})();

	PageTransitions.init();


});