# Submarine Bundler

NOTE: This library is being Open-Sourced after more than 2 years of in house development

File Size: Just `4KB` (145 Lines of Code)

Develop or use common js (CJS) modules, bundle them in your favourite server language and `require` them in browsers.

### Usage

#### items/cheese.js
```javascript
// file: modules/items/cheese.js
module.exports = {
	name: 'Cheese',
	// ...
};
```

#### recipe/index.js
```javascript
// file: modules/recipe/index.js
var cheese = require('../items/cheese');
// ...

module.exports = function(){
	return [
		cheese,
		// ...
	];
}
```

#### recipe.html
```html
<script src="bundled.js.php"></script>
<script>
	var recipe = require('recipe/index');
	console.log(recipe());
</script>
```

### Pretty familiar? Sweet! How is it bundled?

With the help of the server side language you are using, you will be creating an output similar to the following and serve it as a javascript file. Please have a look at `examples` directory for more details.

#### Pseudo Code

```javascript
// file:bundled.js.php

// Send Header Content-Type: application/javascript

// PRINT contents of submarine-bundler.js
// e.g, with PHP
// echo file_get_contents('submarine-bundler.js');

Submarine.register('items/cheese', function(require, module, exports){
	// PRINT contents of file:modules/items/cheese.js
	// e.g, with PHP
	// echo file_get_contents('modules/items/cheese.js');
});
//...
Submarine.register('recipe/index', function(require, module, exports){
	// PRINT contents of file:modules/recipe/index.js
	// e.g, with PHP
	// echo file_get_contents('modules/recipe/index.js');
});
```
