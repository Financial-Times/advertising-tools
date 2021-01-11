const babel = require('rollup-plugin-babel');
const commonjs = require('@rollup/plugin-commonjs');
const nodeResolve = require('@rollup/plugin-node-resolve').default;
const pkg = require('./package.json');

//const external = [...Object.keys(pkg.dependencies), ...Object.keys(pkg.peerDependencies)]

module.exports = [
  {
    input: 'src/index.js',
    //external,
    external: [],
    output: {
      file: pkg.main,
      format: 'es',
      sourcemap: false
    },
    plugins: [
      nodeResolve(),
      commonjs({
        include: /node_modules/
      }),
      babel({
        exclude: "node_modules/**",
        runtimeHelpers: true
      })
    ]
  }
]
