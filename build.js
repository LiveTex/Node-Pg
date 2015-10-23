

var fs = require('fs');


/**
 * @namespace
 */
var build = {};


/**
 * @type {string}
 */
build.__PROJECT_PATH = __dirname;


/**
 * @type {string}
 */
build.__BUILD_PATH = build.__PROJECT_PATH + '/bin';


/**
 * @type {string}
 */
build.__GIP_BUILD_PATH = build.__PROJECT_PATH + '/build';


/**
 * @type {string}
 */
build.__CPP_NODES_PATH = build.__GIP_BUILD_PATH + '/Release';


/**
 * Moves build artifacts
 */
build.mv = function() {
  var files = fs.readdirSync(build.__CPP_NODES_PATH);

  for (var i = 0; i < files.length; i++) {
    var fileName = files[i].split('.');
    var l = fileName.length;

    if (l > 1 && fileName[l - 1] === 'node') {
      var nodeName = [fileName[l - 2], fileName[l - 1]].join('.');
      fs.renameSync(
          build.__CPP_NODES_PATH + '/' + nodeName,
          build.__BUILD_PATH + '/' + nodeName);
    }
  }
};


/**
 * Removes gyp artifacts
 */
build.clean = function(dirPath) {
  var files = fs.readdirSync(dirPath);

  for (var i = 0; i < files.length; i++) {
    var fileName = files[i];
    var path = dirPath + '/' + fileName;
    var stat = fs.statSync(path);

    if (fileName !== '.' || fileName !== '..') {
      if (stat.isDirectory()) {
        build.clean(path);
      } else if (stat.isFile()) {
        fs.unlinkSync(path)
      }

    }
  }

  fs.rmdirSync(dirPath);
};


build.mv();
build.clean(build.__GIP_BUILD_PATH);
