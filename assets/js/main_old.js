/*
	Multiverse by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper');

	// Breakpoints.
		breakpoints({
			xlarge:  [ '1281px',  '1680px' ],
			large:   [ '981px',   '1280px' ],
			medium:  [ '737px',   '980px'  ],
			small:   [ '481px',   '736px'  ],
			xsmall:  [ null,      '480px'  ]
		});

	// Hack: Enable IE workarounds.
		if (browser.name == 'ie')
			$body.addClass('ie');

	// Touch?
		if (browser.mobile)
			$body.addClass('touch');

	// Transitions supported?
		if (browser.canUse('transition')) {

			// Play initial animations on page load.
				$window.on('load', function() {
					window.setTimeout(function() {
						$body.removeClass('is-preload');
					}, 100);
				});

			// Prevent transitions/animations on resize.
				var resizeTimeout;

				$window.on('resize', function() {

					window.clearTimeout(resizeTimeout);

					$body.addClass('is-resizing');

					resizeTimeout = window.setTimeout(function() {
						$body.removeClass('is-resizing');
					}, 100);

				});

		}

	// Scroll back to top.
		$window.scrollTop(0);

	// Panels.
		var $panels = $('.panel');

		$panels.each(function() {

			var $this = $(this),
				$toggles = $('[href="#' + $this.attr('id') + '"]'),
				$closer = $('<div class="closer" />').appendTo($this);

			// Closer.
				$closer
					.on('click', function(event) {
						$this.trigger('---hide');
					});

			// Events.
				$this
					.on('click', function(event) {
						event.stopPropagation();
					})
					.on('---toggle', function() {

						if ($this.hasClass('active'))
							$this.triggerHandler('---hide');
						else
							$this.triggerHandler('---show');

					})
					.on('---show', function() {

						// Hide other content.
							if ($body.hasClass('content-active'))
								$panels.trigger('---hide');

						// Activate content, toggles.
							$this.addClass('active');
							$toggles.addClass('active');

						// Activate body.
							$body.addClass('content-active');

					})
					.on('---hide', function() {

						// Deactivate content, toggles.
							$this.removeClass('active');
							$toggles.removeClass('active');

						// Deactivate body.
							$body.removeClass('content-active');

					});

			// Toggles.
				$toggles
					.removeAttr('href')
					.css('cursor', 'pointer')
					.on('click', function(event) {

						event.preventDefault();
						event.stopPropagation();

						$this.trigger('---toggle');

					});

		});

		// Global events.
			$body
				.on('click', function(event) {

					if ($body.hasClass('content-active')) {

						event.preventDefault();
						event.stopPropagation();

						$panels.trigger('---hide');

					}

				});

			$window
				.on('keyup', function(event) {

					if (event.keyCode == 27
					&&	$body.hasClass('content-active')) {

						event.preventDefault();
						event.stopPropagation();

						$panels.trigger('---hide');

					}

				});

	// Header.
		var $header = $('#header');

		// Hide on scroll, show only when cursor is at the very top of the page.
(function() {
  var HOVER_REVEAL_Y = 24; // px depuis le haut
  var SCROLL_HIDE_Y = 10;  // px de scroll pour cacher
  var lastScrollTop = 0;

  function hideHeader() {
    $header.addClass('is-hidden');
  }

  function showHeader() {
    $header.removeClass('is-hidden');
  }

  // Au scroll: on cache dès qu'on descend, on montre seulement si on revient tout en haut.
  $window.on('scroll', function() {
    var st = $window.scrollTop();

    if (st <= 0) {
      showHeader();
      lastScrollTop = st;
      return;
    }

    // Sur desktop: cache dès qu'on a scrollé.
    if (!$body.hasClass('touch')) {
      if (st > SCROLL_HIDE_Y) hideHeader();
      lastScrollTop = st;
      return;
    }

    // Sur mobile/touch (pas de curseur): petite logique utile
    if (st > lastScrollTop && st > SCROLL_HIDE_Y) hideHeader();  // scroll down
    else showHeader();                                           // scroll up
    lastScrollTop = st;
  });

  // Desktop: réaffiche uniquement si le curseur est dans la zone tout en haut
  $(document).on('mousemove', function(e) {
    if ($body.hasClass('touch')) return;
    if (e.clientY <= HOVER_REVEAL_Y) showHeader();
  });

  // État initial
  if ($window.scrollTop() > SCROLL_HIDE_Y) hideHeader();
})();


		// Links.
			$header.find('a').each(function() {

				var $this = $(this),
					href = $this.attr('href');

				// Internal link? Skip.
					if (!href
					||	href.charAt(0) == '#')
						return;

				// Redirect on click.
					$this
						.removeAttr('href')
						.css('cursor', 'pointer')
						.on('click', function(event) {

							event.preventDefault();
							event.stopPropagation();

							window.location.href = href;

						});

			});

	// Footer.
		var $footer = $('#footer');

		// Copyright.
		// This basically just moves the copyright line to the end of the *last* sibling of its current parent
		// when the "medium" breakpoint activates, and moves it back when it deactivates.
			$footer.find('.copyright').each(function() {

				var $this = $(this),
					$parent = $this.parent(),
					$lastParent = $parent.parent().children().last();

				breakpoints.on('<=medium', function() {
					$this.appendTo($lastParent);
				});

				breakpoints.on('>medium', function() {
					$this.appendTo($parent);
				});

			});

	// Main.
		var $main = $('#main');

		// Thumbs.
			$main.children('.thumb').each(function() {

				var	$this = $(this),
					$image = $this.find('.image'), $image_img = $image.children('img'),
					x;

				// No image? Bail.
					if ($image.length == 0)
						return;

				// Image.
				// This sets the background of the "image" <span> to the image pointed to by its child
				// <img> (which is then hidden). Gives us way more flexibility.

					// Set background.
						$image.css('background-image', 'url(' + $image_img.attr('src') + ')');

					// Set background position.
						if (x = $image_img.data('position'))
							$image.css('background-position', x);

					// Hide original img.
						$image_img.hide();

			});

		// Filters.
			(function() {

				var $filterBar = $('#gallery-filters');

				if ($filterBar.length === 0 || $main.length === 0)
					return;

				var $projects = $main.children('.thumb'),
					$filterButtons = $filterBar.find('[data-filter-type][data-filter-value]'),
					activeFilter = {
						type: 'family',
						value: 'all'
					};

				function normalizeValue(value) {
					return String(value || '').toLowerCase().trim();
				}

				function getProjectTags($project) {
					var rawTags = normalizeValue($project.attr('data-tags'));

					if (!rawTags)
						return [];

					return rawTags.split(',').map(function(tag) {
						return normalizeValue(tag);
					});
				}

				function projectMatches($project, filter) {
					var family = normalizeValue($project.attr('data-family')),
						tags = getProjectTags($project);

					if (filter.value === 'all')
						return true;

					if (filter.type === 'family')
						return family === filter.value;

					if (filter.type === 'tag')
						return tags.indexOf(filter.value) !== -1;

					return true;
				}

				function updateActiveStates() {
					$filterButtons.removeClass('is-active');

					$filterButtons.each(function() {
						var $button = $(this),
							type = normalizeValue($button.attr('data-filter-type')),
							value = normalizeValue($button.attr('data-filter-value'));

						if (type === activeFilter.type && value === activeFilter.value)
							$button.addClass('is-active');

						if (activeFilter.value === 'all' && value === 'all')
							$button.addClass('is-active');
					});

					$main.find('.thumb-tag').removeClass('is-active');

					if (activeFilter.type === 'tag') {
						$main.find('.thumb-tag[data-filter-value="' + activeFilter.value + '"]').addClass('is-active');
					}
				}

				function applyFilter(type, value) {
					activeFilter = {
						type: normalizeValue(type),
						value: normalizeValue(value)
					};

					if (!activeFilter.value)
						activeFilter.value = 'all';

					if (activeFilter.value === 'all')
						activeFilter.type = 'family';

					$projects.each(function() {
						var $project = $(this),
							isVisible = projectMatches($project, activeFilter);

						$project.toggleClass('thumb-is-hidden', !isVisible);
					});

					updateActiveStates();
				}

				$filterBar.on('click', '[data-filter-type][data-filter-value]', function() {
					var $button = $(this);

					applyFilter($button.attr('data-filter-type'), $button.attr('data-filter-value'));
				});

				$main.on('click', '.thumb-tag[data-filter-type="tag"][data-filter-value]', function(event) {
					event.preventDefault();
					event.stopPropagation();

					var $tag = $(this);

					applyFilter('tag', $tag.attr('data-filter-value'));

					if ($filterBar.length) {
						var filterTop = $filterBar.offset().top - 24;
						$('html, body').stop().animate({ scrollTop: filterTop }, 250);
					}
				});

				applyFilter('family', 'all');

			})();



		// Poptrox.
			$main.poptrox({
				baseZIndex: 20000,
				caption: function($a) {

					var s = '';

					$a.nextAll().each(function() {
						s += this.outerHTML;
					});

					return s;

				},
				fadeSpeed: 300,
				onPopupClose: function() { $body.removeClass('modal-active'); },
				onPopupOpen: function() { $body.addClass('modal-active'); },
				overlayOpacity: 0,
				popupCloserText: '',
				popupHeight: 150,
				popupLoaderText: '',
				popupSpeed: 300,
				popupWidth: 150,
				selector: '.thumb > a.image',
				usePopupCaption: true,
				usePopupCloser: true,
				usePopupDefaultStyling: false,
				usePopupForceClose: true,
				usePopupLoader: true,
				usePopupNav: true,
				windowMargin: 50
			});

			// Hack: Set margins to 0 when 'xsmall' activates.
				breakpoints.on('<=xsmall', function() {
					$main[0]._poptrox.windowMargin = 0;
				});

				breakpoints.on('>xsmall', function() {
					$main[0]._poptrox.windowMargin = 50;
				});

})(jQuery);