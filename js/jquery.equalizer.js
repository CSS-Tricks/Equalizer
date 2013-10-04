/*
	Equalizer v1.2.5

	Original by Chris Coyier: http://css-tricks.com/equal-height-blocks-in-rows/
	from an idea by Stephen Akins: http://stephenakins.blogspot.com/2011/01/uniform-div-heights-for-liquid-css-p.html
	with ideas from Mike Avello: https://github.com/madmike1029/matchHeights
	converted into a plugin with some improvements by Rob Garrison: https://github.com/Mottie
*/
/*jshint browser:true, jquery:true */
;(function($){
"use strict";
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
		base.isEnabled = true; // plugin enabled

		// height to use
		base.useHeight = (/^o/.test(o.useHeight)) ? 'outerHeight' : /^i/.test(o.useHeight) ? 'innerHeight' : 'height';

		if (!t) {
			// wrap content with a span so we can always get the exact height of the content on resize
			// the span must have display:block, or use a div
			base.$col.wrapInner('<span class="equalizer-inner" style="display:block;" />');
		}

		// throttle window resize if option set
		if (!t && o.resizeable) {
			// throttled resize columns
			$(window).resize(function(){
				clearTimeout(base.throttle);
				base.throttle = setTimeout(function(){
					if (o.breakpoint) {
						base.checkBreakpoint();
					}
					base.update();
				}, 100);
			});
		}

		// enable/disable method
		base.$el
			.unbind('enable.equalizer disable.equalizer')
			.bind('enable.equalizer disable.equalizer', function(e){
				base.enable(e.type === 'enable');
			});

		base.checkBreakpoint();
		base.update();

	};

	base.checkBreakpoint = function(){
		var w = o.breakpoint && base.$el.width() || 0;
		if (w && w < o.breakpoint) {
			base.suspend(false);
		} else if (w && base.$el.hasClass(o.disabled) && w > o.breakpoint) {
			base.suspend();
		}
	};

	base.checkBoxSizing = function(){
		var v = (function(version) {
			version[0] = parseInt(version[0], 10);
			return (version[0] > 1) || (version[0] === 1 && parseInt(version[1], 10) >= 8);
		})($.fn.jquery.split("."));
		if (v) { return false; }
		// older versions of jQuery need padding added to the border box to get the correct height
		var i, s = ['boxSizing', 'MozBoxSizing', 'WebkitBoxSizing', 'msBoxSizing'],
			l = s.length;
		for ( i = 0; i < l ; i++ ) {
			if ( base.$col.css(s[i]) === 'border-box') {
				return true;
			}
		}
		return false;
	};

	base.update = function(){
		if (base.$el.hasClass(o.disabled) || !base.isEnabled) { return; }

		// if box-sizing is set to border-box, include the top/bottom padding from the parent.
		base.hasBoxSizing = base.checkBoxSizing();
		base.padding = (base.hasBoxSizing) ? parseInt(base.$col.css('padding-top'), 10) + parseInt(base.$col.css('padding-bottom'), 10) : 0;

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
				if (base.curRows) { base.curRows.height(base.curMax + base.padding); }
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
				base.curRows.height(base.curMax + base.padding);
				if (base.hasMax && base.curMax >= o.max) {
					base.curRows.addClass(o.overflow);
				}
			}
		});
	};

	// suspend equalizer plugin when below the breakpoint
	base.suspend = function(flag){
		if (flag !== false) {
			base.$el.removeClass(o.disabled);
		} else {
			base.$el.addClass(o.disabled);
			base.$col
				.removeClass(o.overflow)
				.css('height', ''); // not using "auto" so it doesn't override css
		}
		base.update();
	};

	base.enable = function(flag){
		base.isEnabled = flag !== false;
		base.suspend(flag);
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
	breakpoint : null,        // if browser less than this width, disable the plugin
	disabled   : 'noresize',  // class applied when browser width is less than the breakpoint value
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
