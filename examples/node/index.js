
var http = require('http')
  , fs   = require('fs')
  , PORT = process.argv[2] || 1990
  , HOST = process.argv[3] || '0.0.0.0';

  var path = require('path');

var srcPath = 'src';
var id = 1;
var resArr = [];

var baseDir = __dirname + '/../..';

function getScripts(baseFile, dir, modules){
    var script = '"use strict";\n\n';
    script += fs.readFileSync(baseFile);
    modules.forEach(function(moduleName){
      var file = dir + '/' + moduleName + '.js';
      script += '// Module ' + moduleName + '\n' + 'Submarine.register(\'' + moduleName + '\', function(require, exports, module){'
        + '\n\n' + fs.readFileSync(file) + '\n\n' + '});' + '\n\n';
    });
    return script;
}

http.createServer(function (req, res) {
  if(req.url.indexOf('script') == -1) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(fs.readFileSync(baseDir + '/examples/recipe.html'));
    res.end();
    return;
  }
  res.writeHead(200, {'Content-Type': 'application/javascript'});
  res.write(getScripts(baseDir + '/submarine-bundler.js', baseDir + '/examples/modules', [
    'items/cheese',
    'items/chicken',
    'items/onion',
    'recipe/index',
    'main',
  ]));
  res.end();
}).listen(PORT, HOST);

console.log('Server on port: ' + PORT);