#!/usr/bin/env node

/**
 * @file
 * @author guoyao(guoyao.me@gmail.com)
 */

var fs = require('fs');
var path = require('path');
var app = require('commander');
var shell = require('shelljs');

var util = require('./util');

var vtm = {};
var HOME = process.env.HOME;

vtm.VIM_PATH = path.join(HOME, '.vim');
vtm.VIMRC_PATH = path.join(HOME, '.vimrc');

vtm.VIM_VTM_HOME = path.join(HOME, '.vtm');
vtm.VIM_BACKUP_PATH = path.join(vtm.VIM_VTM_HOME, '.vim_backup');
vtm.VIMRC_BACKUP_PATH = path.join(vtm.VIM_VTM_HOME, '.vimrc_backup');

vtm.themes = ['system'].concat(fs.readdirSync(util.buildPath('themes')));

/**
 * list available themes
 */
vtm.list = function () {
    util.info(vtm.themes.join('\n'), null, true);
};

app
    .version('0.0.3')
    .description('Vim Theme Manager');

app
    .command('list')
    .description('list available themes')
    .action(vtm.list);

/**
 * sub command, see ./vtm-use.js
 */
app.command('use <theme>', 'change theme');

app.parse(process.argv);

if (!shell.test('-e', vtm.VIM_VTM_HOME)) {
    shell.mkdir(vtm.VIM_VTM_HOME);
}

module.exports = exports = vtm;

