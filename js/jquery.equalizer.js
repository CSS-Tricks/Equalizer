/*
	Equalizer v1.0.1

	Original by Chris Coyier: http://css-tricks.com/equal-height-blocks-in-rows/
	from an idea by Stephen Akins: http://stephenakins.blogspot.com/2011/01/uniform-div-heights-for-liquid-css-p.html
	with ideas from Mike Avello: https://github.com/madmike1029/matchHeights
	converted into a plugin with some improvements by Rob Garrison: https://github.com/Mottie
*/

(function($) {
$.fn.equalizer = function(options) {
	var base = {};
	$('body').data('Equalizer', base);
	base.$el = $(this); // base.$el contains all elements
	base.options = $.extend({}, $.equalizerDefaults, options);

	base.init = function(){
		// Setup sizes
		base.options.min = parseInt(base.options.min, 10) || 0;
		base.options.max = parseInt(base.options.max, 10) || 0;
		base.hasMax = (base.options.max === 0) ? false : true;
		base.hasMin = (base.options.min === 0) ? false : true;
		base.curRowTop = 0; // current row offset top position

		// height to use
		base.useHeight = (/^o/.test(base.options.useHeight)) ? 'outerHeight' : /^i/.test(base.options.useHeight) ? 'innerHeight' : 'height';

		if (base.options.resizeable) {
			// wrap content with a span so we can always get the exact height of the content on resize
			// inline styling needed for Chrome; the span must have display:block, or use a div
			base.$el.wrapInner('<span class="equalizer-inner" style="display:block;margin:0;padding:0;" />');

			// throttled resize columns
			$(window).resize(function(){
				clearTimeout(base.throttle);
				base.throttle = setTimeout(function(){
					base.equalz();
				}, 100);
			});
		}

		base.equalz();

	};

	base.equalz = function(){
		base.curMax = base.options.min; // current max height

		base.$el
		.removeClass(base.options.overflow) // removed as it may have changed on resize
		.each(function(){
			var $this = $(this),
				$el = (base.options.resizeable) ? $this.find('span.equalizer-inner') : $this;
			// find offset (position relative to document)
			base.curTop = $this.offset().top;

			// Check for new row
			if (base.curRowTop !== base.curTop) {
				// New row, so check for max height first
				if (base.hasMax && base.curMax > base.options.max) {
					base.curMax = base.options.max;
					base.curRows.addClass(base.options.overflow);
				}
				// New row found, set the heights of the previous row
				// but ignore the row if not defined (very first element)
				if (base.curRows) { base.curRows.height(base.curMax); }
				// Set the variables for the new row
				base.curMax = $el[base.useHeight]();
				base.curMax = (base.hasMin) ? Math.max(base.options.min, base.curMax) : base.curMax;
				base.curRowTop = base.curTop;
				base.curRows = $this;
			} else {
				// Same row, continue comparing heights
				base.curMax = Math.max(base.curMax, $el[base.useHeight]());
				// Check limitations
				base.curMax = (base.hasMax && base.curMax > base.options.max) ?
					base.options.max : 
					(base.hasMin && base.curMax < base.options.min) ? base.options.min : base.curMax;
				// another div on the current row, add it to the list
				base.curRows = base.curRows.add($this);
			}
			// catch last row
			if (base.curRows) {
				base.curRows.height(base.curMax);
				if (base.hasMax && base.curMax >= base.options.max) {
					base.curRows.addClass(base.options.overflow);
				}
			}
		});
	};
	base.init();
	return this; // maintain chainability
};

$.equalizerDefaults = {
	// height = type of height to use
	// "o" or "outer" = "outerHeight" - includes height + padding + border + margin
	// "i" or "inner" = "innerHeight" - includes height + padding + border
	// default        = "height"      - use just the height
	useHeight : 'height',    // height measurement to use
	resizeable: true,        // when true, heights are adjusted on window resize
	min       : 0,           // Minimum height applied to all columns
	max       : 0,           // Max height applied to all columns
	overflow  : 'overflowed' // class applied to columns that are taller than the allowable max
};

})(jQuery);