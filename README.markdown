# Features ([Demo](http://css-tricks.github.com/Equalizer/))

* Equalize column heights across multiple rows (originally from [this post](http://css-tricks.com/8401-equal-height-blocks-in-rows/))
* Resize column heights when the page is resized. Can be disabled for fixed width layouts.
* Choose between height (default), outer height or inner height.
* Set a minimum or maximum height of a column, with an css class added when content overflows for additional styling

# Setup

## Header

```html
<!-- Required CSS styling, but do whatever you want with the overflow and other styling -->
<style>
  .overflowed { overflow: auto; }
</style>

<!-- Required script -->
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.6/jquery.min.js"></script>
<script src="js/jquery.equalizer.js"></script>
<script>
$(function() {
  $('.wrapper').equalizer();
});
</script>

```

## Example HTML

```html
<div class="wrapper">
  <div>Block 1</div>
  <div>Block 2</div>
  <div>Block 3</div>
  <div>Block 4</div>
  <div>Block 5</div>
  <div>Block 6</div>
</div>
```

# Usage & Options (defaults)

```javascript
// target the wrapper of all of the elements to equalize,
// in this case the divs inside of .wrapper
$('.wrapper').equalizer({
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
});
```

# Change Log

## Version 1.1 (1/12/2012)

* Big change made in the plugin structure to better allow multiple instances.
  * Changed how the plugin is called. Call the plugin on the wrapper with the jQuery selector within the wrapper. The elements selected by the columns option will be equalized.

		```javascript
		// old format = $('.wrapper > div')
		// new format below
		$('.wrapper').equalizer({
			// find divs that are the immediate children of the wrapper
			columns : '> div'
		});
		```

  * Added a method to resize the columns

		```javascript
		// initialize the plugin
		$('.wrapper').equalizer({ resizable: false });

		// update column heights on button click
		$('button').click(function(){
		  // use the data object
		  $('.wrapper').data('Equalizer').update();
		  // or call the plugin again, any new options will be ignored
		  // $('.wrapper').equalizer();
		});
		```

## Version 1.0.1 (7/14/2011)

* Fixed a problem with adding headers, and headers with custom fonts, inside the blocks.
* Added headers into the demo.

## Version 1.0 (6/6/2011)

* Initial build on Github