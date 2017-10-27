var fs = require('fs')
var path = require('path')

var pngcrunsh
var pngquant

/**
 * 该插件会判断 build 仓库是否存在了已经编译过的图片，如果存在则跳过压缩，直接返回uid仓库里面的文件
 * 需要传参 conf 里的 distPath ，作为 release 路径的根目录
 */
module.exports = function(content, file, conf) {
  var targetPath = conf.distPath

  if (targetPath) {
    var targetFile = path.join(targetPath, file.getHashRelease())
    if (fs.existsSync(targetFile)) {
      return fs.readFileSync(targetFile)
    }
  }

  var C
  if (conf.type === 'pngquant') {
    if (typeof pngquant === 'undefined') {
      try {
        pngquant = require('node-pngquant-native')
      } catch (e) {
        pngquant = false
        fis.log.warning(
          'node-pngquant-native does not support your node ' +
            process.version +
            ', report it to https://github.com/mz-team/mz-optimizer-png-compress/issues'
        )
      }
    }
    C = pngquant
  } else {
    if (typeof pngcrunsh === 'undefined') {
      try {
        pngcrunsh = require('node-pngcrush')
      } catch (e) {
        pngcrunsh = false
        fis.log.warning(
          'node-pngcrush does not support your node ' +
            process.version +
            ', report it to https://github.com/mz-team/mz-optimizer-png-compress/issues'
        )
      }
    }
    C = pngcrunsh
  }
  if (C && C.compress) {
    return C.option(conf).compress(content)
  } else {
    return content
  }
}
