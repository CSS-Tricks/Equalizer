# Features ([Demo](http://css-tricks.github.com/Equalizer/))

* Equalize column heights across multiple rows (originally from [this post](http://css-tricks.com/8401-equal-height-blocks-in-rows/))
* Resize column heights when the page is resized. Can be disabled for fixed width layouts.
* Choose between height (default), outer height or inner height.
* Set a minimum or maximum height of a column, with an css class added when content overflows for additional styling.
* Set a breakpoint to disable the Equalizer plugin when the wrapping element size is below a set width.

# Documentation

* [Moved to the wiki pages](https://github.com/CSS-Tricks/Equalizer/wiki).

# Change Log

See the [change log](https://github.com/CSS-Tricks/Equalizer/wiki/Change) for a complete list of changes.

## Version 1.2.3 (1/18/2013)

* Updated to use jQuery 1.9.
* Tested successfully with jQuery 2.0 beta 1 (not in IE).
* More tweaks to the manifest file to get it to register with the plugin site.

## Version 1.2.2 (1/18/2013)

* Another attempt to register the plugin - version bump needed.

## Version 1.2.1 (1/18/2013)

* New version labeled to enable updating the [jquery plugin registry](http://plugins.jquery.com/).

## Version 1.2 (1/3/2013)

* Updated demos to use jQuery 1.8+. Also, satisfactorily tested the demos with jQuery 1.9 beta 1.
* Added `breakpoint` and `disabled` options:
  * If the `breakpoint` option contains a value, in pixels, the Equalizer plugin will disable itself when the main wrapper element width is below this value; it's the `.wrapper` in the setup examples.
  * When the breakpoint is reached, the class name from the `disabled` option is applied to the main wrapper element.
  * Added an [adaptive demo](http://css-tricks.github.com/Equalizer/adaptive.html) to show how this works together.
  * If the main wrapper element is the browser window, then you can use [media queries](http://css-tricks.com/css-media-queries/) to change the style of the columns inside the wrapper.
  * Enhancement request from [issue #1](https://github.com/CSS-Tricks/Equalizer/issues/1).
* Added a method to enable or disable the Equalizer plugin.
  * To completely disable or re-enable the Equalizer plugin, trigger the desired event on the wrapper element:

    ```javascript
    // to disable trigger disable.equalizer
    $('.wrapper').trigger('disable.equalizer');
    // use enable.equalizer to make it work again
    $('.wrapper').trigger('enable.equalizer');
    ```

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
