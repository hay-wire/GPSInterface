/**
 * Created by haywire on 12/6/14.
 */

// Load `*.js` under current directory as properties
//  i.e., `gt02a.js` will become `exports['gt02a']` or `exports.gt02a`
require('fs').readdirSync(__dirname + '/').forEach(function(file) {
	if (file.match(/.+\.js/g) !== null && file !== 'index.js') {
		var name = file.replace('.js', '');
		exports[name] = require('./' + file);
	}
});