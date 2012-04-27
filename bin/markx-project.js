#!/usr/bin/env node

var program = require('commander');
var fs = require('fs');
var path = require('path');
var markx = require('markx');
var Masher = require('masher');
var exec = require('child_process').exec

program
  .version(JSON.parse(fs.readFileSync(__dirname + '/../package.json', 'utf8')).version)
  .usage('[options] <file>')
  .option('-o, --output <dir>', 'directory to write all assets')
  .option('-p, --preview <port>', 'start server to preview')
  .option('-t, --title <title>', 'page title')
  .option('-u, --user <user>', 'github user')
  .option('-r, --repo <repo>', 'github repo')
  .option('-d, --debug', 'use this option if you are building new templates')
  .option('-b, --build', 'use this option if you need to rebuild the assets')
  .parse(process.argv);


var files = program.args;

if (program.build || files.length == 1) {
  var file = files[0];
  var assets = path.join(__dirname, '../');
  var output = program.output || process.cwd();
  var options = {
    input: file,
    template: assets + '/layout/template.jade',
    preview: program.preview,
    data: {
      pageTitle: program.title,
      user: program.user,
      repo: program.repo,
      preview: (program.preview)
    },
    masher: {
      assetPath: assets,
      publicPath: (program.preview || program.debug) ? assets : output,
      outputDir: 'dist',
      mappingPath: assets+'/ui/masher-mapping.json',
      groups: {
        common: {
          styles: [
            'ui/common.css',
            'ui/ir_black.css',
            'ui/hubinfo/hubinfo.css'
          ],
          scripts: [
            'ui/jquery.min.js',
            'ui/jquery.toc.js',
            'ui/hubinfo/hubinfo.js',
            'ui/hubinfo-template.js'
          ]
        }
      },
      plugins: {
        pre: [
          'stylus'
        ],
        post: [
          'hash'
        ]
      }
    }
  };

  //copy images
  if (!program.preview) {
    var imgSrc = path.join(assets, 'dist/images');
    var imgDest = path.join(options.masher.publicPath, options.masher.outputDir, 'images');
    exec('mkdir -p '+ imgDest + ' && cp -r ' + imgSrc + '/* ' + imgDest);
  }

  options.masher = new Masher(options.masher, false);
  if (!program.preview) {
    options.masher.build();
  }
  if (program.debug) {
    options.masher.debug = true;
  }

  if (options.build) {
  } else if (options.preview) {
    markx.preview(file, options);
  } else {
    markx.convert(file, options, function(out) {
      fs.writeFile(output+'/index.html', out);
    });
  }


} else {
  process.stdout.write(program.helpInformation());
  program.emit('--help');
  process.exit(1);
}


