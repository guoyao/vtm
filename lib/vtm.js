#!/usr/bin/env node

/**
 * @file
 * @author guoyao(guoyao.me@gmail.com)
 */

var fs = require('fs');
var path = require('path');
var app = require('commander');

var util = require('./util');

var vtm = {};
var HOME = process.env.HOME;

vtm.VIM_PATH = path.join(HOME, '.vim_test');
vtm.VIMRC_PATH = path.join(HOME, '.vimrc_test');
vtm.VIM_BACKUP_PATH = vtm.VIM_PATH + '_vtm_theme_system';
vtm.VIMRC_BACKUP_PATH = vtm.VIMRC_PATH + '_vtm_theme_system';
vtm.themes = ['system'].concat(fs.readdirSync(path.join(__dirname, '..', 'themes')));

/**
 * list available themes
 */
vtm.list = function () {
    util.info(vtm.themes.join('\n'), null, true);
};

app
    .version('0.0.1')
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

module.exports = exports = vtm;

