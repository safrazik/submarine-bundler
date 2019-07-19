<?php

$baseDir = __DIR__.'/../..';

if(!(isset($_GET['script']) && $_GET['script'])){
	echo file_get_contents($baseDir.'/examples/recipe.html');
	exit;
}

function getScripts($baseFile, $dir, $modules){

	$script = '"use strict";'."\n\n";

	$script .= file_get_contents($baseFile)."\n\n";

	foreach ($modules as $moduleName) {
		$file = $dir.'/'.$moduleName.'.js';
		$script .= '// Module '.$moduleName."\n".'Submarine.register(\''.$moduleName.'\', function(require, exports, module){'
		."\n\n".file_get_contents($file)."\n\n".'});'."\n\n";
	}

	echo $script;
}

header('Content-Type: application/javascript');
echo getScripts($baseDir.'/submarine-bundler.js', $baseDir.'/examples/modules', [
	'items/cheese',
	'items/chicken',
	'items/onion',
	'recipe/index',
	'main',
]);