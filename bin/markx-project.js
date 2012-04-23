

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
  .parse(process.argv);


var files = program.args;

if (files.length == 1) {
  var file = files[0];
  var assets = path.join(__dirname, '../');
  console.log(assets);
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
      outputPath: output+'/dist',
      urlPath: '/dist',
      groups: {
        common: {
          styles: [
            'ui/common.css',
            'ui/ir_black.css',
            'ui/vendor/hubinfo/dist/hubinfo.css'
          ],
          scripts: [
            'ui/jquery.min.js',
            'ui/jquery.toc.js',
            'ui/vendor/hubinfo/dist/hubinfo.js',
            'ui/vendor/hubinfo/dist/templates/social.js'
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

  options.masher = new Masher(options.masher, (options.preview));

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


