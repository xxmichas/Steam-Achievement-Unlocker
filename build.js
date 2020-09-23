var packager = require('electron-packager');
var options = {
    'arch': 'x64',
    'platform': 'win32',
    'dir': './',
    'app-copyright': 'xxmichas',
    'app-version': '1.0.0',
    'asar': false,
    'icon': './ico.ico',
    'name': 'Achievement Unlocker',
    'ignore': ['./releases', './.git'],
    'out': './',
    'overwrite': true,
    'prune': true,
    'version-string':{
      'CompanyName': 'xxmichas',
      'FileDescription': 'Achievement Unlocker',
      'OriginalFilename': 'Achievement Unlocker',
      'ProductName': 'Achievement Unlocker',
      'InternalName': 'Achievement Unlocker'
    }
};
packager(options, function done_callback(err, appPaths) {
    console.log(err);
    console.log(appPaths);
});