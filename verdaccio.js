var fs = require('fs');
var path = require('path');
var http = require('http');
var execSync = require('child_process').execSync;

// 起動
startVerdaccio();


/**
 * verdaccioをdaemon起動します。
 */
function startVerdaccio() {
    // verdaccioがグローバルに無ければ何もしない
    if (getGlobalPkgVer('verdaccio', true) === undefined) {
        console.log('\u001b[31mVerdaccioがインストールされていません。\u001b[0m');
        console.log('環境構築手順を参考にVerdaccioをインストールして下さい。');
        console.log('https://jira.broadleaf.jp/wiki/pages/viewpage.action?pageId=3901687');
        return false;
    }

    // daemon起動するのでforeverをインストール
    if (getGlobalPkgVer('forever') === undefined) {
        execSync('npm install forever@1.0.0 -g --silent --registry=https://registry.npmjs.org/');
    }

    // verdaccioが起動していない場合はdaemon起動する
    http.get('http://localhost:4873/').on('error', e => {
        var npmRoot = execSync('npm root -g').toString().trim();
        var forever = require(path.join(npmRoot, 'forever'));
        forever.startDaemon(path.join(npmRoot, 'verdaccio/bin/verdaccio'));
        console.log('start verdaccio -> http://localhost:4873/');
    });

    return true;
}


/**
 * グローバルインストールされているnpmパッケージのバージョンを取得します。
 * 指定パッケージが未インストールの場合はundefinedを返却します。
 *
 * @param {string} name パッケージ名
 * @returns {string} バージョン
 */
function getGlobalPkgVer(name) {
    var execSync = require('child_process').execSync;

    var version;
    try {
        var result =  execSync('npm -g ls ' + name + ' --depth=0 --silent');
        if (result !== undefined) {
            var package = result.toString().split('\n').find(res => {
                return res.indexOf(name) != -1;
            });


            version = package.substring(package.indexOf(name)).split('@')[1];
        }
    } catch (e) {
    }

    return version === undefined ? version : version.trim();
}
