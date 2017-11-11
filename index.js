#! /usr/bin/env node

const FileSystem = require('fs');
const Path = require('path');
const rread = require('readdir-recursive');
const xml = require('xml');
const argv = require('minimist')(process.argv.slice(2));
const shell = require('shelljs');

const folder = argv.folder;

const toWindowsPath = path => path.replace(/\//, '\\');

const files = rread.fileSync(folder).map(file => ({
    File: [{
        _attr: {
            Path: file.substring(folder.length + 1),
            Url: toWindowsPath(file.substring(folder.length + 1)),
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

shell.ShellString(result).to('Elements.xml');