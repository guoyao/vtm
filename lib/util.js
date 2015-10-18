/**
 * @file
 * @author guoyao(guoyao.me@gmail.com)
 */

var chalk = require('chalk');
var u = require('underscore');

exports.info = function (format, str, needExit) {
    console.info(chalk.green(format), str || '');
    needExit && process.exit();
};

exports.fatal = function (format, str, beforeExitHandler) {
    console.error(chalk.red(format), str || '');
    if (u.isFunction(beforeExitHandler)) {
        var result = beforeExitHandler();
        result !== false && process.exit(1);
    }
};

