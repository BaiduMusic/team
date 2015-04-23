$(function() {
	var $body = $('body'),
		$navToggle = $('.nav-toggle');

	/* init page transition */
	var PageTransitions = (function() {

		var $main = $( '#pt-main' ),
			$pages = $main.children( '.pt-page' ),
			pagesCount = $pages.length,
			current = 0,
			isAnimating = false,
			endCurrPage = false,
			endNextPage = false,
			// animation end event name
			animEndEventName = 'webkitAnimationEnd mozAnimationEnd animationend',
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

	/* bind events */
	(function() {
		$body.on('click', 'nav li', function(e) {
			if ($body.hasClass('push-toright')) {
				$body.removeClass('push-toright');
				$navToggle.removeClass('active');
			}

			if ($(this).hasClass('on'))
				return false;

			$(this).addClass('on').siblings().removeClass('on');
			PageTransitions.nextPage($(this).index());
		});

		$body.on('click', '.nav-toggle', function(e) {
			$(this).toggleClass('active');
			$body.toggleClass('push-toright');
		});
	})();

	/* init weekly */
	(function() {
		var tpl = (function() {/*
			<ul class="posts">
	            <% _.each(weekly, function(post) { %>
	                <li>
	                    <a href="<%- post.html_url %>" target="_blank"><%- post.name.replace('.md', '') %></a>
	                </li>
	            <% }) %>
	        </ul>
		*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];

		$.ajax({
			url: 'https://api.github.com/repos/Baidu-Music-FE/fe-weekly/contents',
			dataType: 'jsonp'
		}).done(function(rs) {
			var posts = rs.data;
			if (posts.length > 0) {
				_.remove(posts, function(item) {
					return item.name == 'img' || item.name == 'readme.md'
				});
				$('#weekly').append( _.template(tpl, {weekly: posts.reverse()}) )
			}
		});

	})();

});