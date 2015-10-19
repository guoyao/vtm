#!/usr/bin/env node

/**
 * @file
 * @author guoyao(guoyao.me@gmail.com)
 */

var path = require('path');
var app = require('commander');
var shell = require('shelljs');

var util = require('./util');
var vtm = require('./vtm');

app.parse(process.argv);

if (!app.args.length) {
    vtm.list();
}

var theme = app.args[0];

if (vtm.themes.indexOf(theme) < 0) {
    util.fatal('invalid theme "' + theme + '", valid themes as follow:', null, function () {
        util.info(vtm.themes.join('\n'));
    });
}

var THEME_VIM_PATH = path.join(vtm.VIM_VTM_HOME, '.vim');
var THEME_VIMRC_PATH = path.join(vtm.VIM_VTM_HOME, '.vimrc');

if (theme === 'system') {
    restore();
    clean();
    util.info('Congratulation! Now, theme has restored to "%s"', theme);
    util.setEnv('TERM', '', true);
    process.exit();
}
else {
    backup();
    clean();
    shell.cp('-r', util.buildPath('themes', theme, 'vim', '*'), THEME_VIM_PATH);
    shell.cp(util.buildPath('themes', theme, 'vimrc'), THEME_VIMRC_PATH);
    shell.cp('-r', util.buildPath('plugins', 'bundle', '*'), path.join(THEME_VIM_PATH, 'bundle'));
    shell.test('-d', vtm.VIM_BACKUP_PATH) && shell.rm('-rf', vtm.VIM_PATH);
    shell.test('-f', vtm.VIMRC_BACKUP_PATH) && shell.rm('-f', vtm.VIMRC_PATH);
    shell.ln('-sf', THEME_VIM_PATH, vtm.VIM_PATH);
    shell.ln('-sf', THEME_VIMRC_PATH, vtm.VIMRC_PATH);
    util.info('Congratulation! Now, theme has changed to "%s"', theme);
    util.setEnv('TERM', 'xterm-256color', true);
    process.exit();
}

/**
 * remove .vim and .vimrc which created by vtm
 */
function clean() {
    shell.test('-e', THEME_VIM_PATH) && shell.rm('-rf', THEME_VIM_PATH);
    shell.test('-e', THEME_VIMRC_PATH) && shell.rm('-f', THEME_VIMRC_PATH);
}

/**
 * backup system vim confg before vim confg changing
 */
function backup() {
    if (shell.test('-d', vtm.VIM_PATH) && !shell.test('-L', vtm.VIM_PATH)) {
        shell.test('-e', vtm.VIM_BACKUP_PATH) && shell.rm('-rf', vtm.VIM_BACKUP_PATH);
        shell.mkdir(vtm.VIM_BACKUP_PATH);
        shell.cp('-r', path.join(vtm.VIM_PATH, '*'), vtm.VIM_BACKUP_PATH);
    }
    if (shell.test('-f', vtm.VIMRC_PATH) && !shell.test('-L', vtm.VIMRC_PATH)) {
        shell.test('-e', vtm.VIMRC_BACKUP_PATH) && shell.rm('-f', vtm.VIMRC_BACKUP_PATH);
        shell.cp(vtm.VIMRC_PATH, vtm.VIMRC_BACKUP_PATH);
    }
}

/**
 * restore vim config to system from backup
 */
function restore() {
    if (shell.test('-L', vtm.VIM_PATH) && shell.test('-d', vtm.VIM_BACKUP_PATH)) {
        shell.rm('-rf', vtm.VIM_PATH);
        shell.mv(vtm.VIM_BACKUP_PATH, vtm.VIM_PATH);
    }
    if (shell.test('-L', vtm.VIMRC_PATH) && shell.test('-f', vtm.VIMRC_BACKUP_PATH)) {
        shell.rm('-f', vtm.VIMRC_PATH);
        shell.mv(vtm.VIMRC_BACKUP_PATH, vtm.VIMRC_PATH);
    }
}

