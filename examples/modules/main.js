var recipe = require('./recipe/index');

var container = document.getElementById('submarine-recipe-container');

recipe().forEach(function(item, i){
	var el = document.createElement('div');
	el.innerHTML = '<h3>' + (i + 1) + '. ' + item.name + '</h3>'
				  + '<p>' + item.info + '</p>';
	container.appendChild(el);
})