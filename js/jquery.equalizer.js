/*
	Equalizer v1.1

	Original by Chris Coyier: http://css-tricks.com/equal-height-blocks-in-rows/
	from an idea by Stephen Akins: http://stephenakins.blogspot.com/2011/01/uniform-div-heights-for-liquid-css-p.html
	with ideas from Mike Avello: https://github.com/madmike1029/matchHeights
	converted into a plugin with some improvements by Rob Garrison: https://github.com/Mottie
*/

(function($){
$.equalizer = function(el, options){
	var o, base = this;
	base.$el = $(el);
	base.$el.data("equalizer", base);

	base.init = function(){
		base.options = o = $.extend({}, $.equalizer.defaultOptions, options);

		// save columns to equalize
		base.$col = base.$el.find(o.columns);
		var t = base.$col.find('.equalizer-inner').length;

		// Setup sizes
		o.min = parseInt(o.min, 10) || 0;
		o.max = parseInt(o.max, 10) || 0;
		base.hasMax = (o.max === 0) ? false : true;
		base.hasMin = (o.min === 0) ? false : true;
		base.curRowTop = 0; // current row offset top position

		// height to use
		base.useHeight = (/^o/.test(o.useHeight)) ? 'outerHeight' : /^i/.test(o.useHeight) ? 'innerHeight' : 'height';

		if (!t) {
			// wrap content with a span so we can always get the exact height of the content on resize
			// inline styling needed for Chrome; the span must have display:block, or use a div
			base.$col.wrapInner('<span class="equalizer-inner" style="display:block;margin:0;padding:0;" />');
		}

		// throttle window resize if option set
		if (!t && o.resizeable) {
			// throttled resize columns
			$(window).resize(function(){
				clearTimeout(base.throttle);
				base.throttle = setTimeout(function(){
					base.update();
				}, 100);
			});
		}

		base.update();

	};

	base.update = function(){
		base.curMax = o.min; // current max height

		base.$col
		.removeClass(o.overflow) // removed as it may have changed on resize
		.each(function(){
			var $this = $(this),
				$el = $this.find('span.equalizer-inner');
			// find offset (position relative to document)
			base.curTop = $this.offset().top;

			// Check for new row
			if (base.curRowTop !== base.curTop) {
				// New row, so check for max height first
				if (base.hasMax && base.curMax > o.max) {
					base.curMax = o.max;
					base.curRows.addClass(o.overflow);
				}
				// New row found, set the heights of the previous row
				// but ignore the row if not defined (very first element)
				if (base.curRows) { base.curRows.height(base.curMax); }
				// Set the variables for the new row
				base.curMax = $el[base.useHeight]();
				base.curMax = (base.hasMin) ? Math.max(o.min, base.curMax) : base.curMax;
				base.curRowTop = base.curTop;
				base.curRows = $this;
			} else {
				// Same row, continue comparing heights
				base.curMax = Math.max(base.curMax, $el[base.useHeight]());
				// Check limitations
				base.curMax = (base.hasMax && base.curMax > o.max) ?
					o.max :
					(base.hasMin && base.curMax < o.min) ? o.min : base.curMax;
				// another div on the current row, add it to the list
				base.curRows = base.curRows.add($this);
			}
			// catch last row
			if (base.curRows) {
				base.curRows.height(base.curMax);
				if (base.hasMax && base.curMax >= o.max) {
					base.curRows.addClass(o.overflow);
				}
			}
		});
	};

	base.init();
};

$.equalizer.defaultOptions = {
	// height = type of height to use
	// "o" or "outer" = "outerHeight" - includes height + padding + border + margin
	// "i" or "inner" = "innerHeight" - includes height + padding + border
	// default        = "height"      - use just the height
	columns    : '> div',     // elements inside of the wrapper
	useHeight  : 'height',    // height measurement to use
	resizeable : true,        // when true, heights are adjusted on window resize
	min        : 0,           // Minimum height applied to all columns
	max        : 0,           // Max height applied to all columns
	overflow   : 'overflowed' // class applied to columns that are taller than the allowable max
};

$.fn.equalizer = function(options){
	return this.each(function(){
		var equalizer = $(this).data('equalizer');
		// initialize the slider but prevent multiple initializations
		if (!equalizer) {
			(new $.equalizer(this, options));
		} else {
			equalizer.update();
		}
	});
};

// return the equalizer object
$.fn.getequalizer = function(){
	return this.data("equalizer");
};

})(jQuery);
