var fs = require('fs')
  , path = require('path')
  , marked = require('marked')
  ;



module.exports = function(dir) {
  var data = {};
  fs.readdirSync(dir).forEach(function (filename) {
    var filepath = path.join(dir, filename);
    var content = fs.readFileSync(filepath, 'utf8');
    var html = marked(content);
    data['content-' + path.basename(filename, '.md')] = html;
  });
  return data;
}