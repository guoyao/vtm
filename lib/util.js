/**
 * @file
 * @author guoyao(guoyao.me@gmail.com)
 */

var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var u = require('underscore');
var shell = require('shelljs');

var documentRoot = path.join(__dirname, '..');

var HOME = process.env.HOME;

var ENV_PATH = path.join(HOME, '.bash_profile');
!fs.existsSync(ENV_PATH)
    && !fs.existsSync(ENV_PATH = path.join(HOME, '.bashrc'))
    && (ENV_PATH = null);

exports.info = function (format, str, needExit) {
    console.info(chalk.green(format), str || '');
    needExit && process.exit();
};

exports.warning = function (format, str, needExit) {
    console.info(chalk.yellow(format), str || '');
    needExit && process.exit();
};

exports.fatal = function (format, str, beforeExitHandler) {
    console.error(chalk.red(format), str || '');
    if (u.isFunction(beforeExitHandler)) {
        var result = beforeExitHandler();
        result !== false && process.exit(1);
    }
};

exports.buildPath = function () {
    var args = Array.prototype.slice.call(arguments);
    args.unshift(documentRoot);
    return path.join.apply(path, args);
};

/**
 * set environment variable in .bash_profile or .bashrc
 * such as: export TERM=xterm-256color
 *
 * @param {string} key name of env
 * @param {string} value value of env
 * @param {boolean} needReLogin need re login or not
 */
exports.setEnv = function (key, value, needReLogin) {
    if (shell.test('-f', ENV_PATH)) {
        var oldValue = shell.grep(key, ENV_PATH).replace(/\n|\r/g, '').split('=')[1];
        oldValue && (oldValue = oldValue.trim());
        if (oldValue !== value) {
            if (!value) {
                shell.sed('-i', 'export ' + key + '=' + oldValue, '', ENV_PATH);
            }
            else if (oldValue) {
                shell.sed('-i', key + '=' + oldValue, key + '=' + value, ENV_PATH);
            }
            else {
                fs.appendFileSync(ENV_PATH, 'export ' + key + '=' + value + '\n', 'utf8');
            }
            shell.exec('export ' + key + '=' + value);
            needReLogin && exports.warning('Please re login or run command `source ~/.bash_profile` '
                + 'in terminal to table full effect.', null, true);
        }
    }
};

