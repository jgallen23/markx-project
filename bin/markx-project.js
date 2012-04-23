var program = require('commander');
var fs = require('fs');
var path = require('path');
var markx = require('markx');
var Masher = require('masher');

program
  .version(JSON.parse(fs.readFileSync(__dirname + '/../package.json', 'utf8')).version)
  .usage('[options] <file>')
  .option('-o, --output <dir>', 'directory to write all assets')
  .option('-p, --preview <port>', 'start server to preview')
  .option('-d, --debug', 'use this option if you are building new templates')
  .parse(process.argv);


var files = program.args;

if (files.length == 1) {
  var file = files[0];
  var assets = path.join(__dirname, '../');
  var output = program.output || process.cwd();
  var options = {
    input: file,
    template: assets + '/layout/template.jade',
    preview: program.preview,
    data: {
      pageTitle: 'Project name',
      user: 'jgallen23',
      repo: 'toc',
      preview: (program.preview)
    },
    masher: {
      assetPath: assets,
      publicPath: (program.debug) ? assets : output,
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
            'ui/hubinfo/hubinfo.js'
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

  options.masher = new Masher(options.masher, false);
  if (program.debug) {
    options.masher.debug = true;
    options.masher.build();
    options.masher.debug = true;
  }

  if (options.preview) {
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


