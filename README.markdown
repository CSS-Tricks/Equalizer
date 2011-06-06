##Features

* Equalize column heights across multiple rows
* Resize column heights when the page is resized. Can be disabled for fixed width layouts.
* Choose between height (default), outer height or inner height.
* Set a minimum or maximum height of a column, with an css class added when content overflows for additional styling

##Setup

###Header

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
  $('.wrapper > div').equalizer();
});
</script>

```

###Example HTML
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

##Usage & Options (defaults)

```javascript
$('.wrapper > div').equalizer({
  // height = type of height to use
  // "o" or "outer" = "outerHeight" - includes height + padding + border + margin
  // "i" or "inner" = "innerHeight" - includes height + padding + border
  // default        = "height"      - use just the height
  useHeight  : 'height',    // height measurement to use
  resizeable : true,        // when true, heights are adjusted on window resize
  min        : 0,           // Minimum height applied to all columns
  max        : 0,           // Max height applied to all columns
  overflow   : 'overflowed' // class applied to columns that are taller than the allowable max
});
```

##Change Log

###Version 1.0 (6/6/2011)

* Initial build on Github