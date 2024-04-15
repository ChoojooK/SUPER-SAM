const path = require('path');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const { babel } = require('@rollup/plugin-babel');
const { terser } = require('rollup-plugin-terser');
const { version } = require('../package.json');

const banner =
  '/**\n' +
  ' * This is SamJs.js v' + version + '\n' +
  ' *\n' +
  ' * A Javascript port of "SAM Software Automatic Mouth".\n' +
  ' *\n' +
  ' * (c) 2017-' + new Date().getFullYear() + ' Christian Schiffler\n' +
  ' *\n' +
  ' * @link(https://github.com/discordier/sam)\n' +
  ' *\n' +
  ' * @author 2017 Christian Schiffler <c.schiffler@cyberspectrum.de>\n' +
  ' */';

const resolve = p => {
  return path.resolve(__dirname, '../', p)
};

const buildSrc = [
  {
    name: '',
    entry: 'src/index.es6',
    dest: 'samjs',
    moduleName: 'SamJs',
  },
  {
    name: 'guessnum-demo',
    entry: 'src/guessnum.es6',
    dest: 'guessnum',
    moduleName: 'GuessNum',
  },
];

const builds = {};

buildSrc.forEach((file) => {
  ['umd', 'cjs', 'esm'].forEach((format) => {
    const nameSuffix = file.name ? '-' + file.name : '';
    const buildName = `${format}${nameSuffix}`;

    builds[`dev-${buildName}`] = createConfig(file, format, 'development');
    builds[`prod-${buildName}`] = createConfig(file, format, 'production');
  });
});

function createConfig(file, format, env) {
  const nameSuffix = file.name ? '-' + file.name : '';
  const suffix = format === 'umd' ? '' : `.${format}`;
  const entry = resolve(file.entry);
  const dest = resolve(`dist/${file.dest}${suffix}.js`);
  const moduleName = file.moduleName;

  const plugins = [
    nodeResolve(),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
    }),
  ];

  if (env === 'production') {
    plugins.push(terser());
  }

  return {
    input: entry,
    output: {
      file: dest,
      format: format,
      name: moduleName,
      banner: banner,
    },
    plugins: plugins,
    external: [],
  };
}

module.exports = builds;
