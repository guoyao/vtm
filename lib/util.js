/**
 * @file
 * @author guoyao(guoyao.me@gmail.com)
 */

var path = require('path');
var chalk = require('chalk');
var u = require('underscore');

var documentRoot = path.join(__dirname, '..');

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

