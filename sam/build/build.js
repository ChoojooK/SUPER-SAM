const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const rollup = require('rollup');
const { minify } = require('uglify-es');
const { promisify } = require('util');

const writeFileAsync = promisify(fs.writeFile);

async function build(builds) {
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
  }

  for (const config of builds) {
    await buildEntry(config);
  }
}

async function buildEntry(config) {
  const outConfig = config.output;
  delete config.output;
  const isProd = /min\.js$/.test(outConfig.file);

  const bundle = await rollup.rollup(config);
  const { output } = await bundle.generate(outConfig);
  const code = output[0].code;

  if (isProd) {
    const result = minify(code, {
      mangle: {
        // keep_classnames: true,
      },
      warnings: true,
      toplevel: true,
      output: {
        ascii_only: true,
      },
      compress: {
        properties: true,
        dead_code: true,
        conditionals: true,
        reduce_vars: true,
        keep_fnames: true,
      },
      sourceMap: {
        filename: path.basename(outConfig.file),
        url: path.basename(outConfig.file) + '.map',
      },
    });

    let minimized = (outConfig.banner ? outConfig.banner + '\n' : '') + result.code;
    if (result.error) console.error(result.error.message);
    if (result.warnings) console.warn(result.warnings);

    await Promise.all([
      write(outConfig.file, minimized, true),
      write(outConfig.file + '.map', result.map || '', true),
    ]);
  } else {
    await write(outConfig.file, code);
  }
}

async function write(dest, code, zip) {
  await writeFileAsync(dest, code);
  if (zip) {
    const zipped = zlib.gzipSync(code);
    console.log(`${blue(path.relative(process.cwd(), dest))} ${getSize(code)} (gzipped: ${getSize(zipped)})`);
    await writeFileAsync(dest + '.gz', zipped);
  } else {
    console.log(`${blue(path.relative(process.cwd(), dest))} ${getSize(code)}`);
  }
}

function getSize(code) {
  return (code.length / 1024).toFixed(2) + 'kb';
}

function blue(str) {
  return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m';
}

module.exports = build;
