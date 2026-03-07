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

		// Retire le focus persistant après clic pour garder un hover propre.
		this.blur();

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
		// Toggle de la zone filtres "Projets".
			var $projectsToggle = $('.header-projects-toggle'),
				$galleryFilters = $('#gallery-filters'),
				$folderIcon = $projectsToggle.find('.header-folder-icon i');

			function setProjectsToggleState(isOpen) {
				$galleryFilters.toggleClass('is-collapsed', !isOpen);
				$projectsToggle.toggleClass('is-active', isOpen);
				$projectsToggle.attr('aria-expanded', isOpen ? 'true' : 'false');

				$folderIcon
					.toggleClass('fa-folder', !isOpen)
					.toggleClass('fa-folder-open', isOpen);
			}

			setProjectsToggleState(false);

			$projectsToggle.on('click', function(event) {
	event.preventDefault();
	event.stopPropagation();

	var isOpen = $galleryFilters.hasClass('is-collapsed');
	setProjectsToggleState(isOpen);

	this.blur();
});

$header.on('mouseup mouseleave', '.header-pill', function() {
	this.blur();
});

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


	// Galerie : génération centralisée des projets.
	function escapeHtml(value) {
		return String(value)
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/\"/g, '&quot;')
			.replace(/'/g, '&#039;');
	}

	function renderProjects($container, items) {
		if (!$container.length || !Array.isArray(items))
			return;

		var html = items.map(function(project) {
			var tags = Array.isArray(project.tags) ? project.tags : [];
			var tagValues = tags.map(function(tag) { return tag.value; }).join(',');

			return [
				'<article class="thumb" data-family="' + escapeHtml(project.family) + '" data-tags="' + escapeHtml(tagValues) + '">',
					'<a href="' + escapeHtml(project.full) + '" class="image"><img src="' + escapeHtml(project.thumb) + '" alt="' + escapeHtml(project.alt || project.title) + '" /></a>',
					'<div class="thumb-caption">',
						'<h2>' + escapeHtml(project.title) + '</h2>',
					'</div>',
					'<p>' + escapeHtml(project.description || '') + '</p>',
				'</article>'
			].join('');
		}).join('');

		$container.html(html);
	}

function initGalleryFilters($container) {
	var $filterBar = $('#gallery-filters');
	var $mixToggle = $('.header-mix-toggle');
	var galleryState = {
		allProjects: Array.isArray(window.projects) ? window.projects.slice() : [],
		currentOrder: Array.isArray(window.projects) ? window.projects.slice() : [],
		filteredProjects: [],
		filterType: 'family',
		filterValue: 'all'
	};

	if (!$filterBar.length || !$container.length)
		return;

	function projectMatchesFilter(project, filterType, filterValue) {
		var tags;

		if (filterValue === 'all')
			return true;

		if (filterType === 'family')
			return project.family === filterValue;

		if (filterType === 'tag') {
			tags = Array.isArray(project.tags) ? project.tags : [];
			return tags.some(function(tag) {
				return tag && tag.value === filterValue;
			});
		}

		return true;
	}

	function shuffleArray(items) {
		var shuffled = items.slice();
		var i;
		var j;
		var temp;

		for (i = shuffled.length - 1; i > 0; i--) {
			j = Math.floor(Math.random() * (i + 1));
			temp = shuffled[i];
			shuffled[i] = shuffled[j];
			shuffled[j] = temp;
		}

		return shuffled;
	}

	function updateFilteredProjects() {
		galleryState.filteredProjects = galleryState.currentOrder.filter(function(project) {
			return projectMatchesFilter(
				project,
				galleryState.filterType,
				galleryState.filterValue
			);
		});
	}

	function updateFilterButtons() {
		$filterBar.find('.filter-chip').each(function() {
			var $button = $(this);
			var isActive =
				$button.data('filter-type') === galleryState.filterType &&
				$button.data('filter-value') === galleryState.filterValue;

			$button.toggleClass('is-active', isActive);
		});
	}

		function renderFilteredProjects() {
		renderProjects($container, galleryState.filteredProjects);
		initThumbBackgrounds($container);
		initGalleryLightbox($container);
	}

	function applyFilters() {
		updateFilteredProjects();
		renderFilteredProjects();
		updateFilterButtons();
	}

	function animateMix(callback) {
		$container.addClass('is-mixing');

		window.setTimeout(function() {
			callback();

			window.setTimeout(function() {
				$container.removeClass('is-mixing');
			}, 90);
		}, 60);
	}

	function mixVisibleProjects() {
		var visibleProjects = galleryState.currentOrder.filter(function(project) {
			return projectMatchesFilter(
				project,
				galleryState.filterType,
				galleryState.filterValue
			);
		});

		var shuffledProjects;
		var shuffledIndex = 0;

		if (visibleProjects.length < 2)
			return;

		shuffledProjects = shuffleArray(visibleProjects);

		galleryState.currentOrder = galleryState.currentOrder.map(function(project) {
			if (projectMatchesFilter(project, galleryState.filterType, galleryState.filterValue)) {
				var nextProject = shuffledProjects[shuffledIndex];
				shuffledIndex += 1;
				return nextProject;
			}

			return project;
		});

		applyFilters();
	}

	$filterBar.on('click', '.filter-chip', function() {
		galleryState.filterType = $(this).data('filter-type');
		galleryState.filterValue = $(this).data('filter-value');
		applyFilters();
	});

		$mixToggle.on('click', function(event) {
		event.preventDefault();
		event.stopPropagation();

		animateMix(function() {
			mixVisibleProjects();
		});

		this.blur();
	});

	applyFilters();
}

	function initThumbBackgrounds($container) {
		$container.children('.thumb').each(function() {

			var	$this = $(this),
				$image = $this.find('.image'), $image_img = $image.children('img'),
				x;

			if ($image.length == 0)
				return;

			$image.css('background-image', 'url(' + $image_img.attr('src') + ')');

			if (x = $image_img.data('position'))
				$image.css('background-position', x);

			$image_img.hide();

		});
	}

	function initGalleryLightbox($container) {
		$container.poptrox({
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

		breakpoints.on('<=xsmall', function() {
			if ($container[0] && $container[0]._poptrox)
				$container[0]._poptrox.windowMargin = 0;
		});

		breakpoints.on('>xsmall', function() {
			if ($container[0] && $container[0]._poptrox)
				$container[0]._poptrox.windowMargin = 50;
		});
	}

		renderProjects($main, window.projects || []);
		initThumbBackgrounds($main);
		initGalleryFilters($main);
		initGalleryLightbox($main);

})(jQuery);