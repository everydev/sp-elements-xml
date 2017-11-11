#! /usr/bin/env node

const FileSystem = require('fs');
const Path = require('path');
const rread = require('readdir-recursive');
const xml = require('xml');
const argv = require('minimist')(process.argv.slice(2));
const shell = require('shelljs');

const toWindowsPath = path => path.replace(/\//g, '\\');

const files = rread.fileSync(argv.folder).map(file => ({
    File: [{
        _attr: {
            Path: `${argv.module}\\${toWindowsPath(file)}`,
            Url: `${argv.module}/${file}`,
            ReplaceContent: 'TRUE',
        },
    }],
}));

const elements = [{
    Elements: [
        {
            _attr: {
                xmlns: 'http://schemas.microsoft.com/sharepoint/'
            }
        },
        {
            Module: files.concat({
                _attr: {
                    Name: argv.module 
                }
            })
        }
    ]
}];

const result = xml(elements, { declaration: true, indent: '\t' });

shell.ShellString(result).to(argv.folder + '/Elements.xml');