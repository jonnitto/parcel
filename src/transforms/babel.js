const babel = require('babel-core');
const path = require('path');
const config = require('../utils/config');

module.exports = async function (asset) {
  if (!(await shouldTransform(asset))) {
    return;
  }

  // console.time ('babel: ' + process.pid + ':' + asset.name)

  await asset.parseIfNeeded();

  let res = babel.transformFromAst(asset.ast, asset.contents, {code: false, filename: asset.name});
  asset.ast = res.ast;
  asset.isAstDirty = true;
  // console.timeEnd('babel: ' + process.pid + ':' + asset.name)
};

async function shouldTransform(asset) {
  if (/\.json$/.test(asset.name)) {
    return false;
  }

  if (asset.package && asset.package.babel) {
    return true;
  }

  // if (asset.package && asset.package.browserify && asset.package.browserify.transform && asset.package.browserify.transform.includes('babelify')) {
  //   return true;
  // }

  let babelrc = await config.resolve(asset.name, ['.babelrc', '.babelrc.js']);
  if (babelrc) {
    return true;
  }

  return false;
}
